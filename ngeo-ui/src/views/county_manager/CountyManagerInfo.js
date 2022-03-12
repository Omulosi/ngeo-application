import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DetailsDisplay from 'src/components/DetailsDisplay';
import SuccessChip from 'src/components/SuccessChip';
import capitalize from 'src/utils/capitalize';
import FailureChip from 'src/components/FailureChip';
import { roles } from 'src/config';
import mainConfig from 'src/config/config.json';

/*eslint-disable */
const CountyManagerInfo = ({ details }) => {
  const {
    email,
    first_name: firstName,
    is_active: status,
    last_name: lastName,
    date_joined: dateJoined,
    area,
    staff_number
  } = details;

  const { siteNames } = mainConfig.globalData;

  const user = { role: roles.CM };

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
      name: 'Status',
      value: (status && <SuccessChip label="Active" />) || (
        <FailureChip label="Inactive" />
      )
    },
    { name: 'Date Joined', value: moment(dateJoined).format('lll') },
    { name: 'Staff Number', value: staff_number },
    {
      name: 'Area',
      value: area ? `${capitalize(area)} County` : 'Area not assigned'
    }
  ];

  return <DetailsDisplay title={`${siteNames.CM.name} Info`} data={rows} />;
};

CountyManagerInfo.propTypes = {
  details: PropTypes.object
};

export default CountyManagerInfo;
