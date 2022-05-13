/* eslint-disable react/prop-types */
import React from 'react';
import * as helpers from 'src/utils/helpers';
import FloatingMenu, { FloatingMenuItem } from 'src/utils/helpers/FloatingMenu';
import { Item as MenuItem } from 'rc-menu';
import Portal from 'src/utils/helpers/Portal';
import mainConfig from 'src/config/config.json';
import './Map.css';
// CSS overrides for default open layer styles
import './olOverrides.css';

const MapFloatingMenu = ({ onMenuItemClick, evt }) => {
  return (
    <Portal>
      <FloatingMenu
        key={helpers.getUID()}
        buttonEvent={evt}
        onMenuItemClick={onMenuItemClick}
        autoY
        autoX
      >
        <MenuItem
          className={
            mainConfig.rightClickMenuVisibility['sc-floating-menu-add-mymaps']
              ? 'sc-floating-menu-toolbox-menu-item'
              : 'sc-hidden'
          }
          key="sc-floating-menu-add-mymaps"
        >
          <FloatingMenuItem imageName="point.png" label="Add Marker" />
        </MenuItem>

        <MenuItem
          className={
            mainConfig.rightClickMenuVisibility[
              'sc-floating-menu-save-map-extent'
            ]
              ? 'sc-floating-menu-toolbox-menu-item'
              : 'sc-hidden'
          }
          key="sc-floating-menu-save-map-extent"
        >
          <FloatingMenuItem
            imageName="globe-icon.png"
            label="Save as Default Extent"
          />
        </MenuItem>
        {/** Show details of a particular feature on layers side bar */}
        <MenuItem
          className={
            mainConfig.rightClickMenuVisibility['sc-floating-menu-identify']
              ? 'sc-floating-menu-toolbox-menu-item'
              : 'sc-hidden'
          }
          key="sc-floating-menu-identify"
        >
          <FloatingMenuItem imageName="identify.png" label="Identify" />
        </MenuItem>
      </FloatingMenu>
    </Portal>
  );
};

export default MapFloatingMenu;
