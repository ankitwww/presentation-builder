import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  colors
} from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFileOutlined';
import ImageIcon from '@material-ui/icons/Image';
import MicIcon from '@material-ui/icons/Mic';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import ArchiveIcon from '@material-ui/icons/ArchiveOutlined';
import EditIcon from '@material-ui/icons/Edit';
import bytesToSize from 'src/utils/bytesToSize';
import { usePresentationContext } from '../../../contexts/presentation';

const useStyles = makeStyles(theme => ({
  root: {},
  media: {
    height: 400,
    backgroundPosition: 'initial'
  },
  placeholder: {
    height: 240,
    backgroundColor: colors.blueGrey[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  insertDriveFileIcon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    fontSize: theme.spacing(6)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  actions: {
    justifyContent: 'center'
  },
  imageIcon: {
    marignRight: theme.spacing(1)
  },
  menu: {
    width: 250,
    maxWidth: '100%'
  }
}));

function FileCard({ file, className, ...rest }) {
  const classes = useStyles();
  const moreRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const {
    presentation,
    setPresentation,
    setSelectedItem
  } = usePresentationContext();

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const handleImageDelete = () => {
    console.log(
      'THis presentation Length ',
      presentation && presentation.images ? presentation.images.length : 0
    );
    if (presentation.images.length > 1) {
      const images = Array.from(presentation.images);
      const index = images.indexOf(file);
      if (index > -1) {
        images.splice(index, 1);
      }
      console.log('Remaining ', images.length, { ...presentation, images });
      setPresentation({ ...presentation, images });
    }
  };

  const handleNewImageUpload = event => {
    console.log(event.target.files[0]);
    const data = new FormData();
    data.append('file', event.target.files[0]);

    fetch(`/uploadImage/${presentation._id}/${file._id}`, {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(
        responseBody => {
          console.log(responseBody);
          if (responseBody.error) {
            console.log(responseBody.message);
          } else {
            const images = Array.from(presentation.images);
            const index = images.indexOf(file);
            console.log(responseBody, file, index, images[index]);
            if (index > -1) {
              images[index].url = responseBody.url;
              images[index].name = responseBody.name;
            }
            setPresentation({ ...presentation, images }, file);
          }
        },
        error => {
          console.log('error: ', error.message);
        }
      );
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardActions className={classes.actions}>
        <Button onClick={handleImageDelete}>
          <DeleteIcon className={classes.imageIcon} />
          Delete
        </Button>
        <Button disabled>
          <MicIcon className={classes.imageIcon} />
          Record Audio
        </Button>
        <Button>
          <ImageIcon className={classes.imageIcon} />
          <input
            type="file"
            name="file"
            accept="image/x-png,image/gif,image/jpeg"
            onChange={handleNewImageUpload}
          />
        </Button>
      </CardActions>
      <Divider />
      <CardMedia className={classes.media} image={file.url} />
    </Card>
  );
}

FileCard.propTypes = {
  className: PropTypes.string,
  file: PropTypes.object.isRequired
};

export default FileCard;
