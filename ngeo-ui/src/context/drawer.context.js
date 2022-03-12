/* eslint-disable react/prop-types */
import React from 'react';

const DrawerContext = React.createContext();

const DrawerProvider = ({ children }) => {
  const [open, setOpen] = React.useState(() => false);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <DrawerContext.Provider
      value={{ open, handleDrawerClose, handleDrawerOpen }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

const useDrawer = () => {
  const context = React.useContext(DrawerContext);

  return context;
};

export { DrawerProvider, useDrawer };
