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
  isDeputyRegionalManager,
  isCountyManager,
  isDeputyCountyManager,
  isFieldOfficer,
  isCEO
} from 'src/utils/getRole';
import mainConfig from 'src/config/config.json';
import FolderIcon from '@material-ui/icons/FolderOpenTwoTone';
import useUserStatistics from 'src/hooks/useUserStatistics';
import useAgentStatistics from 'src/hooks/useAgentStatistics';
import useProjectStatistics from 'src/hooks/useProjectStatistics';
import UserList from '../../users/UserListView/UserList';
import DisplayProjects from '../../../components/DisplayProjects';
import AgentList from '../../agent/AgentList';

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

  const { data: userDetail, isSuccess: userSuccess } = useUser();
  //
  const { data: projectData } = useProjects();
  const { data: userList } = useUserList();
  let { data: agentList } = useAgents();

  const projects = projectData?.results.features;

  let userArea = null;

  let role = null;
  if (userSuccess) {
    role = userDetail?.attributes?.role;
    if (isCountyManager(role)) {
      userArea = userDetail?.attributes?.area?.county;
    }

    if (isRegionalManager(role)) {
      userArea = userDetail?.attributes?.area?.region;
    }
  }

  const {
    // financeOfficerCount,
    // ceoCount,
    // hrCount,
    // regionalManagerCount,
    // countyManagerCount,
    // fieldOfficerCount,
    // userCount
    financeOfficers,
    ceos,
    hrs,
    regionalManagers,
    deputyRegionalManagers,
    countyManagers,
    deputyCountyManagers,
    fieldOfficers,
    userCount
  } = useUserStatistics({ userList, role, userArea });

  const { agents } = useAgentStatistics({ agentList, role, userArea });

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
              <SummaryCard label="TOTAL USERS" count={userCount}>
                <UserList userList={userList} user={userDetail} />
              </SummaryCard>
            </Grid>
          )}

          {isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.CEO.name.toUpperCase()}`}
                count={ceos?.length}
              >
                <UserList userList={ceos} user={userDetail} />
              </SummaryCard>
            </Grid>
          )}

          {isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.HR.name.toUpperCase()}`}
                count={hrs?.length}
              >
                {' '}
                <UserList userList={hrs} user={userDetail} />
              </SummaryCard>
            </Grid>
          )}

          {isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Finance.name.toUpperCase()}`}
                count={financeOfficers?.length}
              >
                {' '}
                <UserList userList={financeOfficers} user={userDetail} />
              </SummaryCard>
            </Grid>
          )}

          {/** regional managers */}
          {!isFinance(role) &&
            !isRegionalManager(role) &&
            !isCountyManager(role) &&
            !isFieldOfficer(role) && (
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <SummaryCard
                  label={`${globalData.siteNames.RM.name.toUpperCase()}(S)`}
                  count={regionalManagers?.length}
                >
                  <UserList userList={regionalManagers} user={userDetail} />
                </SummaryCard>
              </Grid>
            )}

          {/** deputy regional managers */}
          {!isFinance(role) &&
            !isRegionalManager(role) &&
            !isDeputyRegionalManager(role) &&
            !isCountyManager(role) &&
            !isFieldOfficer(role) && (
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <SummaryCard
                  label={`${globalData.siteNames.DRM.name.toUpperCase()}(S)`}
                  count={deputyRegionalManagers?.length}
                >
                  <UserList
                    userList={deputyRegionalManagers}
                    user={userDetail}
                  />
                </SummaryCard>
              </Grid>
            )}

          {/** county managers */}
          {!isFinance(role) && !isCountyManager(role) && !isFieldOfficer(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.CM.name.toUpperCase()}(S)`}
                count={countyManagers?.length}
              >
                <UserList userList={countyManagers} user={userDetail} />
              </SummaryCard>
            </Grid>
          )}

          {/** deputy county managers */}
          {!isFinance(role) &&
            !isCountyManager(role) &&
            !isDeputyCountyManager(role) &&
            !isFieldOfficer(role) && (
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <SummaryCard
                  label={`${globalData.siteNames.DCM.name.toUpperCase()}(S)`}
                  count={deputyCountyManagers?.length}
                >
                  <UserList userList={deputyCountyManagers} user={userDetail} />
                </SummaryCard>
              </Grid>
            )}

          {!isFinance(role) && !isFieldOfficer(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.FOO.name.toUpperCase()}(S)`}
                count={fieldOfficers.length}
              >
                <UserList userList={fieldOfficers} user={userDetail} />
              </SummaryCard>
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Agent?.name.toUpperCase()}(S)`}
                count={agents?.length}
              >
                <AgentList agents={agents} user={userDetail} />
              </SummaryCard>
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project?.name.toUpperCase()}(S)`}
                count={totalProjectCount || userProjectCount}
                icon={<FolderIcon />}
              >
                <DisplayProjects projects={projects} />
              </SummaryCard>
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) WITH ${globalData.siteNames.Agent.name.toUpperCase()}(S) `}
                count={projectsWithAgents?.length}
              >
                <DisplayProjects projects={projectsWithAgents} />
              </SummaryCard>
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) WITH NO ${globalData.siteNames.Agent.name.toUpperCase()}(S) `}
                count={projectsWithoutAgents?.length}
              >
                <DisplayProjects projects={projectsWithoutAgents} />
              </SummaryCard>
            </Grid>
          )}

          {/**  */}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) WITH ${globalData.siteNames.Agent.name.toUpperCase()}(S) - ${globalData.siteNames.Permanent.name.toUpperCase()}`}
                count={projectsWithAgentsPermanent?.length}
              >
                <DisplayProjects projects={projectsWithAgentsPermanent} />
              </SummaryCard>
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) WITH ${globalData.siteNames.Agent.name.toUpperCase()}(S) - ${globalData.siteNames.Contract.name.toUpperCase()}`}
                count={projectsWithAgentsContract?.length}
              >
                <DisplayProjects projects={projectsWithAgentsContract} />
              </SummaryCard>
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) - HQ Controlled`}
                count={projectsHqControlled?.length}
              >
                <DisplayProjects projects={projectsHqControlled} />
              </SummaryCard>
            </Grid>
          )}

          {!isHR(role) && (
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <SummaryCard
                label={`${globalData.siteNames.Project.name.toUpperCase()}(S) - COUNTY Controlled`}
                count={projectsCountyControlled?.length}
              >
                <DisplayProjects projects={projectsCountyControlled} />
              </SummaryCard>
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
