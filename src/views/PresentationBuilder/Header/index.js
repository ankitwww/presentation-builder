import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
 Typography, Grid, Button, colors 
} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import ExportIcon from '@material-ui/icons/GetApp';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Label from 'src/components/Label';

const useStyles = makeStyles(theme => ({
  root: {},
  label: {
    marginTop: theme.spacing(1)
  },
  shareButton: {
    backgroundColor: theme.palette.common.white,
    marginRight: theme.spacing(2)
  },
  shareIcon: {
    marginRight: theme.spacing(1)
  },
  applyButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

function Header({ presentation, className, ...rest }) {
  const classes = useStyles();
  const [openApplication, setOpenApplication] = useState(false);

  const handleApplicationOpen = () => {
    setOpenApplication(true);
  };

  const handleApplicationClose = () => {
    setOpenApplication(false);
  };

  const urlToPromise = url => new Promise((resolve, reject) => {
      JSZipUtils.getBinaryContent(url, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  const handleExport = () => {
    console.log('handle Export ', JSZip.support.blob);
    if (JSZip.support.blob) {
      const zip = new JSZip();
      axios.get(`/api/presentationById/${presentation._id}`).then(response => {
        console.log(response.data);
        const savedPresentation = response.data;
        savedPresentation.images.forEach((file, index) => {
          zip.file(file.name, urlToPromise(file.url), {
            binary: true
          });
        });
        // manifest
        zip.file(
          'manifest.json',
          urlToPromise(`/api/manifest/${savedPresentation._id}/manifest.json`),
          {
            binary: true
          }
        );

        zip
          .generateAsync({
            type: 'blob'
          })
          .then(content => {
            let zipFilename = `${savedPresentation.name}_${savedPresentation._id}_.zip`;
            zipFilename = zipFilename.replace(/ /g, '_');

            saveAs(content, zipFilename);
          });
      });
    }
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Grid alignItems="flex-end" container justify="space-between" spacing={3}>
        <Grid item>
          <Typography component="h1" gutterBottom variant="h3">
            {presentation.name}
          </Typography>
          <Label
            className={classes.label}
            color={colors.green[600]}
            variant="outlined"
          >
            Last Update 
{' '}
{moment(presentation.lastModifiedDate).fromNow()}
          </Label>
        </Grid>
        <Grid item>
          <Button
            onClick={handleExport}
            className={classes.shareButton}
            variant="contained"
          >
            <ExportIcon className={classes.shareIcon} />
            Export
          </Button>
          {/* <Button className={classes.shareButton} variant="contained">
            <OpenInNewIcon className={classes.shareIcon} />
            View
          </Button> */}
        </Grid>
      </Grid>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  presentation: PropTypes.object.isRequired
};

Header.defaultProps = {};

export default Header;
