import React from 'react';
/* eslint-disable */
import { makeStyles } from '@material-ui/core';
import mainConfig from 'src/config/config.json';

import NotificationsDisplay from './NotificationsDisplay';

import { useNavigate } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fff',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  item: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const AgentNotification = ({ notifications }) => {
  const { siteNames } = mainConfig.globalData;
  return (
    <NotificationsDisplay
      title={`${siteNames.Agent.name} Notifications`}
      notifications={notifications}
    />
  );
};

export default AgentNotification;
