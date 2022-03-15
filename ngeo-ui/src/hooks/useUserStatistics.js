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
    //
    financeOfficers: [],
    ceos: [],
    hrs: [],
    regionalManagers: [],
    countyManagers: [],
    fieldOfficers: [],
    userCount: []
  });
  // Ignore admin and current user (HR)

  React.useEffect(() => {
    const userCount = Array.isArray(userList) ? userList?.length - 2 : 0;
    const financeOfficers = Array.isArray(userList)
      ? userList.filter((user) => isFinance(user.attributes.role))
      : [];
    const ceos = Array.isArray(userList)
      ? userList.filter((user) => isCEO(user.attributes.role))
      : [];

    const hrs = Array.isArray(userList)
      ? userList.filter((user) => isHR(user.attributes.role))
      : [];

    const regionalManagers = Array.isArray(userList)
      ? userList.filter((user) => isRegionalManager(user.attributes.role))
      : [];

    let countyManagers = Array.isArray(userList)
      ? userList.filter((user) => isCountyManager(user?.attributes?.role))
      : [];

    let fieldOfficers = Array.isArray(userList)
      ? userList.filter((user) => isFieldOfficer(user.attributes.role))
      : [];

    if (isRegionalManager(role)) {
      // debugger;
      countyManagers = Array.isArray(userList)
        ? userList.filter(
            (user) =>
              isCountyManager(user.attributes.role) &&
              user?.attributes?.area?.region === userArea
          )
        : [];

      fieldOfficers = Array.isArray(userList)
        ? userList.filter(
            (user) =>
              isFieldOfficer(user.attributes.role) &&
              user.attributes.area &&
              user.attributes.area.region &&
              user.attributes.area.region === userArea
          )
        : [];
    }

    if (isCountyManager(role)) {
      countyManagers = Array.isArray(userList)
        ? userList.filter(
            (user) =>
              isCountyManager(user.attributes.role) &&
              user?.attributes?.area?.county === userArea
          )
        : [];

      fieldOfficers = Array.isArray(userList)
        ? userList.filter(
            (user) =>
              isFieldOfficer(user.attributes.role) &&
              user?.attributes?.area?.county === userArea
          )
        : [];
    }

    setUserStatistics((stats) => ({
      ...stats,
      financeOfficers,
      ceos,
      hrs,
      regionalManagers,
      countyManagers,
      fieldOfficers,
      userCount
    }));
  }, [userList, role, userArea]);

  return userStatistics;
};

export default useUserStatistics;
