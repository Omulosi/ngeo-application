/* eslint-disable object-curly-newline */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { Close as CloseIcon } from '@material-ui/icons';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  Typography,
  makeStyles,
  Box
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  children,
  open,
  handleClose,
  label
}) {
  const classes = useStyles();
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography>{label}</Typography>
        </Toolbar>
      </AppBar>
      <Box>{children}</Box>
    </Dialog>
  );
}
