import React from 'react';
/* eslint-disable */
import PropTypes from 'prop-types';
import AssignResource from 'src/components/AssignResource';
import { roleNames, roles } from 'src/config';
import useUser from 'src/fetch/user';
import { useAssignRole } from 'src/fetch/user';

/* eslint-disable */
const AssignRole = ({ user, setRole, setAssignAreaDisabled }) => {
  const { data: authUser } = useUser();
  const assignRole = useAssignRole();
  let roleList = Object.entries(roleNames).map(([key, value]) => {
    return {
      id: key,
      name: value
    };
  });

  if (authUser?.attributes.role === roles.HR) {
    roleList = roleList.filter((r) => r.name !== 'Admin' && r.name !== 'Agent');
  }

  return (
    <AssignResource
      title="Assign Role"
      fieldLabel="Role"
      resourceList={roleList}
      data={user}
      action={assignRole}
      setRole={setRole}
      setAssignAreaDisabled={setAssignAreaDisabled}
      disabled={!user?.is_active}
    />
  );
};

AssignRole.propTypes = {
  /**
   * sample:
   * user obj
   */
  user: PropTypes.object
};

export default AssignRole;
