/* eslint-disable */
import React from 'react';
import * as helpers from 'src/utils/helpers';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  checkbox: {},
  checkboxName: {
    fontSize: '0.9rem'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0.8em',
    cursor: 'pointer',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '& > span': {
      padding: '0.3em'
    },
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: 'rgba(0,0,0,0.04)'
    }
  }
});

// eslint-disable-next-line react/prop-types
const CustomListItem = ({ children, name, icon, hide }) => {
  const classes = useStyles();

  if (hide) {
    return null;
  }

  return (
    <div className={classes.content}>
      <span className={classes.checkbox} key={helpers.getUID()}>
        {children}
      </span>
      <span className={classes.checkboxName} key={helpers.getUID()}>
        {name}
      </span>
      <span key={helpers.getUID()}>{icon}</span>
    </div>
  );
};

export default CustomListItem;
