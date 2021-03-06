// import React from 'react';
// import { makeStyles, Container } from '@material-ui/core';
// import { useParams } from 'react-router';
// import DataGridToolbar from 'src/components/DataGridToolbar';
// import Page from 'src/components/Page';
// import ReturnChart from 'src/components/ReturnChart';
// import { useAgentById } from 'src/fetch/agents';
// import mainConfig from 'src/config/config.json';
// import AgentPerformanceSummary from '../agent/AgentPerformanceSummary';
// import SwitchesGroup from './SwitchesGroup';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     backgroundColor: theme.palette.background.dark,
//     minHeight: '100%',
//     paddingBottom: theme.spacing(3),
//     paddingTop: theme.spacing(3)
//   },
//   item: {
//     display: 'flex',
//     flexDirection: 'column'
//   }
// }));

// /* eslint-disable */
// const ManageAgents = () => {
//   const classes = useStyles();
//   const { siteNames } = mainConfig.globalData;

//   const { id } = useParams();

//   const { data, isError, isLoading, isSuccess } = useAgentById(id);
//   let agent = null;
//   if (isSuccess) {
//     agent = data.attributes;
//   }

//   const agentName = agent ? `${agent.first_name} ${agent.last_name}` : '';

//   return (
//     <Page title={`Manage ${siteNames.Agent.name}`} className={classes.root}>
//       <Container maxWidth={false}>
//         <DataGridToolbar pageTitle={`${siteNames.Agent.name} - ${agentName}`} />
//         <div>
//           <ReturnChart />
//           <AgentPerformanceSummary />
//           <SwitchesGroup className={classes.root} />
//         </div>
//       </Container>
//     </Page>
//   );
// };

// export default ManageAgents;
