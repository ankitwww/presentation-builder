/* eslint-disable arrow-parens */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import uuid from 'uuid/v1';
import { makeStyles } from '@material-ui/styles';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import ContactSupportIcon from '@material-ui/icons/ContactSupportOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6)
  },
  list: {
    marginTop: theme.spacing(6)
  }
}));

const faqs = [
  {
    title: 'Where can I see the code?',
    description:
      'Complete code is available in github - https://github.com/ankitwwww'
  },
  {
    title: 'Is it production ready?',
    description: 'No. The bar of being production ready is bit higher. Since '
  },
  {
    title: 'What are the tech stacks?',
    description:
      'We used React.js, Material UI, Node.js, MongoDB, Azure storage'
  }
];

function FAQ({ className, ...rest }) {
  const classes = useStyles();

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Container maxWidth="lg">
        <Typography align="center" variant="h3">
          FAQ
        </Typography>
        <List disablePadding className={classes.list}>
          {faqs.map(faq => (
            <ListItem disableGutters key={uuid()}>
              <ListItemIcon>
                <ContactSupportIcon />
              </ListItemIcon>
              <ListItemText
                primary={faq.title}
                primaryTypographyProps={{ variant: 'h5' }}
                secondary={faq.description}
                secondaryTypographyProps={{ variant: 'body1' }}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
}

FAQ.propTypes = {
  className: PropTypes.string
};

export default FAQ;
