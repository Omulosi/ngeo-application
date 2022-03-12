/* eslint-disable */
import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 999
  },
  content: {
    display: 'flex',
    fontSize: '12px',
    letterSpacing: '.3px',
    alignItems: 'center',
    color: '#e8eaed',
    backgroundColor: 'rgba(0,0,0,.6)',
    height: '32px',
    padding: '0 15px',
    justifyContent: 'center',
    '& > *': {
      margin: '0 2em'
    }
  }
}));

const MapStatus = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default MapStatus;
