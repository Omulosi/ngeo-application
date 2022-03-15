/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-curly-newline */
import React from 'react';

import { makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';

import { useAgents } from 'src/fetch/agents';
import LineProgress from 'src/components/LineProgress';

import CustomAlert from 'src/components/Alert';

import useUser from 'src/fetch/user';
import mainConfig from 'src/config/config.json';
import AgentList from './AgentList';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    '& .MuiDataGrid-root .MuiDataGrid-colCellTitle': {
      fontWeight: 'bold',
      width: '500px'
    }
  },
  gridWrapper: {
    height: '80vh',
    minWidth: '100%'
  },
  grid: {},
  dark: {
    color: '#263238',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#263238'
    }
  },
  actionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewAction: {
    marginLeft: '0.7rem'
  }
}));

const Agents = () => {
  const classes = useStyles();

  const { siteNames } = mainConfig.globalData;
  const { data: user } = useUser();

  const { data: agents, isLoading: loading, isError: error } = useAgents();

  return (
    <Page title={`${siteNames.Agent.name}s`} className={classes.root}>
      <div className={classes.progress}>{loading && <LineProgress />}</div>
      {error && (
        <CustomAlert
          severity="error"
          content={`Error fetching ${siteNames.Agent.name}s`}
        />
      )}

      <AgentList agents={agents} user={user} />
    </Page>
  );
};

export default Agents;
