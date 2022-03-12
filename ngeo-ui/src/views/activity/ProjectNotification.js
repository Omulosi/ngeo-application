import React from 'react';
/* eslint-disable */
import NotificationsDisplay from './NotificationsDisplay';
import mainConfig from 'src/config/config.json';

const ProjectNotification = ({ notifications = [] }) => {
  const { siteNames } = mainConfig.globalData;
  return (
    <NotificationsDisplay
      title={`${siteNames.Project.name} Notifications`}
      notifications={notifications}
    />
  );
};

export default ProjectNotification;
