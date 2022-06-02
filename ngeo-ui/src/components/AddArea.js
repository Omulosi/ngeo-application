import React from 'react';
/* eslint-disable */
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  FormHelperText
} from '@material-ui/core';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useSnackbar } from 'notistack';
import useUser from 'src/fetch/user';
import ComboBox from './GeneralComboBox';
import AsynchronousComboBox from './AsynchronousComboBox';
import regionData from 'src/data/regionData';
import useCountyManager from 'src/fetch/county_managers';
import { axiosGeneral } from 'src/utils/axios';
import mainConfig from 'src/config/config.json';
import { useAssignArea } from 'src/fetch/area';
import {
  isFinance as isFinanceOfficer,
  isCountyManager,
  isFieldOfficer,
  isRegionalManager,
  isHR as isUserHR
} from 'src/utils/getRole';
import useAdminAreas from 'src/hooks/useAdminAreas';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120
  },
  content: {
    // marginTop: theme.spacing(2)
  },
  header: {
    color: '#263228',
    fontSize: '1.5rem'
  },
  error: {
    textAlign: 'left',
    padding: '1em'
  }
}));

const initialValues = {
  region: '',
  county: [],
  constituency: [],
  sub_county: [],
  division: [],
  location: [],
  sub_location: [],
  ward: []
};

const AddArea = ({ user, assigner, project, disabled }) => {
  const classes = useStyles();
  const { data: loggedInUser } = useUser();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const assignArea = useAssignArea();
  const [selectedRegion, setSelectedRegion] = React.useState(''); // RM
  const [selectedCounty, setSelectedCounty] = React.useState(''); // CM
  const [selectedSubCounty, setSelectedSubCounty] = React.useState('');
  const [selectedDivision, setSelectedDivision] = React.useState('');
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [selectedSubLocation, setSelectedSubLocation] = React.useState('');

  React.useEffect(() => {
    setSelectedRegion(loggedInUser?.attributes.area?.region || '');
    setSelectedCounty(loggedInUser?.attributes.area?.county || '');
  }, [loggedInUser]);

  const [isNairobiArea, setIsNairobiArea] = React.useState(false);

  const [isRegionDisabled, setRegionDisabled] = React.useState(false);
  const [isCountyDisabled, setCountyDisabled] = React.useState(false);
  // const [isConstituencyDisabled, setConstituencyDisabled] = React.useState(
  //   false
  // );
  const [isSubCountyDisabled, setSubCountyDisabled] = React.useState(false);
  const [isDivisionDisabled, setDivisionDisabled] = React.useState(false);
  const [isLocationDisabled, setLocationDisabled] = React.useState(false);
  const [isSubLocationDisabled, setSubLocationDisabled] = React.useState(false);

  const [values, setValues] = React.useState(initialValues);

  let { nairobiCountyJurisdictions } = mainConfig.globalData;
  nairobiCountyJurisdictions = nairobiCountyJurisdictions.map((area) => ({
    name: area.name,
    region: 'Nairobi'
  }));

  const {
    dataOptions: {
      regionOptions = '',
      countyOptions = '',
      subCountyOptions = [],
      divisionOptions = [],
      locationOptions = [],
      subLocationOptions = []
    },
    loading
  } = useAdminAreas();

  // Filter for county specific data
  let [filteredRegionOptions, setRegions] = React.useState(regionOptions);
  let [filteredCountyOptions, setCounties] = React.useState(countyOptions);
  //  if (selectedRegion.toLocaleLowerCase().includes('nairobi')) {
  //    filteredCountyOptions = nairobiCountyJurisdictions;
  //  }
  let [filteredSubCountyOptions, setSubCounties] = React.useState(
    subCountyOptions
  );
  let [filteredDivisionOptions, setDivisions] = React.useState(divisionOptions);
  let [filteredLocationOptions, setLocations] = React.useState(locationOptions);
  let [filteredSubLocationOptions, setSubLocations] = React.useState(
    subLocationOptions
  );

  React.useEffect(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, [dispatch]);

  React.useEffect(() => {
    let filteredCountyOptions = countyOptions.filter(
      (county) =>
        county?.region.toLocaleLowerCase() ===
        selectedRegion?.toLocaleLowerCase()
    );

    if (selectedRegion.toLocaleLowerCase().includes('nairobi')) {
      filteredCountyOptions = nairobiCountyJurisdictions;
    }

    setCounties(filteredCountyOptions);

    let filteredSubCountyOptions = subCountyOptions.filter((sc) =>
      selectedCounty
        ?.toLocaleLowerCase()
        .includes(sc?.county.toLocaleLowerCase())
    );
    setSubCounties(filteredSubCountyOptions);

    let filteredDivisionOptions = divisionOptions?.filter(
      (div) =>
        div?.subCounty
          .toLocaleLowerCase()
          .includes(
            selectedSubCounty.length && selectedSubCounty[0].toLocaleLowerCase()
          ) ||
        selectedCounty
          .toLocaleLowerCase()
          .includes(div.county.toLocaleLowerCase())
    );
    setDivisions(filteredDivisionOptions);

    let filteredLocationOptions = locationOptions?.filter(
      (loc) =>
        loc?.division
          .toLocaleLowerCase()
          .includes(
            selectedDivision.length && selectedDivision[0].toLocaleLowerCase()
          ) ||
        selectedCounty
          .toLocaleLowerCase()
          .includes(loc?.county.toLocaleLowerCase())
    );
    setLocations(filteredLocationOptions);

    let filteredSubLocationOptions = subLocationOptions.filter(
      (sub) =>
        sub?.location
          .toLocaleLowerCase()
          .includes(
            selectedLocation.length && selectedLocation[0].toLocaleLowerCase()
          ) ||
        selectedCounty
          .toLocaleLowerCase()
          .includes(sub?.county.toLocaleLowerCase())
    );
    setSubLocations(filteredSubLocationOptions);
  }, [
    selectedRegion,
    selectedCounty,
    selectedSubCounty,
    selectedDivision,
    selectedLocation,
    user
  ]);

  // Filter all areas by county
  // if (isSessionCM) {
  //   let currentCounty = loggedInUser.attributes.area.county;
  //   // sub county
  //   filteredSubCountyOptions = filteredSubCountyOptions.filter((sc) =>
  //     currentCounty.toLocaleLowerCase().includes(sc.county.toLocaleLowerCase())
  //   );

  //   // debugger;

  //   // division
  //   filteredDivisionOptions = filteredDivisionOptions?.filter((div) =>
  //     currentCounty.toLocaleLowerCase().includes(div.county.toLocaleLowerCase())
  //   );
  //   // location
  //   filteredLocationOptions = filteredLocationOptions?.filter((loc) =>
  //     currentCounty.toLocaleLowerCase().includes(loc.county.toLocaleLowerCase())
  //   );
  //   // sub location
  //   filteredSubLocationOptions = filteredSubLocationOptions.filter((sub) =>
  //     currentCounty.toLocaleLowerCase().includes(sub.county.toLocaleLowerCase())
  //   );
  // }

  // /* Update county options to show only counties found in current region when user is HR or Finance */
  // if (isFinance || isHR) {
  //   /* Get counties for this region */
  //   if (selectedRegion) {
  //     filteredCountyOptions = filteredCountyOptions.filter(
  //       (county) =>
  //         county.region.toLocaleLowerCase() ===
  //         selectedRegion.toLocaleLowerCase()
  //     );
  //   }
  // }

  /* Get roles of user being assigned an area (user object from prop) */
  const isCM = isCountyManager(user?.role);
  const isFOO = isFieldOfficer(user?.role);
  const isRM = isRegionalManager(user?.role);
  /* Get roles of currently logged in user */
  const isHR = isUserHR(loggedInUser?.attributes.role);
  const isFinance = isFinanceOfficer(loggedInUser?.attributes.role);

  const error = useSelector((state) => state.area.areaError, shallowEqual);

  const resetForm = () => {
    setValues(initialValues);
  };

  const handleChange = (evt, dataObj, key) => {
    if (dataObj === null) {
      enqueueSnackbar('Please select a value', {
        variant: 'warning'
      });
      return;
    }

    if (key === 'region') {
      setValues({ ...values, region: dataObj.name });
      setSelectedRegion(dataObj.name);
    }

    if (key === 'county') {
      setValues({ ...values, county: [dataObj.name] });
      setSelectedCounty(dataObj.name);
    }

    if (key === 'subcounty') {
      const subCounties = dataObj
        .map((sc) => (sc ? sc.name : ''))
        .filter((sc) => Boolean(sc));
      setValues({ ...values, sub_county: subCounties });
      setSelectedSubCounty(subCounties);
      // Disabled rest of areas
      if (dataObj && dataObj.length > 0) {
        // setConstituencyDisabled(true);
        setDivisionDisabled(true);
        setLocationDisabled(true);
        setSubLocationDisabled(true);
      } else {
        // setConstituencyDisabled(false);
        setLocationDisabled(false);
        setSubLocationDisabled(false);
        setDivisionDisabled(false);
      }
    }

    if (key === 'division') {
      const divisions = dataObj
        .map((div) => (div ? div.name : ''))
        .filter((div) => Boolean(div));
      setValues({ ...values, division: divisions });
      setSelectedDivision(divisions);
      // Disabled rest of areas
      if (dataObj && dataObj.length > 0) {
        setSubCountyDisabled(true);
        setLocationDisabled(true);
        setSubLocationDisabled(true);
      } else {
        setSubCountyDisabled(false);
        setLocationDisabled(false);
        setSubLocationDisabled(false);
      }
    }

    if (key === 'location') {
      const locations = dataObj
        .map((loc) => (loc ? loc.name : ''))
        .filter((loc) => Boolean(loc));
      setValues({ ...values, location: locations });
      setSelectedLocation(locations);
      // Disabled rest of areas
      if (dataObj && dataObj.length > 0) {
        setDivisionDisabled(true);
        setSubCountyDisabled(true);
        setSubLocationDisabled(true);
      } else {
        setDivisionDisabled(false);
        setSubCountyDisabled(false);
        setSubLocationDisabled(false);
      }
    }

    if (key === 'sub_location') {
      const subLocations = dataObj
        .map((sb) => (sb ? sb.name : ''))
        .filter((sb) => Boolean(sb));
      setValues({ ...values, sub_location: subLocations });
      setSelectedSubLocation(subLocations);

      // Disabled rest of areas
      if (dataObj && dataObj.length > 0) {
        setDivisionDisabled(true);
        setLocationDisabled(true);
        setSubCountyDisabled(true);
      } else {
        setDivisionDisabled(false);
        setLocationDisabled(false);
        setSubCountyDisabled(false);
      }
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (isFinance) {
      if (!values.region || values.county.length == 0) {
        enqueueSnackbar('Please provide both Region and County', {
          variant: 'warning'
        });
        return;
      }
    }
    assignArea.mutate(
      {
        ...values,
        user_id: user && (user.role === 'agent' ? user.agentId : user.uuid),
        role: user && user.role,
        project_id: project ? project.id : ''
      },
      enqueueSnackbar,
      resetForm
    );
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.content)}
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader title="Assign or update area" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/**  */}
            {(isRM || isFinance || isHR) && (
              <Grid item lg={12} md={12} xs={12}>
                <ComboBox
                  required
                  label="Region"
                  name="region"
                  options={regionData.regions}
                  onChange={(e, value) => {
                    handleChange(e, value, 'region');
                  }}
                  disabled={disabled}
                />
              </Grid>
            )}

            {/** when assigning area to a CM, he shouldnt see from sub-county downwards */}
            {(isCM || isFinance || (isHR && isFOO)) && (
              <Grid item lg={12} md={12} xs={12}>
                <AsynchronousComboBox
                  disabled={isCountyDisabled}
                  loading={loading.isCountyLoading}
                  label="County"
                  name="county"
                  value={values.county[0]}
                  options={filteredCountyOptions.sort(
                    (a, b) => -b.region.localeCompare(a.region)
                  )}
                  groupBy={(option) => option.region}
                  onChange={(e, value) => handleChange(e, value, 'county')}
                />
              </Grid>
            )}

            {/** Assign constituency */}
            {/*!isCM && !isRM && !(isHR && isFOO) && !isFinance && (
              <Grid item lg={12} md={12} xs={12}>
                <AsynchronousComboBox
                  disabled={isConstituencyDisabled}
                  loading={loading.isConstituencyLoading}
                  label="Constituency(s)"
                  name="constituency"
                  multiple={true}
                  value={values.constituency[0]}
                  options={filteredConstituencyOptions.sort(
                    (a, b) => -b.county.localeCompare(a.county)
                  )}
                  groupBy={(option) => option.county}
                  onChange={(e, value) =>
                    handleChange(e, value, 'constituency')
                  }
                />
              </Grid>
                )*/}

            {!isCM && !isRM && !(isHR && isFOO) && !isFinance && (
              <Grid item lg={12} md={12} xs={12}>
                <AsynchronousComboBox
                  disabled={isSubCountyDisabled}
                  loading={loading.isSubCountyLoading}
                  label="Sub-County(s)"
                  name="sub_county"
                  multiple={true}
                  value={values.sub_county[0]}
                  options={filteredSubCountyOptions.sort(
                    (a, b) => -b.county.localeCompare(a.county)
                  )}
                  groupBy={(option) => option.county}
                  onChange={(e, value) => handleChange(e, value, 'subcounty')}
                />
              </Grid>
            )}

            {!isCM && !isRM && !(isHR && isFOO) && !isFinance && (
              <Grid item lg={12} md={12} xs={12}>
                <AsynchronousComboBox
                  loading={loading.isDivisionLoading}
                  disabled={isDivisionDisabled}
                  label="Division(s)"
                  name="division"
                  multiple={true}
                  options={filteredDivisionOptions}
                  value={values.division[0]}
                  groupBy={(option) => option.county}
                  onChange={(e, value) => {
                    handleChange(e, value, 'division');
                  }}
                />
              </Grid>
            )}
            {!isCM && !isRM && !(isHR && isFOO) && !isFinance && (
              <Grid item lg={12} md={12} xs={12}>
                <AsynchronousComboBox
                  loading={loading.isLocationLoading}
                  disabled={isLocationDisabled}
                  multiple={true}
                  label="Location(s)"
                  name="location"
                  value={values.location[0]}
                  options={filteredLocationOptions}
                  groupBy={(option) => option.county}
                  // groupBy={(option) => option.subCounty}
                  onChange={(e, value) => {
                    handleChange(e, value, 'location');
                  }}
                />
              </Grid>
            )}
            {!isCM && !isRM && !(isHR && isFOO) && !isFinance && (
              <Grid item lg={12} md={12} xs={12}>
                <AsynchronousComboBox
                  loading={loading.isSubLocationLoading}
                  disabled={isLocationDisabled}
                  multiple={true}
                  label="Sub-Location(s)"
                  name="sub_location"
                  value={values.sub_location[0]}
                  options={filteredSubLocationOptions}
                  groupBy={(option) => option.county}
                  // groupBy={(option) => option.subCounty}
                  onChange={(e, value) => {
                    handleChange(e, value, 'sub_location');
                  }}
                />
              </Grid>
            )}
          </Grid>
        </CardContent>
        <Divider />
        <FormHelperText className={classes.error} error>
          {' '}
          {error && error}
        </FormHelperText>
        <Box display="flex" justifyContent="flex-start" p={2}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={disabled}
          >
            Submit
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AddArea;
