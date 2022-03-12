/* eslint-disable  */
import React from 'react';
// eslint-disable
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import SketchColorPicker from './SketchColorPicker';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  content: {
    width: '400px'
  },
  colorPicker: {
    display: 'flex',
    flexDirection: 'column',
    '& > span': {
      display: 'inline-block',
      color: '#546e7a',
      fontSize: '1rem',
      fontWeight: 400,
      marginTop: '18px',
      marginBottom: '12px'
    }
  },
  color: {
    height: '14px',
    borderRadius: '2px'
  },
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer'
  }
}));

const ThemeDialogForm = ({
  open,
  handleClose,
  theme,
  handleChange,
  switchState,
  handleSwitchChange,
  handleMutateTheme,
  title,
  contentText
}) => {
  const classes = useStyles();

  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
  const [color, setColor] = React.useState('#f00');

  const toggleDisplayColorPicker = () => {
    setDisplayColorPicker((displayColorPicker) => !displayColorPicker);
  };

  const handleCloseColorPicker = () => {
    setDisplayColorPicker(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText>{contentText}</DialogContentText>
          <form>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={theme?.name}
              onChange={handleChange}
            />

            <div className={classes.colorPicker}>
              <span>Pick a theme color</span>
              <div
                className={classes.swatch}
                onClick={toggleDisplayColorPicker}
              >
                <div
                  className={classes.color}
                  style={{ background: `${color}` }}
                />
              </div>
              {displayColorPicker && (
                <SketchColorPicker
                  setColor={setColor}
                  color={color}
                  handleCloseColorPicker={handleCloseColorPicker}
                />
              )}
            </div>
          </form>
        </DialogContent>

        <DialogActions>
          {switchState && (
            <Tooltip title="Add multiple">
              <Switch
                checked={switchState.addMultiple}
                onChange={handleSwitchChange}
                value="addMultiple"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </Tooltip>
          )}

          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleMutateTheme(color);
            }}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ThemeDialogForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  theme: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  switchState: PropTypes.object,
  handleSwitchChange: PropTypes.func,
  handleMutateTheme: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  contentText: PropTypes.string.isRequired
};

export default ThemeDialogForm;
