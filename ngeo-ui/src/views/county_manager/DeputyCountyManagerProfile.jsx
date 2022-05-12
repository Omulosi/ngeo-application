import React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Page from 'src/components/Page';
import PageToolbar from 'src/components/PageToolbar';
import LineProgress from 'src/components/LineProgress';
import TabPanel from 'src/components/TabPanel';
import DisplayProjects from 'src/components/DisplayProjects';
import capitalize from 'src/utils/capitalize';
import { useDeputyCountyManagerById } from 'src/fetch/county_managers';
import DisplayFieldOfficerList from 'src/components/DisplayFieldOfficerList';
import AssignProject from 'src/components/AssignProject';
import AssignArea from 'src/components/AssignArea';
import useHR, { useCEO, useFinance, useRM } from 'src/fetch/permissions';
import { useFieldOfficerList } from 'src/fetch/field_officers';
import { useProjects } from 'src/fetch/projects';
import mainConfig from 'src/config/config.json';
import CountyManagerInfo from './CountyManagerInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(5)
  },
  tab: {
    color: 'rgb(33, 150, 243)'
  },
  padTop: {
    paddingTop: '2em'
  },
  content: {
    paddingTop: theme.spacing(2)
  },
  toolbar: {}
}));

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};

/* eslint-disable */
const DeputyCountyManagerProfile = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const { siteNames } = mainConfig.globalData;

  // const { data: userData, isSuccess: userSuccess } = useUser();
  // let user = null;
  // let isHR = false;
  // if (userSuccess) {
  //   user = userData.attributes;
  //   isHR = user && user.role && user.role === roles.HR;
  // }
  const isHR = useHR();
  const isFinance = useFinance();
  const isRM = useRM();
  const isCEO = useCEO();

  const {
    data: countyManager,
    isLoading,
    error,
    isSuccess
  } = useDeputyCountyManagerById(id);

  const {
    data: fieldOfficerList,
    isSuccess: fooSuccess
  } = useFieldOfficerList();

  const { data: projectList, isSuccess: projectSuccess } = useProjects();

  if (error) {
    console.log(`Error => ${error}`);
    enqueueSnackbar('Unable to fetch deputy county managers profile data', {
      variant: 'error'
    });
  }

  let details = {};
  let countyManagerProjects = [];
  let countyManagerFieldOfficers = [];
  if (isSuccess) {
    details = {
      ...countyManager.attributes?.user,
      id: countyManager.id,
      area: countyManager.attributes.area?.county
    };

    countyManagerProjects = countyManager.attributes?.projects?.features;
    // countyManagerFieldOfficers = countyManager.attributes.field_officers;
  }

  // Get all FOOs located in this county
  if (fooSuccess) {
    countyManagerFieldOfficers = fieldOfficerList
      .map((fooObj) => {
        return {
          ...fooObj.attributes,
          id: fooObj.id
        };
      })
      .filter((foo) => foo.area?.county === details.area);
  }

  if (projectSuccess) {
    countyManagerProjects = projectList.results.features.filter(
      (proj) => proj.properties.area?.county === details.area
    );
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title={`${siteNames?.DCM?.name} Profile`} className={classes.root}>
      <div className={classes.progress}>{isLoading && <LineProgress />}</div>
      <Container maxWidth={false}>
        <PageToolbar
          title={
            /* eslint-disable */
            details
              ? `Deputy County Manager: ${capitalize(
                  details.first_name
                )} ${capitalize(details.last_name)}`
              : ''
          }
        />
        <Grid container className={classes.content}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            variant="fullWidth"
            textColor="primary"
          >
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label={`${siteNames.Project.name}s`} {...a11yProps(1)} />
            <Tab label={`${siteNames.FOO.name}s`} {...a11yProps(1)} />
          </Tabs>
        </Grid>

        <TabPanel value={value} index={0}>
          <Grid container spacing={3} className={classes.padTop}>
            <Grid item xl={4} lg={6} md={6} xs={12}>
              <CountyManagerInfo details={details} />
            </Grid>
            {/** Not viewable by HR */}
            {isFinance && (
              <Grid item xl={4} lg={6} md={6} xs={12}>
                <AssignProject user={{ county_manager: details.id }} />
              </Grid>
            )}
            {/** Not viewable by finance or Regional manager*/}
            {!isFinance && !isRM && !isCEO && (
              <Grid item xl={4} lg={6} md={6} xs={12}>
                <AssignArea
                  user={countyManager ? countyManager.attributes.user : null}
                />
              </Grid>
            )}
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid container spacing={3} className={classes.padTop}>
            <Grid item lg={12} md={12} xs={12}>
              <DisplayProjects projects={countyManagerProjects} />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Grid container spacing={3} className={classes.padTop}>
            <Grid item lg={12} md={12} xs={12}>
              <DisplayFieldOfficerList
                fieldOfficers={countyManagerFieldOfficers}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Container>
    </Page>
  );
};

export default DeputyCountyManagerProfile;
