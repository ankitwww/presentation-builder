/* eslint-disable arrow-parens */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white
  },
  header: {
    width: theme.breakpoints.values.md,
    maxWidth: '100%',
    margin: '0 auto',
    padding: '80px 24px',
    [theme.breakpoints.up('md')]: {
      padding: '160px 24px'
    }
  },
  buttons: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  mediaContainer: {
    margin: '0 auto',
    maxWidth: 1600,
    padding: theme.spacing(0, 2),
    overflow: 'hidden'
  },
  media: {
    width: '100%'
  },
  stats: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1)
  },
  statsInner: {
    width: theme.breakpoints.values.md,
    maxWidth: '100%',
    margin: '0 auto'
  }
}));

function Header({ className, ...rest }) {
  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.header}>
        <Typography align="center" gutterBottom variant="h1">
          #Vanhackathon TPB
        </Typography>
        <Typography align="center" component="h2" variant="h2">
          Start building engaging courses from PDF. This is a hackathon project
          so expect few incomplete/buggy features.
        </Typography>
        <Typography align="center" gutterBottom variant="subtitle1">
          Thinkific Presentation Builder #WeHackTogether #ThinkificChallenge
        </Typography>
        <div className={classes.buttons}>
          <Button
            color="primary"
            component="a"
            href="http://localhost:3001/auth/google"
            variant="contained"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
