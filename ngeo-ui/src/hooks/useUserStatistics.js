/* eslint-disable */

import React from 'react';
import {
  isFinance,
  isHR,
  isRegionalManager,
  isCountyManager,
  isFieldOfficer,
  isCEO
} from 'src/utils/getRole';

const useUserStatistics = ({ userList, role, userArea }) => {
  const [userStatistics, setUserStatistics] = React.useState({
    financeOfficerCount: 0,
    ceoCount: 0,
    hrCount: 0,
    regionalManagerCount: 0,
    countyManagerCount: 0,
    fieldOfficerCount: 0,
    userCount: 0
  });
  // Ignore admin and current user (HR)

  React.useEffect(() => {
    const users = Array.isArray(userList) ? userList.length - 2 : 0;
    const financeOfficers = Array.isArray(userList)
      ? userList.filter((user) => isFinance(user.attributes.role)).length
      : 0;
    const ceos = Array.isArray(userList)
      ? userList.filter((user) => isCEO(user.attributes.role)).length
      : 0;

    const hrs = Array.isArray(userList)
      ? userList.filter((user) => isHR(user.attributes.role)).length
      : 0;

    const regionalManagers = Array.isArray(userList)
      ? userList.filter((user) => isRegionalManager(user.attributes.role))
          .length
      : 0;

    let countyManagers = Array.isArray(userList)
      ? userList.filter((user) => isCountyManager(user.attributes.role)).length
      : 0;

    let fieldOfficers = Array.isArray(userList)
      ? userList.filter((user) => isFieldOfficer(user.attributes.role)).length
      : 0;

    if (isRegionalManager(role)) {
      // debugger;
      countyManagers = Array.isArray(userList)
        ? userList.filter(
            (user) =>
              isCountyManager(user.attributes.role) &&
              user.attributes.area &&
              user.attributes.area.region &&
              user.attributes.area.region === userArea
          ).length
        : 0;

      fieldOfficers = Array.isArray(userList)
        ? userList.filter(
            (user) =>
              isFieldOfficer(user.attributes.role) &&
              user.attributes.area &&
              user.attributes.area.region &&
              user.attributes.area.region === userArea
          ).length
        : 0;
    }

    if (isCountyManager(role)) {
      countyManagers = Array.isArray(userList)
        ? userList.filter(
            (user) =>
              isCountyManager(user.attributes.role) &&
              user.attributes.area &&
              user.attributes.area.county &&
              user.attributes.area.county === userArea
          ).length
        : 0;

      fieldOfficers = Array.isArray(userList)
        ? userList.filter(
            (user) =>
              isFieldOfficer(user.attributes.role) &&
              user.attributes.area &&
              user.attributes.area.county &&
              user.attributes.area.county === userArea
          ).length
        : 0;
    }

    setUserStatistics((stats) => ({
      ...stats,
      financeOfficerCount: financeOfficers,
      ceoCount: ceos,
      hrCount: hrs,
      regionalManagerCount: regionalManagers,
      countyManagerCount: countyManagers,
      fieldOfficerCount: fieldOfficers,
      userCount: users
    }));
  }, [userList, role, userArea]);

  return userStatistics;
};

export default useUserStatistics;
