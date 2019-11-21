import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Paper,
  Typography
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {
  EditorState,
  convertFromRaw,
  ContentState,
  convertFromHTML,
  convertToRaw
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import SuccessSnackbar from '../../Settings/General/SuccessSnackbar';
import './react-draft-wysiwyg.css';
import { usePresentationContext } from '../../../contexts/presentation';

const useStyles = makeStyles(theme => ({
  root: {},
  button: {
    margin: '15px',
    float: 'right'
  },
  deliverables: {
    marginTop: theme.spacing(3)
  },
  members: {
    marginTop: theme.spacing(3)
  },
  editor: {
    marginTop: '15px',
    marginBottom: '15px'
  }
}));

function Overview({ className, ...rest }) {
  const classes = useStyles();
  const { presentation, setPresentation } = usePresentationContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editorState, onChange] = useState(null);
  const handleNameChange = (event, field, value) => {
    console.log(event, field, value);
    setPresentation({ ...presentation, name: value });
  };

  useEffect(() => {
    const contentState = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(presentation.description)
      )
    );
    console.log('updating', contentState);
    onChange(contentState);
  }, [presentation.description]);

  const handleSavePresentation = () => {
    const description = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    axios
      .post('/api/savePresentation', { ...presentation, description })
      .then(response => {
        console.log('savePresentation: ', response);
        setOpenSnackbar(true);
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <SuccessSnackbar onClose={handleSnackbarClose} open={openSnackbar} />
      <Card {...rest} className={clsx(classes.root, className)}>
        <CardContent>
          <Button
            className={classes.button}
            color="secondary"
            variant="contained"
            onClick={handleSavePresentation}
          >
            <SaveIcon className={classes.iconBefore} />
            Save
          </Button>
          <br />
          <form>
            <div className={classes.formGroup}>
              <Typography className={classes.editor} variant="h4">
                Presentation Name
              </Typography>
              <TextField
                fullWidth
                name="name"
                onChange={event => handleNameChange(event, 'name', event.target.value)}
                value={presentation.name}
                variant="outlined"
              />
            </div>
            <div className={classes.formGroup}>
              <div className={classes.fieldGroup}>
                <Typography className={classes.editor} variant="h4">
                  Description
                </Typography>
                <Editor
                  class={classes.editorBox}
                  editorState={editorState}
                  wrapperClassName="demo-wrapper"
                  editorClassName="editer-content"
                  onEditorStateChange={onChange}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

Overview.propTypes = {
  className: PropTypes.string
};

export default Overview;
