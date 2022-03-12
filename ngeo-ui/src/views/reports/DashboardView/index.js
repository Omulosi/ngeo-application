import React from 'react';
/* eslint-disable */
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import { useProjects } from 'src/fetch/projects';
import SummaryCard from './SummaryCard';
import useUser, { useUserList } from 'src/fetch/user';
import { useAgents } from 'src/fetch/agents';
import {
  isFinance,
  isHR,
  isRegionalManager,
  isCountyManager,
  isFieldOfficer,
  isCEO
} from 'src/utils/getRole';
import mainConfig from 'src/config/config.json';
import FolderIcon from '@material-ui/icons/FolderOpenTwoTone';
import useUserStatistics from 'src/hooks/useUserStatistics';
import useAgentStatistics from 'src/hooks/useAgentStatistics';
import useProjectStatistics from 'src/hooks/useProjectStatistics';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  const { globalData } = mainConfig;

  let { data: projects } = useProjects();
  const { data: userDetail, isSuccess: userSuccess } = useUser();
  const { data: userList } = useUserList();
  let { data: agentList } = useAgents();

  let userArea = null;

  let role = null;
  if (userSuccess) {
    role = userDetail && userDetail.attributes && userDetail.attributes.role;
    if (isCountyManager(role)) {
      userArea = userDetail.attributes && userDetail.attributes.area.county;
    }

    if (isRegionalManager(role)) {
      userArea = userDetail.attributes && userDetail.attributes.area.region;
    }
  }

  const {
    financeOfficerCount,
    ceoCount,
    hrCount,
    regionalManagerCount,
    countyManagerCount,
    fieldOfficerCount,
    userCount
  } = useUserStatistics({ userList, role, userArea });

  const { agentCount } = useAgentStatistics({ agentList, role, userArea });

  const {
    totalProjectCount,
    userProjectCount,
    projectsWithAgents,
    projectsWithoutAgents,
    projectsWithAgentsContract,
    projectsWithAgentsPermanent,
    projectsHqControlled,
    projectsCountyControlled
  } = useProjectStatistics({ projects });

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard label="TOTAL USERS" count={userCount} />
            </Grid>
          )}

          {isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.CEO.name.toUpperCase()}`}
                count={ceoCount}
              />
            </Grid>
          )}

          {isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.HR.name.toUpperCase()}`}
                count={hrCount}
              />
            </Grid>
          )}

          {isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Finance.name.toUpperCase()}`}
                count={financeOfficerCount}
              />
            </Grid>
          )}

          {!isFinance(role) &&
            !isRegionalManager(role) &&
            !isCountyManager(role) &&
            !isFieldOfficer(role) && (
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <SummaryCard
                  label={`${globalData.siteNames.RM.name.toUpperCase()}(S)`}
                  count={regionalManagerCount}
                />
              </Grid>
            )}

          {!isFinance(role) && !isCountyManager(role) && !isFieldOfficer(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.CM.name.toUpperCase()}(S)`}
                count={countyManagerCount}
              />
            </Grid>
          )}

          {!isFinance(role) && !isFieldOfficer(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.FOO.name.toUpperCase()}(S)`}
                count={fieldOfficerCount}
              />
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Agent?.name.toUpperCase()}(S)`}
                count={agentCount}
              />
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project?.name.toUpperCase()}(S)`}
                count={totalProjectCount || userProjectCount}
                icon={<FolderIcon />}
              />
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) WITH ${globalData.siteNames.Agent.name.toUpperCase()}(S) `}
                count={projectsWithAgents}
              />
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) WITH NO ${globalData.siteNames.Agent.name.toUpperCase()}(S) `}
                count={projectsWithoutAgents}
              />
            </Grid>
          )}

          {/**  */}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) WITH ${globalData.siteNames.Agent.name.toUpperCase()}(S) - ${globalData.siteNames.Permanent.name.toUpperCase()}`}
                count={projectsWithAgentsPermanent}
              />
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) WITH ${globalData.siteNames.Agent.name.toUpperCase()}(S) - ${globalData.siteNames.Contract.name.toUpperCase()}`}
                count={projectsWithAgentsContract}
              />
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) - HQ Controlled`}
                count={projectsHqControlled}
              />
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) - COUNTY Controlled`}
                count={projectsCountyControlled}
              />
            </Grid>
          )}
        </Grid>
        <Grid container spacing={3}>
          {/** Bar chart here */}
          {/*
               <BarChart />

            */}
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
