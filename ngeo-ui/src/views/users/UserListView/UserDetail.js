import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DetailsDisplay from 'src/components/DetailsDisplay';
import SuccessChip from 'src/components/SuccessChip';
import capitalize from 'src/utils/capitalize';
import FailureChip from 'src/components/FailureChip';
import { roleNames as roles, roles as userRoles } from 'src/config';
import { useLocation } from 'react-router';

/*eslint-disable */
const UserDetail = ({ details }) => {
  const {
    email,
    first_name: firstName,
    is_active: status,
    last_name: lastName,
    date_joined: dateJoined,
    staff_number: staffNumber,
    role,
    area
  } = details;

  const { state } = useLocation();

  console.log({ state });

  let userArea = null;
  if (role == userRoles.RM) {
    userArea =
      area && area.region ? `${area.region} Region` : 'Area not assigned';
  }
  if (role == userRoles.CM) {
    userArea = area?.county ? `${area.county} County` : 'Area not assigned';
  }

  if (role == userRoles.FOO) {
    let county = area?.county && `County: ${area.county}`;
    let constituency =
      area?.constituency?.length && `Constituency: ${area?.constituency}`;
    let subCounty =
      area?.sub_county?.length && `Sub-County: ${area?.sub_county}`;
    let location = area?.location?.length && `Location: ${area?.location}`;
    let subLocation =
      area?.sub_location?.length && `Sub-Location: ${area?.sub_location}`;
    let ward = area?.ward?.length && `Ward: ${area?.ward}`;
    userArea = [county, constituency, subCounty, location, subLocation, ward]
      .filter((area) => Boolean(area))
      .join(', ');
  }

  const rows = [
    {
      name: 'Email',
      value: email || ''
    },
    {
      name: 'First Name',
      value: capitalize(firstName) || ''
    },
    {
      name: 'Last Name',
      value: capitalize(lastName) || ''
    },
    {
      name: 'Staff Number',
      value: staffNumber || ''
    },
    {
      name: 'Status',
      value: (status && <SuccessChip label="Active" />) || (
        <FailureChip label="Inactive" />
      )
    },
    { name: 'Date Joined', value: moment(dateJoined).format('lll') },
    {
      name: 'Role',
      value: roles[role]
    },
    {
      name: 'Area',
      value: userArea ? userArea : 'Area not assigned'
    }
  ];

  return <DetailsDisplay title="Personal Info" data={rows} />;
};

UserDetail.propTypes = {
  details: PropTypes.object
};

export default UserDetail;
