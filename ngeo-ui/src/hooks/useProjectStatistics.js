import React from 'react';

const useProjectStatistics = ({ projects }) => {
  const [projectStatistics, setProjectStatistics] = React.useState({
    totalProjectCount: 0,
    userProjectCount: 0,
    projectsWithAgentsCount: 0,
    projectsWithoutAgentsCount: 0,
    projectsWithAgentsContractCount: 0,
    projectsWithAgentsPermanentCount: 0,
    projectsHqControlledCount: 0,
    projectsCountyControlledCount: 0,
    agentCount: 0,
    //
    projectsWithAgents: [],
    projectsWithoutAgents: [],
    projectsWithAgentsContract: [],
    projectsWithAgentsPermanent: [],
    projectsHqControlled: [],
    projectsCountyControlled: []
  });
  // Ignore admin and current user (HR)

  React.useEffect(() => {
    if (!projects) return;
    const userProjectCount = 0;
    let projectsWithAgentsCount = 0;
    let projectsWithoutAgentsCount = 0;
    let projectsWithAgentsContractCount = 0;
    let projectsWithAgentsPermanentCount = 0;
    let projectsHqControlledCount = 0;
    let projectsCountyControlledCount = 0;
    //
    const projectsWithAgents = [];
    const projectsWithoutAgents = [];
    const projectsWithAgentsContract = [];
    const projectsWithAgentsPermanent = [];
    const projectsHqControlled = [];
    const projectsCountyControlled = [];

    projects = projects?.filter((p) => p.properties.is_active);
    const totalProjectCount = projects.length;

    projects.forEach((ft) => {
      if (ft.properties.agent) {
        if (ft.properties.agent.length > 0) {
          projectsWithAgentsCount += 1;
          projectsWithAgents.push(ft);
          // agentCount += ft.properties.agent.length;
          const agents = ft.properties.agent;
          agents.forEach((agent) => {
            // contract agent have a status of 3
            if (agent.terms === 3) {
              projectsWithAgentsContractCount += 1;
              projectsWithAgentsContract.push(ft);
            }

            // permanent agents rep by 1 amd 2
            if ([1, 2].includes(agent.terms)) {
              projectsWithAgentsPermanentCount += 1;
              projectsWithAgentsPermanent.push(ft);
            }
          });
        } else {
          projectsWithoutAgentsCount += 1;
          projectsWithoutAgents.push(ft);
        }
      }

      if (ft.properties.initiated_by) {
        if (ft.properties.initiated_by.toLowerCase().includes('county')) {
          projectsCountyControlledCount += 1;
          projectsCountyControlled.push(ft);
        }

        if (ft.properties.initiated_by.toLowerCase().includes('hq')) {
          projectsHqControlledCount += 1;
          projectsHqControlled.push(ft);
        }
      }
    });

    setProjectStatistics((stats) => ({
      ...stats,
      totalProjectCount,
      userProjectCount,
      projectsWithAgentsCount,
      projectsWithoutAgentsCount,
      projectsWithAgentsContractCount,
      projectsWithAgentsPermanentCount,
      projectsHqControlledCount,
      projectsCountyControlledCount,
      //
      projectsWithAgents,
      projectsWithoutAgents,
      projectsWithAgentsContract,
      projectsWithAgentsPermanent,
      projectsHqControlled,
      projectsCountyControlled
    }));
  }, [projects]);

  return projectStatistics;
};

export default useProjectStatistics;
