/* eslint-disable */
import React, { useContext } from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useDrawer } from 'src/context/drawer.context';
import MapContext from '../Map/MapContext';
import './styles.css';

/* eslint-disable */

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flext-start',
    paddingBottom: '1em',
    top: '0.5em',
    left: '1em',
    height: '37px',
    width: '37px',
    position: 'relative',
    zIndex: 2
  },
  menu: {
    zIndex: 999,
    cursor: 'pointer',
    userSelect: 'none',
    fontFamily: 'verdana, helvetica',
    background: '#fff',
    padding: '12px 16px',
    borderRadius: '0',
    width: '37px !important',
    height: '37px !important',
    background:
      'linear-gradient( to bottom, rgba(255, 255, 255, 1) 0%, rgba(229, 229, 229, 1) 100% )'
  }
}));

const Navigation = () => {
  const classes = useStyles();
  const { map } = useContext(MapContext);
  const { handleDrawerOpen } = useDrawer();

  // ZOOM TO FULL EXTENT
  const zoomFullExtent = () => {
    if (window.userAreaExtent) {
      map.getView().fit(window.userAreaExtent, {
        size: map.getSize(),
        duration: 1000,
        padding: [10, 10, 10, 10]
      });
    } else if (window.areaExtent) {
      map?.getView().fit(window.areaExtent, {
        size: map.getSize(),
        duration: 1000,
        padding: [100, 100, 100, 100] // update to prop variable
      });
    } else if (window.boundaryExtent) {
      map?.getView().fit(window.boundaryExtent, {
        size: map.getSize(),
        duration: 1000,
        padding: [25, 25, 25, 25] // update to prop variable
      });
    }
  };

  return (
    <div className={classes.root}>
      <Tooltip title="Menu" placement="right">
        <IconButton
          className={classes.menu}
          color="primary"
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Zoom In" placement="right">
        <div
          className="zoomButton"
          onClick={() => {
            const zoom = map.getView().getZoom();
            map.getView().setZoom(zoom + 1);
          }}
        >
          +
        </div>
      </Tooltip>

      <Tooltip title="Zoom out" placement="right">
        <div
          className="zoomButton"
          onClick={() => {
            const zoom = map.getView().getZoom();
            map.getView().setZoom(zoom - 1);
          }}
        >
          -
        </div>
      </Tooltip>

      <Tooltip title="Zoom to user area" placement="right">
        <div className="fullExtentButton" onClick={zoomFullExtent}>
          <div className="fullExtentContent" />
        </div>
      </Tooltip>
    </div>
  );
};

export default Navigation;
