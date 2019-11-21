/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';
import axios from 'axios';
import clsx from 'clsx';
import moment from 'moment';

import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import FileDropzone from 'src/components/FileDropzone';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  colors
} from '@material-ui/core';
import { useAuth } from '../../contexts/auth';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(2),
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flexWrap: 'wrap'
    },
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  },
  header: {
    maxWidth: '100%',
    width: 240,
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
      flexBasis: '100%'
    }
  },
  heading: {
    marginTop: '30px',
    marginBottom: '15px'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  stats: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  },
  actions: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexBasis: '50%'
    }
  }
}));

function New({ component: Component, ...rest }) {
  const classes = useStyles();
  const [presentations, setPresentations] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userId, setUserId] = useState(false);
  const { authTokens, setAuthTokens } = useAuth();
  const history = useHistory();

  const handleViewPresentation = id => {
    // history.push(`/build/${id}/files`);
  };

  useEffect(() => {
    axios
      .get('/getAuth')
      .then(result => {
        console.log(result.data, result.status);
        if (result.status === 200 && result.data.userId) {
          setAuthTokens(result.data);
          setLoggedIn(true);
          setUserId(result.data.userId);
          setLoading(false);
        } else {
          setLoggedIn(false);
          setIsError(true);
          setLoading(false);
        }
      })
      .catch(e => {
        setIsError(true);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    axios
      .get('/api/presentations')
      .then(response => {
        console.log(response.data, response.status);

        setPresentations(Array.from(response.data));
      })
      .catch(e => {
        setIsError(true);
      });
  }, [isLoggedIn]);

  return (
    <>
      {loading ? (
        'Loading...'
      ) : isLoggedIn ? (
        <Page className={classes.root} title="My Presentation">
          <Container maxWidth="lg">
            <Typography
              component="h1"
              className={classes.heading}
              gutterBottom
              variant="h3"
            >
              My Presentations
            </Typography>
            <Divider />
            {Array.from(presentations).map((item, index) => (
              <Card key={index} {...rest}>
                <CardContent className={classes.content}>
                  <div className={classes.header}>
                    <Avatar
                      alt="Presentation"
                      className={classes.avatar}
                      src={item.images[0].url}
                    />
                    <div>{item.name}</div>
                  </div>
                  <div className={classes.stats}>
                    <Typography variant="h6">
                      {item.lastUpdatedOn}
                      {item.createdOn}
                    </Typography>
                  </div>

                  <div className={classes.stats}>
                    <Typography variant="h6">
                      {moment(item.createdOn).format('DD MMMM YYYY')}
                    </Typography>
                    <Typography variant="body2">Created On</Typography>
                  </div>
                  <div className={classes.stats}>
                    <Typography variant="h6">
                      {moment(item.lastUpdatedOn).format('DD MMMM YYYY')}
                    </Typography>
                    <Typography variant="body2">Last Updated</Typography>
                  </div>

                  <div className={classes.actions}>
                    <Link
                      component={RouterLink}
                      to={`/build/${item._id}`}
                      color="primary"
                      size="small"
                      variant="outlined"
                    >
                      <Button
                        className={classes.button}
                        color="secondary"
                        variant="contained"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Container>
        </Page>
      ) : (
        <Redirect to="/auth/google" />
      )}
    </>
  );
}

export default New;
