/* eslint-disable object-curly-newline */
import React from 'react';
import createGetFeatureQuery from 'src/utils/queries';
import * as helpers from 'src/utils/helpers';
import { axiosGeneral } from 'src/utils/axios';

const useAdminAreas = () => {
  const axios = axiosGeneral();

  const [dataOptions, setDataOptions] = React.useState({
    regionOptions: [],
    countyOptions: [],
    // constituencyOptions: [],
    subCountyOptions: [],
    divisionOptions: [],
    locationOptions: [],
    subLocationOptions: []
  });

  const [loading, setLoading] = React.useState({
    isRegionLoading: false,
    isCountyLoading: false,
    // isConstituencyLoading: false,
    isSubCountyLoading: false,
    isDivisionLoading: false,
    isLocationLoading: false,
    isSubLocationLoading: false
  });

  // Region
  const regionsURL = createGetFeatureQuery('Ke_Region');
  // County
  const countiesURL = createGetFeatureQuery('Ke_County');
  // Constituency
  // const constituenciesURL = createGetFeatureQuery('Ke_Constituency');
  // Sub-County
  const subCountiesURL = createGetFeatureQuery('Ke_Sub_County');
  // Divisions
  const divisionsURL = createGetFeatureQuery('Ke_Division');
  // Locations
  const locationsURL = createGetFeatureQuery('Ke_Location');
  // Sub-Locations
  const subLocationsURL = createGetFeatureQuery('Ke_Sub_Location');

  React.useEffect(async () => {
    try {
      setLoading({
        isRegionLoading: true,
        isCountyLoading: true,
        // isConstituencyLoading: true,
        isSubCountyLoading: true,
        isDivisionLoading: true,
        isLocationLoading: true,
        isSubLocationLoading: true
      });

      // Region
      // check if regions already prev loaded.
      let regionData = helpers.getItemsFromStorage('regions');
      // Fetch afresh if not yet prev loaded.
      if (!regionData) {
        const { data } = await axios.get(regionsURL);
        regionData = data.features.map((ft) => {
          const { REGION: name } = ft.properties;
          return { name };
        });

        helpers.saveToStorage('regions', regionData);
      }

      // County

      let countyData = helpers.getItemsFromStorage('counties');
      if (!countyData) {
        const { data } = await axios.get(countiesURL);
        countyData = data.features.map((ft) => {
          const { COUNTY: name, REGION: region } = ft.properties;
          return { name, region };
        });

        helpers.saveToStorage('counties', countyData);
      }
      // sub county
      let subCountyData = helpers.getItemsFromStorage('subcounties');
      if (!subCountyData) {
        const { data } = await axios.get(subCountiesURL);
        subCountyData = data.features.map((ft) => {
          const {
            SUB_COUN: name,
            COUNTY: county,
            REGION: region
          } = ft.properties;
          return { name, county, region };
        });

        helpers.saveToStorage('subcounties', subCountyData);
      }

      // Division
      let divisionData = helpers.getItemsFromStorage('divisions');

      if (!divisionData) {
        const { data } = await axios.get(divisionsURL);

        divisionData = data.features.map((ft) => {
          const {
            CONSTITUEN: constituency,
            COUNTY: county,
            SUB_COUN: subCounty,
            REGION: region,
            DIVISION: name
          } = ft.properties;
          return { name, constituency, county, subCounty, region };
        });

        helpers.saveToStorage('divisions', divisionData);
      }

      // Location
      let locationData = helpers.getItemsFromStorage('locations');
      if (!locationData) {
        const { data } = await axios.get(locationsURL);
        locationData = data.features.map((ft) => {
          const {
            CONSTITUEN: constituency,
            COUNTY: county,
            SUB_COUN: subCounty,
            REGION: region,
            DIVISION: division,
            DISTRICT: district,
            LOCATION: name
          } = ft.properties;
          return {
            name,
            division,
            district,
            constituency,
            subCounty,
            county,
            region
          };
        });

        helpers.saveToStorage('locations', locationData);
      }

      // Sub-Location
      let subLocationData = helpers.getItemsFromStorage('sublocations');
      if (!subLocationData) {
        const { data } = await axios.get(subLocationsURL);
        subLocationData = data.features.map((ft) => {
          const {
            CONSTITUEN: constituency,
            COUNTY: county,
            SUB_COUN: subCounty,
            REGION: region,
            DIVISION: division,
            DISTRICT: district,
            LOCATION: location,
            SUB_LOCATI: name
          } = ft.properties;
          return {
            name,
            location,
            division,
            district,
            constituency,
            subCounty,
            county,
            region
          };
        });

        helpers.saveToStorage('sublocations', subLocationData);
      }

      // Update state with new data
      setDataOptions({
        regionOptions: regionData,
        countyOptions: countyData,
        // constituencyOptions: constituencyData,
        subCountyOptions: subCountyData,
        divisionOptions: divisionData,
        locationOptions: locationData,
        subLocationOptions: subLocationData
      });

      setLoading({
        isRegionLoading: false,
        isCountyLoading: false,
        // isConstituencyLoading: false,
        isSubCountyLoading: false,
        isDivisionLoading: false,
        isLocationLoading: false,
        isSubLocationLoading: false
      });
    } catch (err) {
      setLoading({
        isRegionLoading: false,
        isCountyLoading: false,
        // isConstituencyLoading: false,
        isSubCountyLoading: false,
        isDivisionLoading: false,
        isLocationLoading: false,
        isSubLocationLoading: false
      });
    }
  }, []);

  return {
    dataOptions,
    loading
  };
};

export default useAdminAreas;
