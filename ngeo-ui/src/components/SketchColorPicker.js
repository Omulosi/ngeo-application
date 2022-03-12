/* eslint-disable */
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { SketchPicker } from 'react-color';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'align-left',
    alignItems: 'center',
    paddingTop: '1.5em'
  }
}));

const SketchColorPicker = ({ color, setColor, handleCloseColorPicker }) => {
  const classes = useStyles();

  const handleChange = (color) => {
    setColor(color.hex);
  };

  return (
    <div>
      <div className={classes.root}>
        <SketchPicker color={color} onChange={handleChange} width="100%" />
      </div>
    </div>
  );
};

export default SketchColorPicker;
