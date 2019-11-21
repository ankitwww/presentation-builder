/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const PDF2Pic = require('pdf2pic');
const {
  uploadFileToBlockBlob,
  Aborter,
  BlobURL,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  StorageURL,
  SharedKeyCredential
} = require('@azure/storage-blob');
const Path = require('path');
const DBModel = require('./dbmodel');

const Presentation = DBModel.presentation;
const User = DBModel.user;
const MAX_PAGE_LIMIT = Number(process.env.MAX_PAGE_LIMIT) || 20;
const containerName = 'irabotdocs';

// Enter your storage account name and shared key
const account = 'ionabotdocstorage';
const accountKey =  'HTWAxfyB3vmXurXPw86yQTQkkdRw+36gk7scfnm1HHYa0XpEqGY8CNjjuKBq6xHMqe2Lvb/iQwzD3Mv794Lavw==';

// Use SharedKeyCredential with storage account and account key
const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

// Use sharedKeyCredential, tokenCredential or tokenCredential to create a pipeline
const pipeline = StorageURL.newPipeline(sharedKeyCredential);
const serviceURL = new ServiceURL(
  // When using AnonymousCredential, following url should include a valid SAS or support public access
  `https://${account}.blob.core.windows.net`,
  pipeline
);

const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
const generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const createPresentationAndReturn = function createPresentationAndReturn(
  req,
  res,
  fileLinks
) {
  const presentation = new Presentation({
    userId: req.user.userId,
    author: req.user.name,
    name: 'New Presentation',
    description: 'Description',

    creationDate: new Date(),
    lastModifiedDate: new Date()
  });
  presentation.images = fileLinks.map((link, index) => ({
    order: index,
    url: link.url,
    name: link.name
  }));
  presentation.save((err, saved) => {
    res.status(200).send({
      pagesConverted: saved.images.length,
      message: 'Presentation created',
      error: null,
      presentation: saved
    });
  });
};

exports.createPresentation = async (req, res) => {
  if (req.files && req.files.length) {
    console.log('=== createPresentation body ===', req.body, req.files.length);
    const fileLinks = [];

    try {
      const pdffile = req.files[0];
      const extn = Path.extname(pdffile.originalname);

      console.log(
        pdffile.originalname,
        'Size ==> ',
        pdffile.size,
        'Extn. ==> ',
        extn
      );
      // convert
      const pdf2pic = new PDF2Pic({
        density: 100, // output pixels per inch
        savename: generateUUID(),
        savedir: './server/uploads/images', // output file location
        format: 'png' // output file format
      });

      // lets try to fetch MAX_PAGE_LIMIT +1 pages - if it is successful, return without conversion
      const twentyPages = [...Array(MAX_PAGE_LIMIT + 1).keys()].map(x => ++x);

      await pdf2pic
        .convertBulk(pdffile.path, twentyPages)
        .then(async resolve => {
          console.log('MAX_PAGE_LIMIT reached');
          return res.status(500).send({
            pagesConverted: resolve.length,
            message: 'MAX_PAGE_LIMIT reached',
            error: true,
            presentation: null
          });
        })
        .catch(async error => {
          console.log(
            'Caught: Looks like PDF has less pages than MAX_PAGE_LIMIT',
            error
          );
          await pdf2pic.convertBulk(pdffile.path, -1).then(async resolve => {
            console.log('image converter successfully!');
            console.log(resolve);
            if (!resolve.length || resolve.length > MAX_PAGE_LIMIT) {
              return res.status(500).send({
                pagesConverted: resolve.length,
                message: 'MAX_PAGE_LIMIT reached',
                error: true,
                presentation: null
              });
            }
            // upload all pngs files to cloud
            for (let i = 0; i < resolve.length; i++) {
              const file = resolve[i];

              let tempblobName = `${file.name}`;
              tempblobName = tempblobName
                .replace(/ /g, '_')
                .replace('[', '_')
                .replace(']', '_');
              const blobName = tempblobName;
              const blobURL = BlobURL.fromContainerURL(containerURL, blobName);
              const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
              console.log(blobURL.url);
              fileLinks.push({
                url: blobURL.url,
                name: tempblobName
              });
              // Parallel uploading with uploadFileToBlockBlob in Node.js runtime
              // uploadFileToBlockBlob is only available in Node.js
              await uploadFileToBlockBlob(
                Aborter.none,
                file.path,
                blockBlobURL,
                {
                  blockSize: 20 * 1024 * 1024, // 4MB block size
                  parallelism: 20, // 20 concurrency,
                  metadata: {
                    tag: 'test'
                  },
                  progress: ev => console.log(ev)
                }
              );

              console.log(fileLinks);
              console.log('files uploaded....');
              if (i === resolve.length - 1) {
                createPresentationAndReturn(req, res, fileLinks);
              }
            }
          });
        });
    } catch (err) {
      console.log(err);
      res.status(500).send('something went wrong. Please try later');
    }
  } else {
    console.log('No file to upload...');
    res.status(500).send('something went wrong. Please try later');
  }
};

exports.savePresentation = async (req, res) => {
  console.log(req.body);
  Presentation.findById(req.body._id).exec((err, presentation) => {
    presentation.name = req.body.name;
    presentation.description = req.body.description;
    presentation.lastModifiedDate = new Date();
    const images = Array.from(req.body.images);
    presentation.images = [];
    images.forEach(img => {
      presentation.images.push({
        order: img.order,
        url: img.url,
        name: img.name
      });
    });

    presentation.save((err, saved) => {
      console.log(err);
      console.log('Now images are ', saved.images.length);
      res.status(200).send(JSON.stringify(saved));
    });
  });
};

exports.uploadImageForPresentation = async (req, res) => {
  if (req.files && req.files.length) {
    console.log(
      '=== uploadImageForPresentation body ===',
      req.body,
      req.files.length
    );
    const fileLinks = [];

    try {
      const file = req.files[0];
      const extn = Path.extname(file.originalname);

      console.log(
        file,
        file.originalname,
        'Size ==> ',
        file.size,
        'Extn. ==> ',
        extn
      );

      let tempblobName = `${file.filename}`;
      tempblobName = tempblobName
        .replace(/ /g, '_')
        .replace('[', '_')
        .replace(']', '_');
      const blobName = tempblobName;
      const blobURL = BlobURL.fromContainerURL(containerURL, blobName);
      const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);
      console.log(blobURL.url);
      fileLinks.push({
        url: blobURL.url,
        name: tempblobName
      });
      // Parallel uploading with uploadFileToBlockBlob in Node.js runtime
      // uploadFileToBlockBlob is only available in Node.js
      await uploadFileToBlockBlob(Aborter.none, file.path, blockBlobURL, {
        blockSize: 20 * 1024 * 1024, // 4MB block size
        parallelism: 20, // 20 concurrency,
        metadata: {
          tag: 'test'
        },
        progress: ev => console.log(ev)
      });

      console.log(fileLinks);
      console.log('files uploaded....');
      res.status(200).send(JSON.stringify(fileLinks[0]));
      // UpdatePresentationAndReturn(req, res, fileLinks);
    } catch (err) {
      console.log(err);
      res.status(500).send('something went wrong. Please try later');
    }
  } else {
    console.log('No file to upload...');
    res.status(500).send('something went wrong. Please try later');
  }
};

exports.getPresentations = (req, res) => {
  Presentation.find({ userId: req.user.userId }).exec((err, data) => {
    if (err) {
      return res.status(500).send('Something went wrong. Please try later');
    }
    return res.status(200).send(JSON.stringify(data));
  });
};

exports.getPresentationById = (req, res) => {
  Presentation.findById(req.params.id).exec((err, data) => {
    if (err) {
      return res.status(500).send('Something went wrong. Please try later');
    }
    return res.status(200).send(JSON.stringify(data));
  });
};

exports.getManifest = (req, res) => {
  Presentation.findById(req.params.id).exec((err, data) => {
    if (err) {
      return res.status(500).send('Something went wrong. Please try later');
    }
    return res.status(200).send(
      JSON.stringify({
        author: data.author,
        creationDate: data.creationDate,
        name: data.name,
        description: data.description,
        images: data.images
      })
    );
  });
};
