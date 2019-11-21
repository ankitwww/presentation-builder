/* eslint-disable no-console */
import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import uuid from 'uuid/v1';
import { useDropzone } from 'react-dropzone';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  colors
} from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MoreIcon from '@material-ui/icons/MoreVert';
import bytesToSize from 'src/utils/bytesToSize';

const useStyles = makeStyles(theme => ({
  root: {},
  dropZone: {
    border: `1px dashed ${theme.palette.divider}`,
    padding: theme.spacing(6),
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: colors.grey[50],
      opacity: 0.5,
      cursor: 'pointer'
    }
  },
  dragActive: {
    backgroundColor: colors.grey[50],
    opacity: 0.5
  },
  image: {
    width: 130
  },
  info: {
    marginTop: theme.spacing(1)
  },
  list: {
    maxHeight: 320
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}));

function FilesDropzone({ className, ...rest }) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const history = useHistory();

  const handleDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
    if (
      acceptedFiles
      && acceptedFiles[0]
      && acceptedFiles[0].type === 'application/pdf'
    ) {
      setFiles(prevFiles => [].concat(acceptedFiles[0]));
      setUploadError('');
    }
  }, []);

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleFileUpload = () => {
    console.log('Uploading ', files.length, ' files');
    const data = new FormData();
    data.append('file', files[0]);
    setLoading(true);

    fetch('/uploadPDF', {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(
        responseBody => {
          setLoading(false);

          console.log(responseBody);
          if (responseBody.error) {
            setUploadError(responseBody.message);
          } else {
            console.log('Lets redirect to ', responseBody.presentation._id);
            history.push(`/build/${responseBody.presentation._id}`);
          }
        },
        error => {
          setLoading(false);
          setUploadError(error.message);
          console.log('error: ', error.message);
        }
      );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: 'application/pdf'
  });

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div
        className={clsx({
          [classes.dropZone]: true,
          [classes.dragActive]: isDragActive
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div>
          <img
            alt="Select PDF file"
            className={classes.image}
            src="/images/undraw_add_file2_gvbb.svg"
          />
        </div>
        <div>
          <Typography gutterBottom variant="h3">
            Select file
          </Typography>
          <Typography
            className={classes.info}
            color="textSecondary"
            variant="body1"
          >
            Drop file here / click 
{' '}
<Link underline="always">browse</Link>
{' '}
            thorough your machine
          </Typography>
        </div>
      </div>
      {files.length > 0 && (
        <>
          <PerfectScrollbar options={{ suppressScrollX: true }}>
            <List className={classes.list}>
              {files.map((file, i) => (
                <ListItem divider={i < files.length - 1} key={uuid()}>
                  <ListItemIcon>
                    <FileCopyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ variant: 'h5' }}
                    secondary={bytesToSize(file.size)}
                  />
                  <Tooltip title="More options">
                    <IconButton edge="end">
                      <MoreIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </PerfectScrollbar>
          <div className={classes.actions}>
            <Typography align="right">
              <br />
              {uploadError}
            </Typography>
            <Button onClick={handleRemoveAll} disabled={loading} size="small">
              Remove
            </Button>
            <Button
              onClick={handleFileUpload}
              color="secondary"
              size="small"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload file'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

FilesDropzone.propTypes = {
  className: PropTypes.string
};

export default FilesDropzone;
