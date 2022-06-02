/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
import React from 'react';
import { isRegionalManager } from 'src/utils/getRole';

const useAgentStatistics = ({ agentList, role, userArea }) => {
  const [agentStatistics, setAgentStatistics] = React.useState({
    // agentCount: 0,
    agents: []
  });

  React.useEffect(() => {
    agentList = Array.isArray(agentList)
      ? agentList.filter((agent) => agent.attributes.is_active)
      : [];
    let agents = agentList.filter((agent) => agent.attributes.is_active);

    if (isRegionalManager(role)) {
      agents = agentList.filter(
        (agent) => agent?.attributes?.area?.region === userArea
      );
    }
    setAgentStatistics((stats) => ({
      ...stats,
      agents
    }));
  }, [agentList, role, userArea]);

  return agentStatistics;
};

export default useAgentStatistics;
