import React, { Component, useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  colors,
  Grid
} from '@material-ui/core';
import axios from 'axios';

import Alert from 'src/components/Alert';
import AddIcon from '@material-ui/icons/Add';
import PreviewIcon from '@material-ui/icons/Slideshow';
import SaveIcon from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import RootRef from '@material-ui/core/RootRef';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FileCard from './FileCard';
import { usePresentationContext } from '../../../contexts/presentation';
import SuccessSnackbar from '../../Settings/General/SuccessSnackbar';

const useStyles = makeStyles(theme => ({
  root: {},
  button: {
    margin: '15px'
  },
  active: {
    boxShadow: `inset 4px 0px 0px ${theme.palette.primary.main}`,
    backgroundColor: colors.grey[500]
  },
  files: {
    marginTop: theme.spacing(3)
  },
  avatar: {
    height: 50,
    width: 50
  },
  fileList: {
    flexBasis: 300,
    flexShrink: 0,
    '@media (min-width: 864px)': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  }
}));

function Files({ className, ...rest }) {
  const classes = useStyles();
  const {
    presentation,
    selectedFile,
    setPresentation,
    setSelectedItem
  } = usePresentationContext();

  if (!selectedFile) {
    setSelectedItem(presentation.images[0]);
  }
  const setItems = (items, isSelectedUpdate) => {
    setPresentation({ ...presentation, images: items });
    if (isSelectedUpdate) {
      setSelectedItem(items[items.length - 1]);
    }
  };
  const [openAlert, setOpenAlert] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    setSelectedItem(presentation.images[0]);
  }, [presentation.images, setSelectedItem]);

  const generateUUID = () => {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const handleNewPageAddition = () => {
    if (presentation.images.length < 20) {
      setOpenAlert(false);
      const result = Array.from(presentation.images);
      result.push({
        _id: generateUUID(),
        order: presentation.images.length,
        url:
          'https://ionabotdocstorage.blob.core.windows.net/irabotdocs/file-1574268745702.png',
        name: 'Sample.png'
      });
      setItems(result, true);
    } else {
      setOpenAlert(true);
    }
  };

  const handleSavePresentation = () => {
    axios.post('/api/savePresentation', presentation).then(response => {
      console.log('savePresentation: ', response);
      setOpenSnackbar(true);
    });
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setPresentation(result, result[startIndex]);
    return result;
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
      background: 'rgb(235,235,235)'
    })
  });

  const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? "lightblue" : "lightgrey"
  });

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const reorderedItems = reorder(
      presentation.images,
      result.source.index,
      result.destination.index
    );
    setItems(reorderedItems);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity

  return (
    <>
      <SuccessSnackbar onClose={handleSnackbarClose} open={openSnackbar} />
      <Grid
        {...rest}
        className={clsx(classes.root, className)}
        container
        spacing={3}
      >
        <Grid lg={12}>
          <Card>
            <CardContent className={classes.content}>
              {/* <Button className={classes.button} variant="contained">
                Default
              </Button>
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
              >
                Primary
              </Button> */}

              <Button
                className={classes.button}
                color="secondary"
                variant="contained"
                onClick={handleNewPageAddition}
              >
                <AddIcon className={classes.iconBefore} />
                New Page
              </Button>
              <Button
                disabled
                className={classes.button}
                color="secondary"
                variant="contained"
              >
                <PreviewIcon className={classes.iconBefore} />
                Preview
              </Button>
              <Button
                className={classes.button}
                color="secondary"
                variant="contained"
                onClick={handleSavePresentation}
              >
                <SaveIcon className={classes.iconBefore} />
                Save
              </Button>
            </CardContent>
          </Card>
          {openAlert && (
            <Alert
              className={classes.alert}
              message="You can not add more than 20 pages"
              onClose={handleAlertClose}
            />
          )}
        </Grid>
        <Grid lg={1}>
          {presentation.images && presentation.images.length && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <RootRef rootRef={provided.innerRef}>
                    <List
                      style={getListStyle(snapshot.isDraggingOver)}
                      className={classes.fileList}
                    >
                      {presentation.images.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <ListItem
                              onClick={() => {
                                setSelectedItem(item);
                              }}
                              className={clsx(
                                {
                                  [classes.active]:
                                    selectedFile &&
                                    selectedFile._id === item._id
                                },
                                className
                              )}
                              ContainerComponent="li"
                              ContainerProps={{ ref: provided.innerRef }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  alt="File"
                                  className={classes.avatar}
                                  src={item.url}
                                />
                              </ListItemAvatar>
                              <ListItemSecondaryAction />
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  </RootRef>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Grid>
        <Grid lg={11}>{selectedFile && <FileCard file={selectedFile} />}</Grid>
      </Grid>
    </>
  );
}

Files.propTypes = {
  className: PropTypes.string
};

export default Files;
