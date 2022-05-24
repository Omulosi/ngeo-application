import React from 'react';
/* eslint-disable */
import {
  Container,
  Grid,
  makeStyles,
  Paper,
  Tabs,
  Tab
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import JSON5 from 'json5';
import Page from 'src/components/Page';
import TabPanel from 'src/components/TabPanel';
import LineProgress from 'src/components/LineProgress';
import DataGridToolbar from 'src/components/DataGridToolbar';
import BadgeComponent from 'src/components/Badge';
// import useUser from 'src/data';
import useUser from 'src/fetch/user';
import useNotifications from 'src/fetch/notifications';
import AgentNotification from './AgentNotification';
import AllNotifications from './AllNotification';
import ProjectNotification from './ProjectNotification';
import useHR, { useFinance } from 'src/fetch/permissions';
import Loading from 'src/components/Loading';
import SidebarInfo from './SidebarInfo';
import mainConfig from 'src/config/config.json';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  tab: {
    color: 'rgb(33, 150, 243)'
  },
  sidebar: {
    backgroundColor: '#fff',
    padding: theme.spacing(2)
  },
  sidebarContent: {}
}));

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};

const MyActivity = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const { siteNames } = mainConfig.globalData;

  // Permissions
  const isFinance = useFinance();
  const isHR = useHR();

  const {
    data: notificationList,
    isLoading: notificationsLoading,
    isSuccess: notificationsSuccess
  } = useNotifications();

  let notifications = [];
  let agentNotifications = [];
  let projectNotifications = [];
  if (notificationsSuccess) {
    notifications = notificationList.map((notification) => ({
      message: notification.attributes.verb,
      createdAt: moment(notification.attributes.timestamp).fromNow(),
      data: JSON5.parse(notification.attributes.data),
      unread: notification.attributes.unread,
      id: notification.id,
      sender: notification.attributes.actor_object_id,
      actor_type: notification.attributes.actor_content_type.app_label
    }));

    agentNotifications = notifications.filter((n) => Boolean(n.data?.agent));

    console.log({ notifications });

    projectNotifications = notifications.filter((n) =>
      Boolean(n.data?.project_id)
    );
  }

  const { data, isLoading: userLoading, isSuccess } = useUser();

  let user = {};
  if (isSuccess) {
    user = data.attributes;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="My Activity" className={classes.root}>
      <>{(userLoading || notificationsLoading) && <LineProgress />}</>
      <Container maxWidth={false}>
        <DataGridToolbar pageTitle="My Activity" />
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid className={classes.item} item md={10} sm={10} xs={12}>
              <Paper square>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="activity tabs"
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab
                    label="All"
                    icon={<BadgeComponent total={notifications.length} />}
                    {...a11yProps(0)}
                  />
                  {!isHR && (
                    <Tab
                      label={`${siteNames.Agent.name}`}
                      icon={
                        <BadgeComponent total={agentNotifications.length} />
                      }
                      {...a11yProps(1)}
                    />
                  )}

                  {!isFinance && !isHR && (
                    <Tab
                      label={`${siteNames.Project.name}`}
                      icon={
                        <BadgeComponent total={projectNotifications.length} />
                      }
                      {...a11yProps(2)}
                    />
                  )}
                </Tabs>
              </Paper>
              <TabPanel value={value} index={0}>
                <AllNotifications notifications={notifications} />
              </TabPanel>

              <TabPanel value={value} index={1}>
                <AgentNotification notifications={agentNotifications} />
              </TabPanel>

              {!isFinance && (
                <TabPanel value={value} index={2}>
                  <ProjectNotification notifications={projectNotifications} />
                </TabPanel>
              )}
            </Grid>

            <Grid className={classes.sidebar} item md={2} sm={2} xs={12}>
              <div className={classes.sidebarContent}>
                <SidebarInfo user={user} notifications={notifications} />
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </Page>
  );
};

MyActivity.propTypes = {
  profileData: PropTypes.object
};

export default MyActivity;
