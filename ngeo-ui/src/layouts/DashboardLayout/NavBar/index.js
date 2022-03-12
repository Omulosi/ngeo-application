import React, { useEffect } from 'react';
/* eslint-disable */
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Divider, List, makeStyles } from '@material-ui/core';
import useUser from 'src/fetch/user';
import NavItem from './Item';
import DrawerComponent from './Drawer';
import getMenuItems from './getMenuItems';

const useStyles = makeStyles(() => ({
  hide: {
    display: 'none'
  }
}));

/* eslint-disable */
const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { data, isSuccess } = useUser();

  let profileData = null;
  if (isSuccess) {
    profileData = {
      ...data.attributes,
      isAuthenticated: data.isAuthenticated
    };
  }

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  let items = getMenuItems(profileData);
  // Account item is last item in list, get its index
  const accountItemIndex = items.length - 1;
  items = [
    // All items except account item
    ...items.slice(0, accountItemIndex),
    //  set account menu last and separate it with rest of menu items
    <Divider
      variant="inset"
      component="li"
      style={{ backgroundColor: 'rgb(238,238,238)' }}
    />,
    items[accountItemIndex]
  ];

  const content = (
    <div>
      <List>
        {items.map((item, ind) =>
          // loop through all except last tow items, Divider and Account item
          ind !== items.length - 2 ? (
            <NavItem
              href={item.href || '#'}
              key={item.title}
              title={item.title}
              name={item.name}
              icon={item.icon}
              items={item.items}
              className={item.visible ? null : classes.hide}
            />
          ) : (
            item
          )
        )}
      </List>
    </div>
  );

  return (
    <>
      <DrawerComponent profileData={profileData}>{content}</DrawerComponent>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
