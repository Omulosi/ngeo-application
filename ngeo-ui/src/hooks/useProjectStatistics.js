import React from 'react';

const useProjectStatistics = ({ projects }) => {
  const [projectStatistics, setProjectStatistics] = React.useState({
    totalProjectCount: 0,
    userProjectCount: 0,
    projectsWithAgents: 0,
    projectsWithoutAgents: 0,
    projectsWithAgentsContract: 0,
    projectsWithAgentsPermanent: 0,
    projectsHqControlled: 0,
    projectsCountyControlled: 0,
    agentCount: 0
  });
  // Ignore admin and current user (HR)

  React.useEffect(() => {
    if (!projects) return;
    const userProjectCount = 0;
    let projectsWithAgents = 0;
    let projectsWithoutAgents = 0;
    let projectsWithAgentsContract = 0;
    let projectsWithAgentsPermanent = 0;
    let projectsHqControlled = 0;
    let projectsCountyControlled = 0;
    projects = projects.results?.features;
    projects = projects.filter((p) => p.properties.is_active);
    const totalProjectCount = projects.length;

    projects.forEach((ft) => {
      if (ft.properties.agent) {
        if (ft.properties.agent.length > 0) {
          projectsWithAgents += 1;
          // agentCount += ft.properties.agent.length;
          const agents = ft.properties.agent;
          agents.forEach((agent) => {
            // contract agent have a status of 3
            if (agent.terms === 3) {
              projectsWithAgentsContract += 1;
            }

            // permanent agents rep by 1 amd 2
            if ([1, 2].includes(agent.terms)) {
              projectsWithAgentsPermanent += 1;
            }
          });
        } else {
          projectsWithoutAgents += 1;
        }
      }

      if (ft.properties.initiated_by) {
        if (ft.properties.initiated_by.toLowerCase().includes('county')) {
          projectsCountyControlled += 1;
        }

        if (ft.properties.initiated_by.toLowerCase().includes('hq')) {
          projectsHqControlled += 1;
        }
      }
    });

    setProjectStatistics((stats) => ({
      ...stats,
      totalProjectCount,
      userProjectCount,
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
