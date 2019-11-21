/* eslint-disable no-bitwise */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const Path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const multer = require('multer');

const Setting = require('./../setting');

dotenv.config();

const app = express();
const port = process.env.SERVERPORT || 1338;

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(
  bodyParser.json({
    limit: 1024 * 1024 * 20,
    type: 'application/json'
  })
);
// get information from html forms
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// connect to our database
mongoose.connect(process.env.MONGOURL);

// pass passport for configuration
const passportconfig = require('./passport')(passport);

app.use(
  session({
    secret: 'wehacktogether',
    store: new MongoStore({
      url: process.env.MONGOURL
    })
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// multer

const storage = multer.diskStorage({
  // multers disk storage settings
  destination(req, file, cb) {
    cb(null, './server/uploads/');
  },
  filename(req, file, cb) {
    const datetimestamp = Date.now();
    cb(
      null,
      `${file.fieldname}-${datetimestamp}.${
        file.originalname.split('.')[file.originalname.split('.').length - 1]
      }`
    );
  }
});

const upload = multer({
  // multer settings
  storage
});

// controllers
const PresentationCtrl = require('./presentationController');
// routes
app.get('/', (req, res) => {
  res.sendFile(Path.join(Setting.PROJECT_DIR, 'build', 'index.html'));
});

app.post(
  '/uploadPDF',
  upload.array('file', 1),
  PresentationCtrl.createPresentation
);
app.post('/api/savePresentation', PresentationCtrl.savePresentation);
app.post(
  '/uploadImage/:presentationId/:imageId',
  upload.array('file', 1),
  PresentationCtrl.uploadImageForPresentation
);

app.get('/api/presentations', PresentationCtrl.getPresentations);
app.get('/api/presentationById/:id', PresentationCtrl.getPresentationById);
app.get('/api/manifest/:id/manifest.json', PresentationCtrl.getManifest);
app.get('/getAuth', (req, res) => {
  console.log(
    'Get Auth ',
    req.user ? req.user.email : '',
    req.isAuthenticated()
  );
  res.status(200).send(JSON.stringify(req.user));
});

app.get('/static/*', (req, res) => {
  let { path } = req;
  path = path.replace('/static/', '/build/static/');
  res.sendfile(Setting.PROJECT_DIR + path);
});
app.get('/images/*', (req, res) => {
  let { path } = req;
  path = path.replace('/images/', '/build/images/');
  res.sendfile(Setting.PROJECT_DIR + path);
});

app.get('/favicon.ioc', (req, res) => {
  let { path } = req;
  path = '/build/favicon.ico';
  res.sendfile(Setting.PROJECT_DIR + path);
});

app.get('/manifest.json', (req, res) => {
  let { path } = req;
  path = '/build/manifest.json';
  res.sendfile(Setting.PROJECT_DIR + path);
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    console.log('Req.User ', req.user.email, req.isAuthenticated());
    res.redirect('/build');
  }
);
app.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send('logged out');
});

app.get('*', (req, res) => {
  res.sendFile(Path.join(`${Setting.PROJECT_DIR}/build/index.html`));
});

// Create an HTTP service and prepare route lists.
http.createServer(app).listen(port);
console.log(`Server started on port ${port}`);
