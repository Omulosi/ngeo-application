import React from 'react';
import { useParams } from 'react-router';
import { useFieldOfficerList } from 'src/fetch/field_officers';
import AssignResource from 'src/components/AssignResource';
import { useAssignAgentToFOO } from 'src/fetch/agents';
import mainConfig from 'src/config/config.json';

/* eslint-disable */
// Assigns agent to a field officer
const AssignFieldOfficer = ({ disabled, agentDetails }) => {
  // This agent
  const { id: agentID } = useParams();
  const assignAgent = useAssignAgentToFOO();
  // List of field officers to be assigned to this agent
  const { data } = useFieldOfficerList();

  const { siteNames } = mainConfig.globalData;

  console.log({ agentDetails });

  let fooList = [];
  if (data) {
    fooList = data;
  }

  if (fooList) {
    fooList = fooList
      .map((foo) => {
        return {
          id: foo.id,
          name:
            foo.attributes &&
            foo.attributes.user &&
            `${foo.attributes.user.first_name} ${foo.attributes.user.last_name}`,
          email: foo?.attributes?.user.email
        };
      })
      .filter((foo) => foo.email !== agentDetails?.field_officer?.user.email);
  }

  return (
    <AssignResource
      title={`Assign ${siteNames.Agent.name} to Field Officer`}
      fieldLabel={`${siteNames.FOO.name}`}
      resourceList={fooList}
      data={{ agent: Number(agentID) }}
      action={assignAgent}
      disabled={disabled}
    />
  );
};

export default AssignFieldOfficer;
