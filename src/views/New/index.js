/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import FileDropzone from 'src/components/FileDropzone';
import { useAuth } from '../../contexts/auth';

const useStyles = makeStyles(() => ({
  root: {}
}));

function New({ component: Component, ...rest }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userId, setUserId] = useState(false);
  const { authTokens, setAuthTokens } = useAuth();

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

  return (
    <>
      {loading ? (
        'Loading...'
      ) : isLoggedIn ? (
        <Page className={classes.root} title="Upload New PDF">
          <Card {...rest}>
            <CardHeader title="Upload New PDF (max 20 pages)" />
            <CardContent>
              <FileDropzone />
            </CardContent>
          </Card>
        </Page>
      ) : (
        <Redirect to="/auth/google" />
      )}
    </>
  );
}

export default New;
