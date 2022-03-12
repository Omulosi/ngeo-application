import React from 'react';
import clsx from 'clsx';
/* eslint-disable */
import {
  Typography,
  makeStyles,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@material-ui/core';

const MenuButton = ({ handleDrawerOpen, open }) => {
  return (
    <Tooltip title="menu" placement="right">
      <ListItem className={classes.menuButton}>
        <ListItemIcon
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </ListItemIcon>
      </ListItem>
    </Tooltip>
  );
};

export default MenuButton;
