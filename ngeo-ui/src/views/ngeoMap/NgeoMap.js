/* eslint-disable no-duplicate-case */
/* eslint-disable no-case-declarations */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prefer-destructuring */
/* eslint-disable operator-assignment */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-shadow */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable object-curly-newline */
import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, List, Divider, Tooltip } from '@material-ui/core';
import createGetFeatureQuery, {
  createFilterFeatureQuery
} from 'src/utils/queries';
import useUser from 'src/fetch/user';
import { roles } from 'src/config';
import * as helpers from 'src/utils/helpers';
import { useThemes } from 'src/fetch/themes';
// import Loading from 'src/components/Loading';
import {
  isFinance as isFinanceOfficer,
  isCountyManager,
  isFieldOfficer,
  isCEO as isUserCEO,
  isRegionalManager
} from 'src/utils/getRole';

import {
  BOUNDARY_ZINDEX_OFFSET,
  INSTALLATIONS_ZINDEX_OFFSET,
  MYDATA_ZINDEX_OFFSET
} from 'src/constants';

import { vectorGeoJson, vectorSourceWMS, vectorSourceImageWMS } from './Source';
import AccordionItem from './AccordionItem';
import ListItem from './LayerListItem';
// icons
// import { icons } from './geoStyles';

// image icons
import pointIcon from './images/point.png';
import arrowIcon from './images/arrow.png';
import polygonIcon from './images/polygon.png';
import polyLineIcon from './images/polyline.png';
import noneIcon from './images/none.png';

// Load layers to map
import { Layers, VectorLayer, TileLayer, ImageLayer } from './Layers';
// Map Controls
import {
  Controls,
  SearchNominatimControl,
  ProjectSelectControl
} from './Controls';
// Map Interactions
import {
  Interactions,
  DrawInteraction,
  MeasureInteraction
} from './Interactions';
import SideDrawer from './SideDrawerWrapper';
import Navigation from './Navigation/Navigation';
import styles, { icons } from './geoStyles';

const useStyles = makeStyles({
  map: {
    height: '100vh',
    position: 'relative'
  },
  container: {
    position: 'relative'
  },
  layerItem: {},
  checkbox: {
    marginRight: '0.5em'
  },
  checkboxName: {
    fontSize: '0.9rem'
  },
  layerTitle: {
    backgroundColor: 'rgb(35, 48, 68)',
    color: '#fff'
  },
  innerContent: {
    paddingLeft: '10px',
    backgroundColor: 'rgb(35, 48, 68)',
    paddingBottom: '1em'
  },
  listItem: {
    fontSize: '9px'
  },
  circle: {
    width: '8px !important',
    height: '8px !important',
    backgroundColor: 'blue',
    borderRadius: '50%'
  },
  editItemsContainer: {
    display: 'flex',
    minWidth: '120px',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: '5px',
    padding: '4px',
    background: 'linear-gradient(180deg,#fff 0,#e5e5e5)',
    boxShadow: '0 0 0 1px rgb(0 0 0 / 10%), 0 4px 6px rgb(0 0 0 / 20%)',
    cursor: 'normal'
  },
  editItem: {
    borderRight: '1px solid #e8e8e8',
    textAlign: 'center',
    flex: 1,
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  editIcon: {
    width: '100%',
    cursor: 'pointer'
  },
  buttonBar: {
    // background: 'linear-gradient(180deg, #fff 0,#e5e5e5)',
    // boxShadow: '0 0 0 1px rgb(0 0 0 / 10%), 0 4px 6px rgb(0 0 0 / 20%)',
    marginBottom: '10px',
    marginTop: '15px',
    marginLeft: '10px',
    width: '50%',
    display: 'inline-block',
    padding: '4px'
  },
  buttonContainer: {
    display: 'inline-block',
    // borderRight: '1px solid #e8e8e8',
    background: 'linear-gradient(180deg, #fff 0,#e5e5e5)',
    boxShadow: '0 0 0 1px rgb(0 0 0 / 10%), 0 4px 6px rgb(0 0 0 / 20%)'
  },
  button: {
    height: '38px',
    width: '34px',
    border: 'none',
    backgroundColor: 'initial',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  buttonActive: {
    // background: '#f2f5f6',
    background: 'linear-gradient(180deg,#f2f5f6 0,#e3eaed 37%,#c8d7dc)',
    border: '1px solid #97c3e8',
    boxShadow: '0 0 5px rgb(136 231 255 / 74%)'
  },
  iconItem: {
    // color: 'rgb(238,238,238)',
    '& .MuiTypography-body1': {
      fontSize: '0.85rem'
    }
  }
});

const NgeoMap = ({ layers = [], capabilities = [] }) => {
  const classes = useStyles();

  // Set type of geometry to draw on map
  const [drawType, setDrawType] = React.useState('None');
  const [measureType, setMeasureType] = React.useState('None');
  const [activeButton, setActiveButton] = React.useState('cancel');

  // Map group layers
  const [adminLayers, setAdminLayers] = React.useState([]);
  const [installationLayers, setInstallationLayers] = React.useState([]);
  const [myDataLayers, setMyDataLayers] = React.useState([]);
  // Sidebar content to control layers
  const [adminBoundaryContent, setAdminBoundaryContent] = React.useState([]);
  const [installationContent, setInstallationContent] = React.useState([]);
  const [myDataContent, setMyDataContent] = React.useState([]);

  // Admin Boundaries
  const [showRegion, setShowRegion] = useState(false);
  const [showCounty, setShowCounty] = useState(false);
  const [showSubCounty, setShowSubCounty] = useState(false);
  const [showConstituency, setShowConstituency] = useState(false);
  const [showDivision, setShowDivision] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showSubLocation, setShowSubLocation] = useState(false);
  const [showBoundary, setShowBoundary] = useState(false);
  const [showTransparentBoundary, setShowTransparentBoundary] = useState(false);

  // UserAdmin Boundaries
  const [showUserRegion, setShowUserRegion] = useState(false);
  const [showUserCounty, setShowUserCounty] = useState(false);
  const [showUserSubCounty, setShowUserSubCounty] = useState(false);
  const [showUserConstituency, setShowUserConstituency] = useState(false);
  const [showUserDivision, setShowUserDivision] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [showUserSubLocation, setShowUserSubLocation] = useState(false);

  // Installations
  const [showRoadClassA, setShowRoadClassA] = useState(false);
  const [showRoadClassB, setShowRoadClassB] = useState(false);
  const [showRoadClassC, setShowRoadClassC] = useState(false);
  const [showRoadClassD, setShowRoadClassD] = useState(false);
  //
  const [showInstituteOfTechnology, setShowInstituteOfTechnology] = useState(
    false
  );
  const [showNgao, setShowNgao] = useState(false);
  const [showNPS, setShowNPS] = useState(false);
  const [showForestStation, setShowForestStation] = useState(false);
  const [showForest, setShowForest] = useState(false);
  const [showSafaricomBTS, setShowSafaricomBTS] = useState(false);
  const [showTelkomBTS, setShowTelkomBTS] = useState(false);
  const [showPolytechnic, setShowPolytechnic] = useState(false);
  const [showPowerStation, setShowPowerStation] = useState(false);
  const [showPrimarySchool, setShowPrimarySchool] = useState(false);
  const [showSecondarySchool, setShowSecondarySchool] = useState(false);
  const [showHealthCentres, setShowHealthCentres] = useState(false);
  //
  const [showTownOther, setShowTownOther] = useState(false);
  const [showTownDist, setShowTownDist] = useState(false);
  const [showTownDiv, setShowTownDiv] = useState(false);
  const [showTownRegion, setShowTownRegion] = useState(false);
  const [showUniversity, setShowUniversity] = useState(false);
  const [showKTTC, setShowKTTC] = useState(false);
  const [showLakes, setShowLakes] = useState(false);

  // My Data
  const [showIncident, setShowIncident] = useState(false);
  const [showThreat, setShowThreat] = useState(false);
  const [showProject, setShowProject] = useState(true);
  const [showJurisdiction, setShowJurisdiction] = useState(true);
  const [jurisdictionURL, setJurisdictionURL] = useState('');

  const toggleShowUserLayer = (layerName) => {
    switch (layerName.toLocaleLowerCase()) {
      // User Areas
      // Admin Boundaries
      case 'ke_region':
        setShowUserRegion((showUserRegion) => !showUserRegion);
        break;
      case 'ke_county':
        setShowUserCounty(!showUserCounty);
        break;
      case 'ke_sub_county':
        setShowUserSubCounty(!showUserSubCounty);
        break;
      case 'ke_constituency':
        setShowUserConstituency(!showUserConstituency);
        break;
      case 'ke_division':
        setShowUserDivision(!showUserDivision);
        break;
      case 'ke_location':
        setShowUserLocation(!showUserLocation);
        break;
      case 'ke_sub_location':
        setShowUserSubLocation(!showUserSubLocation);
        break;
      default:
    }
  };

  const toggleShowLayer = (layerName) => {
    switch (layerName.toLocaleLowerCase()) {
      // Admin Boundaries
      case 'ke_region':
        setShowRegion((showRegion) => !showRegion);
        break;
      case 'ke_county':
        setShowCounty((showCounty) => !showCounty);
        break;
      case 'ke_sub_county':
        setShowSubCounty((showSubCounty) => !showSubCounty);
        break;
      case 'ke_constituency':
        setShowConstituency((showConstituency) => !showConstituency);
        break;
      case 'ke_division':
        setShowDivision((showDivision) => !showDivision);
        break;
      case 'ke_location':
        setShowLocation((showLocation) => !showLocation);
        break;
      case 'ke_sub_location':
        setShowSubLocation((showSubLocation) => !showSubLocation);
        break;
      case 'ke_national_boundary':
        setShowBoundary((showBoundary) => !showBoundary);
        break;
      case 'ke_transparent_boundary':
        setShowTransparentBoundary(
          (showTransparentBoundary) => !showTransparentBoundary
        );
        break;
      case 'jurisdiction':
        setShowJurisdiction((showJurisdiction) => !showJurisdiction);
        break;
      // Installations
      case 'ke_class_a_road':
        setShowRoadClassA((showRoadClassA) => !showRoadClassA);
        break;
      case 'ke_class_b_road':
        setShowRoadClassB(!showRoadClassB);
        break;
      case 'ke_class_c_road':
        setShowRoadClassC(!showRoadClassC);
        break;
      case 'ke_class_d_road':
        setShowRoadClassD(!showRoadClassD);
        break;
      case 'ke_forest_station':
        setShowForestStation((showForestStation) => !showForestStation);
        break;
      case 'ke_nps':
        setShowNPS(!showNPS);
        break;
      case 'ke_ngao':
        setShowNgao(!showNgao);
        break;
      case 'ke_institute_of_technology':
        setShowInstituteOfTechnology(!showInstituteOfTechnology);
        break;
      case 'ke_gazetted_forest':
        setShowForest(!showForest);
        break;
      case 'ke_safaricom_bts':
        setShowSafaricomBTS(!showSafaricomBTS);
        break;
      case 'ke_telkom_bts':
        if (showTelkomBTS) {
          setShowTelkomBTS(false);
        } else {
          setShowTelkomBTS(true);
        }

        break;
      case 'ke_polytechnic':
        setShowPolytechnic(!showPolytechnic);
        break;
      case 'ke_power_station':
        setShowPowerStation(!showPowerStation);
        break;
      case 'ke_primary_schools':
        setShowPrimarySchool(!showPrimarySchool);
        break;
      case 'ke_secondary_school':
        setShowSecondarySchool(!showSecondarySchool);
        break;
      case 'ke_health_facility':
        setShowHealthCentres(!showHealthCentres);
        break;
      case 'ke_town_other':
        setShowTownOther(!showTownOther);
        break;
      case 'ke_town_disthq':
        setShowTownDist(!showTownDist);
        break;
      case 'ke_town_divhq':
        setShowTownDiv(!showTownDiv);
        break;
      case 'ke_town_regionhq':
        setShowTownRegion(!showTownRegion);
        break;
      //
      case 'ke_university':
        setShowUniversity(!showUniversity);
        break;
      case 'ke_lakes':
        setShowLakes(!showLakes);
        break;
      case 'ke_teachers_training_college':
        setShowKTTC(!showKTTC);
        break;
      case 'incidence_incident':
        setShowIncident(!showIncident);
        break;
      case 'threat_threat':
        setShowThreat(!showThreat);
        break;
      case 'projects_project':
        const toggleProject = !showProject;
        setShowProject(!showProject);
        // Event handled in src/views/ngeoMap/Controls/SelectControl module
        window.emitter.emit('onToggleProjects', toggleProject);
        break;
      // User Areas
      // Admin Boundaries
      case 'ke_region':
        setShowUserRegion(!showUserRegion);
        break;
      case 'ke_county':
        setShowUserCounty(!showUserCounty);
        break;
      case 'ke_sub_county':
        setShowUserSubCounty(!showUserSubCounty);
        break;
      case 'ke_constituency':
        setShowUserConstituency(!showUserConstituency);
        break;
      case 'ke_division':
        setShowUserDivision(!showUserDivision);
        break;
      case 'ke_location':
        setShowUserLocation(!showUserLocation);
        break;
      case 'ke_sub_location':
        setShowUserSubLocation(!showUserSubLocation);
        break;
      default:
    }
  };

  // Get currently logged in user
  const { data: user } = useUser();

  // Load themes - display their color icons in RHS sidebar
  const { data: themeData } = useThemes();

  const themes =
    themeData?.map((theme) => ({
      id: theme.id,
      name: theme.attributes.name,
      color: theme.attributes.color
    })) || [];

  // Get is authenticated only after user query is complete
  const isAuthenticated = user?.isAuthenticated;
  const userData = user?.attributes || {};
  const isFinance = isFinanceOfficer(userData?.role);
  const isCEO = isUserCEO(userData?.role);
  const isCM = isCountyManager(userData?.role);
  const isRM = isRegionalManager(userData?.role);
  const isFOO = isFieldOfficer(userData?.role);
  let nationalBoundaryExtent = null;

  const interactions = [
    <DrawInteraction type={drawType} setType={setDrawType} />,
    <MeasureInteraction measureType={measureType} setType={setMeasureType} />
  ];

  const controls = [<SearchNominatimControl key={helpers.getUID()} />];

  if (isAuthenticated) {
    controls.push(<ProjectSelectControl key={helpers.getUID()} />);
  }

  /** Prevents reloading of jurisdiction layer every time there is an update on the map e.g
   * when toggling installation items.
   * User's area would blink on each reload if memoization is not used
   */
  const jurisdictionLayer = React.useMemo(() => {
    if (jurisdictionURL) {
      return (
        <VectorLayer
          key={helpers.getUID()}
          source={vectorGeoJson({
            url: jurisdictionURL
          })}
          visible={showJurisdiction}
          isVisible={showJurisdiction}
          style={styles.userAreaFunction}
          zIndex={MYDATA_ZINDEX_OFFSET * 1.5}
          type="area"
          isUserArea={true}
          name="jurisdictionLayer"
        />
      );
    }
    return null;
  }, [jurisdictionURL, showJurisdiction]);

  React.useEffect(() => {
    if (!layers) {
      return;
    }

    // Object representing user area
    const userAreaObject = { name: '', type: '', url: '' };

    layers.forEach((layer) => {
      const groupTitle = layer.layerGroup.title;

      // List of layers in this group
      let groupLayers = layer.layerGroup.publishables.published;
      // One group layer comes as an object, not an array.
      // This makes it into an array that's amenable to be looped
      // over, makes sure loop logic below wont be changed for this
      // special case.
      if (!Array.isArray(groupLayers)) {
        groupLayers = [groupLayers];
      }

      if (groupTitle.toLocaleLowerCase().includes('admin boundaries')) {
        /* ================================ Admin Boundaries ================================= */

        // Global container for admin checkbox items to control visibility of corresponding layers
        const adminBoundaryItems = [];
        // Global container to hold all layers in this group
        const adminLayers = [];

        // Create layers and their corresponding control item and update above
        // containers.
        groupLayers.forEach((layer) => {
          const layerName = layer.name.split(':')[1];
          // Get this layer's capability info.
          const capability = capabilities.filter((c) => c.name === layer.name);
          let title = '';
          let adminLayerControl = null;
          let hide = false;
          let extentCRS = null;
          let maxZoom = null;
          let minZoom = null;
          const style = null;
          let visible = isFinance || isCEO || !isAuthenticated;
          let isVisible = false;
          let zIndex = 0;
          let userArea = null;
          let adminLayer = null;
          let url = null;
          // params for WMS Image layers
          const params = {
            LAYERS: layerName,
            Tiled: false
          };

          if (capability && capability.length > 0) {
            [{ title, extentCRS }] = capability;
            // update layer extent from capability info
          }

          // Layer specific data
          switch (layerName.toLocaleLowerCase()) {
            //
            case 'ke_national_boundary':
              maxZoom = 7.5;
              zIndex = BOUNDARY_ZINDEX_OFFSET + groupLayers.length;
              visible = true;
              isVisible = true;
              hide = true;
              // set this layer's extent as default extent for when user
              // does not have jurisdiction area.
              nationalBoundaryExtent = extentCRS;
              break;
            case 'ke_transparent_boundary':
              // Highest z-Index
              zIndex =
                BOUNDARY_ZINDEX_OFFSET +
                MYDATA_ZINDEX_OFFSET +
                INSTALLATIONS_ZINDEX_OFFSET;
              // Always visible
              visible = true;
              isVisible = true;
              hide = true;
              // minZoom = 7.5;
              nationalBoundaryExtent = extentCRS;
              break;

            // layers whose visibility can be manually set
            case 'ke_region':
              zIndex = BOUNDARY_ZINDEX_OFFSET + groupLayers.length;
              minZoom = 0;
              maxZoom = 9;
              isVisible = showRegion;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_county':
              minZoom = 9;
              maxZoom = 10.5;
              zIndex = BOUNDARY_ZINDEX_OFFSET + groupLayers.length - 2;

              isVisible = showCounty;
              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }

              break;

            case 'ke_sub_county':
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 3);
              minZoom = 10;
              maxZoom = 11.5;
              title = 'Sub County';
              isVisible = showSubCounty;
              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;

            case 'ke_division':
              minZoom = 11;
              maxZoom = 12.5;
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 4);
              isVisible = showDivision;
              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;

            case 'ke_location':
              minZoom = 12;
              maxZoom = 13.5;
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 5);
              isVisible = showLocation;
              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;
            case 'ke_sub_location':
              minZoom = 13;
              maxZoom = 30;
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 6);
              isVisible = showSubLocation;
              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;

            default:
          }

          // get user's areas and update visibility variable
          if (isAuthenticated) {
            // Get user Area description
            if (userData.role && userData.role === roles.RM) {
              if (layerName.toLocaleLowerCase().includes('ke_region')) {
                userArea = userData.area.region;
                userArea = userArea && userArea.toLocaleLowerCase();
                const areaFilter = `strToLowerCase (REGION) like '${userArea}'`;
                url = createFilterFeatureQuery(layerName, areaFilter);

                // Update global user area object
                userAreaObject.type = 'REGION';
                userAreaObject.name = userArea;
                userAreaObject.layerName = layerName;
                userAreaObject.url = url;
                userAreaObject.areaFilter = areaFilter;
              }
            }

            if (userData?.role === roles.CM) {
              // Execute only only when layer name is county
              if (layerName.toLocaleLowerCase().includes('ke_county')) {
                userArea = userData.area?.county;
                // Nairobi region only has Nairobi County
                if (
                  userData.area?.region.toLocaleLowerCase().includes('nairobi')
                ) {
                  userArea = 'Nairobi';
                }
                userArea = userArea && userArea.toLocaleLowerCase();
                const areaFilter = `strToLowerCase (COUNTY) like '${userArea}'`;
                url = createFilterFeatureQuery(layerName, areaFilter);

                // Update user area object
                userAreaObject.type = 'COUNTY';
                userAreaObject.name = userArea;

                // set this user's county in global user area object
                userAreaObject.layerName = layerName;
                userAreaObject.url = url;
                userAreaObject.areaFilter = areaFilter;
              }
            }

            if (userData?.role === roles.FOO) {
              let county = userData.area?.county;
              const constituency = userData.area?.constituency;
              const subCounty = userData.area?.sub_county;
              const division = userData.area?.division;
              const location = userData.area?.location;
              const subLocation = userData.area?.sub_location;

              // Nairobi region only has Nairobi County
              if (
                userData.area?.region.toLocaleLowerCase().includes('nairobi')
              ) {
                county = 'Nairobi';
              }

              // set this user's county in global user object
              userAreaObject.county = county ? county.toLocaleLowerCase() : '';

              if (
                !constituency?.length &&
                !subCounty?.length &&
                !division?.length &&
                !location?.length &&
                !subLocation?.length
              ) {
                if (
                  county &&
                  layerName.toLocaleLowerCase().includes('ke_county')
                ) {
                  userArea = county;
                  userArea = userArea && userArea.toLocaleLowerCase();
                  const areaFilter = `strToLowerCase (COUNTY) like '${userArea}'`;
                  url = createFilterFeatureQuery(layerName, areaFilter);
                  userAreaObject.type = 'COUNTY';
                  userAreaObject.name = userArea;
                  userAreaObject.layerName = layerName;
                  userAreaObject.url = url;
                  userAreaObject.areaFilter = areaFilter;
                }
              }

              if (
                constituency &&
                constituency.length > 0 &&
                layerName.toLocaleLowerCase().includes('ke_constituency')
              ) {
                userArea = constituency[0];
                userArea = userArea && userArea.toLocaleLowerCase();
                const areaFilter = `strToLowerCase (CONSTITUEN) like '${userArea}'`;
                url = createFilterFeatureQuery(layerName, areaFilter);
                userAreaObject.type = 'CONSTITUEN';
                userAreaObject.name = userArea;
                userAreaObject.layerName = layerName;
                userAreaObject.url = url;
                userAreaObject.areaFilter = areaFilter;
              }

              if (
                subCounty &&
                subCounty.length > 0 &&
                layerName.toLocaleLowerCase().includes('ke_sub_county')
              ) {
                userArea = subCounty[0];
                userArea = userArea && userArea.toLocaleLowerCase();
                const areaFilter = `strToLowerCase (SUB_COUN) like '${userArea}'`;
                url = createFilterFeatureQuery(layerName, areaFilter);
                userAreaObject.type = 'SUB_COUN';
                userAreaObject.name = userArea;
                userAreaObject.layerName = layerName;
                userAreaObject.url = url;
                userAreaObject.areaFilter = areaFilter;
              }

              if (
                division &&
                division.length > 0 &&
                layerName.toLocaleLowerCase().includes('ke_division')
              ) {
                userArea = division[0];
                userArea = userArea && userArea.toLocaleLowerCase();
                const areaFilter = `strToLowerCase (DIVISION) like '${userArea}'`;
                url = createFilterFeatureQuery(layerName, areaFilter);

                userAreaObject.type = 'DIVISION';
                userAreaObject.name = userArea;
                userAreaObject.layerName = layerName;
                userAreaObject.url = url;
                userAreaObject.areaFilter = areaFilter;
              }

              if (
                location &&
                location.length > 0 &&
                layerName.toLocaleLowerCase().includes('ke_location')
              ) {
                userArea = location[0];
                userArea = userArea && userArea.toLocaleLowerCase();
                const areaFilter = `strToLowerCase (LOCATION) like '${userArea}'`;

                url = createFilterFeatureQuery(layerName, areaFilter);
                userAreaObject.type = 'LOCATION';
                userAreaObject.name = userArea;
                userAreaObject.layerName = layerName;
                userAreaObject.url = url;
                userAreaObject.areaFilter = areaFilter;
              }

              if (
                subLocation &&
                subLocation.length > 0 &&
                layerName.toLocaleLowerCase().includes('ke_sub_location')
              ) {
                userArea = subLocation[0];
                userArea = userArea && userArea.toLocaleLowerCase();
                const areaFilter = `strToLowerCase (SUB_LOCATI) like '${userArea}'`;
                url = createFilterFeatureQuery(layerName, areaFilter);

                userAreaObject.type = 'SUB_LOCATI';
                userAreaObject.name = userArea;
                userAreaObject.layerName = layerName;
                userAreaObject.url = url;
                userAreaObject.areaFilter = areaFilter;
              }
            }
          }

          adminLayer = (
            <ImageLayer
              key={helpers.getUID()}
              source={vectorSourceImageWMS({
                params
              })}
              extent={extentCRS}
              maxZoom={maxZoom}
              minZoom={minZoom}
              zIndex={zIndex}
              style={style}
              visible={visible}
              isVisible={isVisible}
              nationalBoundaryExtent={nationalBoundaryExtent}
            />
          );

          adminLayerControl = (
            <ListItem name={title} key={helpers.getUID()} hide={hide}>
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => {
                  toggleShowLayer(layerName);
                }}
              />
            </ListItem>
          );

          // collect all admin layers
          adminLayers.push(adminLayer);
          // adminLayers.push(countiesLayer);
          adminBoundaryItems.push(adminLayerControl);
        });

        const adminBoundaryLayerItems = (
          <AccordionItem title={groupTitle}>{adminBoundaryItems}</AccordionItem>
        );
        // drawerContent.push(adminBoundaryLayers);
        setAdminLayers(adminLayers);
        setAdminBoundaryContent([adminBoundaryLayerItems]);
      }

      if (groupTitle.toLocaleLowerCase().includes('installations')) {
        /* ================================ Installations ====================================== */
        const installationItems = [];
        const installationLayers = [];

        let zIndex = INSTALLATIONS_ZINDEX_OFFSET;

        groupLayers.forEach((layer, index) => {
          const layerName = layer.name.split(':')[1];
          const capability = capabilities.filter((c) => c.name === layer.name);

          // Url for all features
          let url = createGetFeatureQuery(layerName);
          // url for area specific features
          if (userAreaObject.name) {
            const areaName = userAreaObject.name.substring(0, 6);
            let areaType = `${userAreaObject.type}_1`;
            if (
              userAreaObject.type.toLocaleLowerCase().includes('sub_') ||
              userAreaObject.type.toLocaleLowerCase().includes('constituen')
            ) {
              areaType = userAreaObject.type;
            }
            url = createFilterFeatureQuery(
              layerName,
              `strToLowerCase (${areaType}) like '${areaName}%'`
            );
            url = encodeURI(url);
          }

          let installationLayer = null;
          // input checkbox variable
          let title = '';
          // layer variables
          let extentCRS = null;
          let style = null;
          let minZoom = null;
          const minResolution = null;
          const maxResolution = null;
          let visible = false;
          let isVisible = false;
          let hide = false;
          zIndex = zIndex + index;
          let iconSrc = '';

          if (capability && capability.length > 0) {
            [{ title, extentCRS }] = capability;
          }

          // layer Visibility toggle
          switch (layerName.toLocaleLowerCase()) {
            // Roads - set to visible to true on show road
            case 'ke_class_a_road':
              //   setShowRoadClassA(!showRoadClassA);
              isVisible = showRoadClassA;
              minZoom = 8;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_class_b_road':
              //   setShowRoadClassB(!showRoadClassB);
              isVisible = showRoadClassB;
              minZoom = 8;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_class_c_road':
              isVisible = showRoadClassC;
              minZoom = 9;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_class_d_road':
              isVisible = showRoadClassD;
              minZoom = 10;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_forest_station':
              isVisible = showForestStation;
              minZoom = 10;
              iconSrc = icons.forestStation;
              style = styles.ForestStation;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_nps':
              style = styles.Police;
              isVisible = showNPS;
              minZoom = 14.5;
              iconSrc = icons.police;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_ngao':
              style = styles.Admin;
              isVisible = showNgao;
              minZoom = 13.5;
              iconSrc = icons.admin;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_institute_of_technology':
              isVisible = showInstituteOfTechnology;
              style = styles.InstituteOfTechnology;
              minZoom = 10;
              iconSrc = icons.instituteOfTechnology;
              if (isVisible) {
                minZoom = null;
              }
              break;
            //
            case 'ke_gazetted_forest':
              isVisible = showForest;
              style = styles.forestStyleFunction;
              hide = true;
              minZoom = 11;
              iconSrc = icons.forestStation;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_safaricom_bts':
              style = styles.BTS;
              isVisible = showSafaricomBTS;
              minZoom = 16;
              iconSrc = icons.bTS;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_telkom_bts':
              style = styles.BTS;
              isVisible = showTelkomBTS;
              minZoom = 14;
              iconSrc = icons.bTS;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_polytechnic':
              style = styles.Polytechnic;
              isVisible = showPolytechnic;
              iconSrc = icons.polytechnic;
              minZoom = 12;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_power_station':
              isVisible = showPowerStation;
              style = styles.PowerStation;
              iconSrc = icons.powerStation;
              minZoom = 12;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_primary_schools':
              isVisible = showPrimarySchool;
              style = styles.PrimarySchool;
              minZoom = 14.5;
              iconSrc = icons.primarySchool;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_secondary_school':
              style = styles.SecondarySchool;
              isVisible = showSecondarySchool;
              minZoom = 12;
              iconSrc = icons.secondarySchool;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_health_facility':
              style = styles.HospitalPoint;
              isVisible = showHealthCentres;
              minZoom = 13.5;
              iconSrc = icons.hospital;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_town_other':
              isVisible = showTownOther;
              minZoom = 13.5;
              hide = true;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_town_disthq':
              isVisible = showTownDist;
              minZoom = 13.5;
              hide = true;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_town_divhq':
              isVisible = showTownDiv;
              minZoom = 13.5;
              hide = true;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_town_regionhq':
              isVisible = showTownRegion;
              minZoom = 13.5;
              hide = true;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_university':
              style = styles.University;
              isVisible = showUniversity;
              minZoom = 9;
              iconSrc = icons.university;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_lakes':
              isVisible = showLakes;
              minZoom = 9;
              hide = true;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_teachers_training_college':
              style = styles.TTC;
              isVisible = showKTTC;
              minZoom = 10;
              iconSrc = icons.ttc;
              if (isVisible) {
                minZoom = null;
              }
              break;
            default:
          }

          // If un-authenticated, the following should be automatically visible
          // Update visible and minZoom fields for this special case only
          if (!isAuthenticated) {
            visible =
              layerName.toLocaleLowerCase().includes('ke_gazetted_forest') ||
              layerName.toLocaleLowerCase().includes('ke_class_a_road') ||
              layerName.toLocaleLowerCase().includes('ke_class_b_road') ||
              layerName.toLocaleLowerCase().includes('ke_lakes') ||
              layerName.toLocaleLowerCase().includes('ke_town_regionhq');
            if (visible) {
              minZoom = null;
            }
          }

          // Enable Finance and CEO and un-auth users to view all installations based on zoom level
          isVisible = isVisible || isFinance || isCEO || !isAuthenticated;

          /* =============== Create installation layers =================== */
          // Load towns as WMS layer
          if (
            layerName.toLocaleLowerCase().includes('town') ||
            layerName.toLocaleLowerCase().includes('lakes') ||
            layerName.toLocaleLowerCase().includes('road')
          ) {
            const opacity = layerName.toLocaleLowerCase().includes('road')
              ? 0.5
              : null;
            const params = {
              LAYERS: layerName,
              Tiled: true
            };
            // Filter data for this area only
            // if (userAreaObject.name) {
            //   let areaName = userAreaObject.name.substring(0, 6);
            //   let filterString = `strToLowerCase (${userAreaObject.type}) like '${areaName}%'`;
            //   params.CQL_FILTER = filterString;
            // }

            if (userAreaObject?.name) {
              const areaName = userAreaObject.name.substring(0, 6);
              let areaType = `${userAreaObject.type}_1`;
              if (
                userAreaObject.type.toLocaleLowerCase().includes('sub_') ||
                userAreaObject.type.toLocaleLowerCase().includes('constituen')
              ) {
                areaType = userAreaObject.type;
              }
              const filterString = `strToLowerCase (${areaType}) like '${areaName}%'`;
              params.CQL_FILTER = filterString;
            }

            installationLayer = (
              <TileLayer
                key={helpers.getUID()}
                source={vectorSourceWMS({
                  params
                })}
                extent={extentCRS}
                minZoom={minZoom}
                minResolution={minResolution}
                maxResolution={maxResolution}
                visible={visible}
                isVisible={isVisible}
                zIndex={zIndex}
                style={style}
                opacity={opacity}
              />
            );
          } else {
            // load everything else as vector layer
            installationLayer = (
              <VectorLayer
                key={helpers.getUID()}
                source={vectorGeoJson({
                  url
                })}
                extent={extentCRS}
                style={style}
                minZoom={minZoom}
                minResolution={minResolution}
                maxResolution={maxResolution}
                zIndex={zIndex}
                visible={visible}
                isVisible={isVisible}
              />
            );
          }

          let installationItem = null;

          if (
            ![
              'ke_class_a_road',
              'ke_class_b_road',
              'ke_class_c_road',
              'ke_class_d_road'
            ].includes(layerName.toLocaleLowerCase()) // Remove these from the side bar
          ) {
            // check box input item to control visibility of associated layer
            installationItem = (
              <ListItem
                name={title}
                hide={hide}
                icon={
                  <div
                    style={{
                      fontSize: '0.8em',
                      width: '1.2rem',
                      display: 'inline-box'
                    }}
                  >
                    {iconSrc && (
                      <img
                        src={iconSrc}
                        alt="check box icon"
                        style={{ width: '100%' }}
                      />
                    )}
                  </div>
                }
              >
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => {
                    toggleShowLayer(layerName);
                  }}
                />
              </ListItem>
            );
          }

          // Update installation layer list with this layer
          installationLayers.push(installationLayer);
          // Layer UI control: Update installation checkbox input items with checkbox for this layer
          installationItems.push(installationItem);
        });

        const installationLayerItems = (
          <AccordionItem title={groupTitle}>{installationItems}</AccordionItem>
        );

        setInstallationLayers(installationLayers);
        setInstallationContent([installationLayerItems]);
      }

      if (groupTitle.toLocaleLowerCase().includes('my data')) {
        /* ================================ Installations ====================================== */
        const myDataItems = [];
        const myDataLayers = [];

        let jurisdictionURL = '';
        if (userAreaObject.name) {
          jurisdictionURL = userAreaObject.url;
          setJurisdictionURL(jurisdictionURL);
          // get layername of jurisdiction
          // get cql filter for the jurisdiction
          // set is tiled to true
        }

        groupLayers.forEach((layer, index) => {
          const layerName = layer.name.split(':')[1];

          const capability = capabilities.filter((c) => c.name === layer.name);
          let url = createGetFeatureQuery(layerName);

          //
          let title = '';
          let extentCRS = null;
          let visible = false;
          let isVisible = false;
          let myDataLayer = null;
          let style = null;
          let minZoom = null;
          let maxZoom = null;
          let zIndex = 0;
          let hide = !userAreaObject?.name;

          // params for WMS Image layers
          const params = {
            LAYERS: layerName,
            Tiled: false
          };

          if (capability && capability.length > 0) {
            [{ title, extentCRS }] = capability;
          }

          switch (layerName.toLocaleLowerCase()) {
            case 'incidence_incident':
              isVisible = showIncident;
              style = styles.generalStyle;
              minZoom = 8;
              if (isVisible) {
                minZoom = null;
              }
              break;

            case 'threat_threat':
              isVisible = showThreat;
              style = styles.arrowStyleFunction;
              minZoom = 8;
              title = 'Threats';
              if (isVisible) {
                minZoom = null;
              }

              // filter by rm's region
              if (isRegionalManager(userData?.role)) {
                url = createFilterFeatureQuery(
                  layerName,
                  `strToLowerCase (to_region) like '${userAreaObject?.name}' or strToLowerCase (from_region) like '${userAreaObject?.name}'`
                );
              }

              // filter by cm's county
              if (isCountyManager(userData?.role)) {
                url = createFilterFeatureQuery(
                  layerName,
                  `strToLowerCase (destination) like '${userAreaObject?.name}' or strToLowerCase (origin) like '${userAreaObject?.name}'`
                );
              }

              // filter by foo's county
              if (isFieldOfficer(userData?.role)) {
                url = createFilterFeatureQuery(
                  layerName,
                  `strToLowerCase (destination) like '${userAreaObject?.county}' or strToLowerCase (origin) like '${userAreaObject?.county}'`
                );
              }

              break;
            case 'projects_project':
              isVisible = showProject;
              title = 'Projects';
              // projectSource = new VectorSource();

              /**
               * User Specific boundary
               */
              // layers whose visibility can be manually set
              break;
            case 'ke_region':
              zIndex = BOUNDARY_ZINDEX_OFFSET + groupLayers.length;
              minZoom = 0;
              maxZoom = 9;
              isVisible = showUserRegion;
              hide = isRM || isCM || isFOO || hide;
              if (isVisible) {
                minZoom = null;
              }
              break;
            case 'ke_county':
              minZoom = 9;
              maxZoom = 10.5;
              zIndex = BOUNDARY_ZINDEX_OFFSET + groupLayers.length - 2;
              hide = isCM || hide;

              isVisible = showUserCounty;
              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }

              break;

            case 'ke_constituency':
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 3);
              minZoom = 10;
              maxZoom = 11.5;
              title = 'Sub County';
              hide = true;
              isVisible = showConstituency;
              if (isVisible) {
                minZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;

            case 'ke_sub_county':
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 3);
              minZoom = 10;
              maxZoom = 11.5;
              isVisible = showUserSubCounty;

              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;

            case 'ke_division':
              minZoom = 11;
              maxZoom = 12.5;
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 4);
              isVisible = showUserDivision;

              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;

            case 'ke_location':
              minZoom = 12;
              maxZoom = 13.5;
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 5);
              isVisible = showUserLocation;

              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;
            case 'ke_sub_location':
              minZoom = 13;
              maxZoom = 30;
              zIndex = BOUNDARY_ZINDEX_OFFSET + (groupLayers.length - 6);
              isVisible = showUserSubLocation;
              if (isVisible) {
                minZoom = null;
                maxZoom = null;
                zIndex = MYDATA_ZINDEX_OFFSET;
                visible = true;
              }
              break;

            default:
          }

          if (isAuthenticated) {
            if (userAreaObject.name) {
              const areaName = userAreaObject.name.substring(0, 6);
              let areaType = `${userAreaObject.type}_1`;
              if (
                userAreaObject.type.toLocaleLowerCase().includes('sub_') ||
                userAreaObject.type.toLocaleLowerCase().includes('constituen')
              ) {
                areaType = userAreaObject.type;
              }
              const filterString = `strToLowerCase (${areaType}) like '${areaName}%'`;
              // For getting layers specific to this user's area
              params.CQL_FILTER = filterString;
            }

            // If the layer is not a project layer, proceed
            if (!layerName.toLocaleLowerCase().includes('project')) {
              // If non-boundary layer: threat, incident
              if (layerName.toLocaleLowerCase().includes('threat')) {
                // Load threats as a vector layer - to add my own custom styling
                myDataLayer = (
                  <VectorLayer
                    key={helpers.getUID()}
                    source={vectorGeoJson({
                      url
                    })}
                    extent={extentCRS}
                    visible={isVisible}
                    style={style}
                    minZoom={minZoom}
                    zIndex={MYDATA_ZINDEX_OFFSET + index}
                  />
                );
              } else {
                // Filter rest of layers to be specific to this user's area
                params.CQL_FILTER = userAreaObject.areaFilter;
                myDataLayer = (
                  <ImageLayer
                    key={helpers.getUID()}
                    source={vectorSourceImageWMS({
                      params
                    })}
                    extent={extentCRS}
                    maxZoom={maxZoom}
                    minZoom={minZoom}
                    zIndex={zIndex}
                    visible={visible}
                    isVisible={isVisible}
                  />
                );
              }
            }
          }

          // Data Item control layer
          let myDataItem = null;
          if (layerName.toLocaleLowerCase().includes('project')) {
            // =============== Project Layer Control Section =============

            myDataItem = (
              <div>
                <ListItem name={`${title}`} key={helpers.getUID()}>
                  <div>
                    <input
                      type="checkbox"
                      checked={showProject}
                      onChange={() => {
                        toggleShowLayer(layerName);
                      }}
                    />
                  </div>
                </ListItem>
                <div className={classes.legendContainer}>
                  {themes.map((theme) => (
                    <ListItem name={theme.name} key={helpers.getUID()}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div
                          className={classes.circle}
                          style={{
                            marginLeft: '1em',
                            backgroundColor: `${theme.color}`
                          }}
                        />
                      </div>
                    </ListItem>
                  ))}
                </div>
              </div>
            );
          } else if (layerName.toLocaleLowerCase().includes('threat')) {
            myDataItem = (
              <ListItem name={title} key={helpers.getUID()}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => {
                    toggleShowLayer(layerName);
                  }}
                />
              </ListItem>
            );
          } else {
            // show areas within a users region iff they have a jurisdiction area
            myDataItem = (
              <ListItem name={title} key={helpers.getUID()} hide={hide}>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => {
                    toggleShowUserLayer(layerName);
                  }}
                />
              </ListItem>
            );
          }

          myDataLayers.push(myDataLayer);
          myDataItems.push(myDataItem);
        });

        const jurisdictionLayerControl = (
          <ListItem name="Jurisdiction Area" key={helpers.getUID()}>
            <input
              type="checkbox"
              checked={showJurisdiction}
              onChange={() => {
                toggleShowLayer('jurisdiction');
              }}
            />
          </ListItem>
        );

        if (userAreaObject.name) {
          myDataItems.push(jurisdictionLayerControl);
        }

        // ===== End of Jurisdiction Area =====

        const myDataLayerItems = (
          <AccordionItem title={groupTitle}>{myDataItems}</AccordionItem>
        );
        setMyDataLayers(myDataLayers);
        setMyDataContent([myDataLayerItems]);
      }
    });
  }, [
    layers,
    isAuthenticated,
    user,
    // fieldOfficer,
    capabilities,
    // Installations
    showForestStation,
    showUniversity,
    showRoadClassA,
    showRoadClassB,
    showRoadClassC,
    showRoadClassD,
    showNPS,
    showNgao,
    showInstituteOfTechnology,
    showHealthCentres,
    showPowerStation,
    showPrimarySchool,
    showSecondarySchool,
    showTownOther,
    showTownRegion,
    showTownDist,
    showTownDiv,
    showLakes,
    showForest,
    showTelkomBTS,
    showSafaricomBTS,
    showPolytechnic,
    showKTTC,
    // Boundaries
    showRegion,
    showCounty,
    showConstituency,
    showSubCounty,
    showDivision,
    showLocation,
    showSubLocation,
    showBoundary,
    showTransparentBoundary,
    showJurisdiction,
    // My Data'
    // showIncident,
    showThreat,
    showProject,
    // User Boundaries
    showUserRegion,
    showUserCounty,
    // showUserConstituency,
    showUserSubCounty,
    showUserDivision,
    showUserLocation,
    showUserSubLocation
  ]);

  // Content to populate RHS side drawer on map
  const drawerContent = [
    ...adminBoundaryContent,
    ...installationContent,
    ...myDataContent
  ];

  // Layers to be displayed on map
  const mapLayers = [
    ...adminLayers,
    ...installationLayers,
    ...myDataLayers,
    jurisdictionLayer
  ];

  return (
    <div className={classes.container} id="map-theme">
      <div id="control-items" style={{ position: 'absolute' }}>
        {/** Map Controls. Check the <Controls></Controls> wrapper */}
        <Controls>{controls}</Controls>
        {/** zoom, zoom to user area , search. */}
        <Navigation />
      </div>

      {/** Map Layers -  not shown on UI, layers get added to global 'map'
        object when this component mounts Logic in <layers></layers> wrapper
        */}
      <Layers>{mapLayers}</Layers>

      {/** Map Interactions -  interactions get added to global 'map'
      object when this component mounts
      */}
      <Interactions>{interactions}</Interactions>

      <SideDrawer>
        {/** Layers Section - components for controling layer visibility  */}
        {isAuthenticated && (
          <List>
            <AccordionItem title="Layers">
              <Divider
                component="li"
                style={{ backgroundColor: 'rgb(238,238,238)' }}
              />
              <div className={classes.innerContent}>{drawerContent}</div>
            </AccordionItem>
          </List>
        )}

        {/** Threats Section - components for adding threats.
          Only a county manager can add threats.
        */}
        {isAuthenticated && isCountyManager(userData.role) && (
          <AccordionItem title="Threats">
            <Divider
              component="li"
              style={{ backgroundColor: 'rgb(238,238,238)' }}
            />
            <div className={classes.innerContent}>
              <AccordionItem title="Add Threat">
                <div className={classes.buttonBar}>
                  {/** Arrow */}
                  <Tooltip title="Add Threat" placement="right">
                    <div
                      className={clsx(
                        classes.buttonContainer,
                        activeButton === 'arrow' ? classes.buttonActive : null
                      )}
                    >
                      <button
                        className={classes.button}
                        onClick={() => {
                          setDrawType('Arrow');
                          setActiveButton('arrow');
                        }}
                      >
                        <img src={arrowIcon} alt="arrow icon" />
                      </button>
                    </div>
                  </Tooltip>

                  {/** Cancel draw */}
                  <Tooltip title="Cancel draw" placement="right">
                    <div
                      className={clsx(
                        classes.buttonContainer,
                        activeButton === 'none' ? classes.buttonActive : null
                      )}
                    >
                      <button
                        className={classes.button}
                        onClick={() => {
                          setDrawType('None');
                          setActiveButton('none');
                        }}
                      >
                        <img src={noneIcon} alt="cancel icon" />
                      </button>
                    </div>
                  </Tooltip>
                </div>
              </AccordionItem>
            </div>
          </AccordionItem>
        )}

        {/** Projects Section - components for adding projects.
          only a finance officer can add projects
        */}
        {isAuthenticated && isFinanceOfficer(userData.role) && (
          <AccordionItem title="Projects">
            <Divider
              component="li"
              style={{ backgroundColor: 'rgb(238,238,238)' }}
            />
            <div className={classes.innerContent}>
              <AccordionItem title="Add Project">
                <div className={classes.buttonBar}>
                  {/** Point */}

                  <Tooltip title="Add Project" placement="right">
                    <div
                      className={clsx(
                        classes.buttonContainer,
                        activeButton === 'point' ? classes.buttonActive : null
                      )}
                    >
                      <button
                        className={classes.button}
                        onClick={() => {
                          setDrawType('Point');
                          setActiveButton('point');
                        }}
                      >
                        <img src={pointIcon} alt="Point icon" />
                      </button>
                    </div>
                  </Tooltip>

                  {/** Cancel draw */}
                  <Tooltip title="Cancel draw" placement="right">
                    <div
                      className={clsx(
                        classes.buttonContainer,
                        activeButton === 'none' ? classes.buttonActive : null
                      )}
                    >
                      <button
                        className={classes.button}
                        onClick={() => {
                          setDrawType('None');
                          setActiveButton('none');
                        }}
                      >
                        <img src={noneIcon} alt="Cancel icon" />
                      </button>
                    </div>
                  </Tooltip>
                </div>
              </AccordionItem>
            </div>
          </AccordionItem>
        )}

        {/** Tools Section - Measurement, print, coordinates, add data */}
        <AccordionItem title="Tools">
          <Divider
            component="li"
            style={{ backgroundColor: 'rgb(238,238,238)' }}
          />
          <div className={classes.innerContent}>
            <AccordionItem title="Measure">
              <div className={classes.buttonBar}>
                {/** LineString */}
                <Tooltip title="Measure Line" placement="right">
                  <div
                    className={clsx(
                      classes.buttonContainer,
                      activeButton === 'linestring'
                        ? classes.buttonActive
                        : null
                    )}
                  >
                    <button
                      className={classes.button}
                      onClick={() => {
                        setMeasureType('LineString');
                        setActiveButton('linestring');
                      }}
                    >
                      <img src={polyLineIcon} alt="line icon" />
                    </button>
                  </div>
                </Tooltip>

                {/** Area */}
                <Tooltip title="Measure Area" placement="right">
                  <div
                    className={clsx(
                      classes.buttonContainer,
                      activeButton === 'area' ? classes.buttonActive : null
                    )}
                  >
                    <button
                      className={classes.button}
                      onClick={() => {
                        setMeasureType('Area');
                        setActiveButton('area');
                      }}
                    >
                      <img src={polygonIcon} alt="polygon icon" />
                    </button>
                  </div>
                </Tooltip>

                {/** Cancel */}
                <Tooltip title="Cancel Measure" placement="right">
                  <div
                    className={clsx(
                      classes.buttonContainer,
                      activeButton === 'cancel' ? classes.buttonActive : null
                    )}
                  >
                    <button
                      className={classes.button}
                      onClick={() => {
                        setMeasureType('None');
                        setActiveButton('cancel');
                      }}
                    >
                      <img src={noneIcon} alt="cancel icon" />
                    </button>
                  </div>
                </Tooltip>
              </div>
            </AccordionItem>
          </div>
        </AccordionItem>
      </SideDrawer>
    </div>
  );
};

export default NgeoMap;
