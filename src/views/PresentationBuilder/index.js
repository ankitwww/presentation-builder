import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
 Container, Tabs, Tab, Divider, colors 
} from '@material-ui/core';
import axios from 'axios';
import Page from 'src/components/Page';
import Alert from 'src/components/Alert';
import Header from './Header';
import Overview from './Overview';
import Files from './Files';
import { PresentationContext } from '../../contexts/presentation';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  tabs: {
    marginTop: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300]
  },
  alert: {
    marginTop: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(3)
  }
}));

function PresentationBuilder({ match, history }) {
  const classes = useStyles();
  const { id } = match.params;
  const { tab } = match.params;
  const [openAlert, setOpenAlert] = useState(true);
  const [presentation, setThisPresentation] = useState(null);
  const [selectedFile, setSelectedItem] = useState(null);
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'files', label: 'Pages' }
  ];

  const setThisPresentationAndSelectedImage = (
    thisPresentation,
    selectedItem
  ) => {
    setThisPresentation(thisPresentation);
    if (selectedItem) {
      setSelectedItem(selectedItem);
    } else if (
      thisPresentation
      && thisPresentation.images
      && thisPresentation.images.length
    ) {
      setSelectedItem(thisPresentation.images[0]);
    }
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const handleTabsChange = (event, value) => {
    history.push(value);
  };

  useEffect(() => {
    let mounted = true;

    const fetchPresentation = () => {
      axios.get(`/api/presentationById/${id}`).then(response => {
        console.log(response);
        if (mounted) {
          setThisPresentationAndSelectedImage(response.data);
        }
      });
    };

    fetchPresentation();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!tab) {
    return <Redirect to={`/build/${id}/files`} />;
  }

  if (!presentation) {
    return null;
  }

  return (
    <PresentationContext.Provider
      value={{
        presentation,
        selectedFile,
        setPresentation: setThisPresentationAndSelectedImage,
        setSelectedItem
      }}
    >
      <Page className={classes.root} title="Presentation Builder">
        <Container maxWidth="lg">
          <Header presentation={presentation} />
          <Tabs
            className={classes.tabs}
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={tab}
            variant="scrollable"
          >
            {tabs.map(tab => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
          <Divider className={classes.divider} />

          <div className={classes.content}>
            {tab === 'overview' && <Overview />}
            {tab === 'files' && <Files />}
          </div>
        </Container>
      </Page>
    </PresentationContext.Provider>
  );
}

PresentationBuilder.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default PresentationBuilder;
