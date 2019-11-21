import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import Header from './Header';
import FAQ from './FAQ';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Home() {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="#Vanhackathon TPB">
      <Header />
      <FAQ />
    </Page>
  );
}

export default Home;
