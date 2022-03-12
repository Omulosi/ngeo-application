import React from 'react';
import { CircularProgress, Backdrop, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#00f',
    zIndex: theme.zIndex.drawer + 1
  }
}));

const Loading = () => {
  const classes = useStyles();
  return (
    <Backdrop open className={classes.root}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
