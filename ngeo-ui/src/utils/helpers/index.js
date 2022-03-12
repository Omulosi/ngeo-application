import React from 'react';
/* eslint-disable */
import { QueryClient, QueryClientProvider } from 'react-query';
import { GeoJSON } from 'ol/format';
import { transform } from 'ol/proj';
import { fromLonLat } from 'ol/proj';
import shortid from 'shortid';
import mainConfig from 'src/config/config.json';

// POPUP STYLES
import AccordionItem from './PopupAccordion';
import {
  capitalize,
  Divider,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Tooltip
} from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { useProject } from 'src/fetch/projects';

const queryClient = new QueryClient();

export function getConfigValue(key) {
  const config = mainConfig;
  return config[key];
}

// MOBILE VIEW
export function isMobile() {
  if (window.innerWidth < 770) return true;
  else return false;
}

export function zoomToFeature(feature, animate = true) {
  let geom = feature.getGeometry();
  let duration = animate ? 1000 : 0;
  let minResolution = scaleToResolution(feature.minScale);
  minResolution = minResolution > 1 ? Math.ceil(minResolution) : 1;
  if (geom.getType() === 'Point') {
    window.map
      .getView()
      .fit(geom, { duration: duration, minResolution: minResolution });
  } else if (geom.getType() === 'GeometryCollection') {
    window.map.getView().fit(geom.getGeometries()[0], {
      duration: duration,
      minResolution: minResolution
    });
  } else {
    window.map
      .getView()
      .fit(geom, { duration: duration, minResolution: minResolution });
  }
}

// URL FRIENDLY STRING ID
export function getUID() {
  return shortid.generate();
}

// GET FEATURE FROM GEOJSON
export function getFeatureFromGeoJSON(geoJSON) {
  return new GeoJSON().readFeature(geoJSON);
}

export function saveToStorage(storageKey, item) {
  localStorage.setItem(storageKey, JSON.stringify(item));
}

export function appendToStorage(storageKey, item, limit = undefined) {
  let items = getItemsFromStorage(storageKey);
  if (items === undefined) items = [];
  item.dateAdded = new Date().toLocaleString();
  items.unshift(item);
  if (limit !== undefined) {
    if (items.length >= limit) items.pop();
  }

  localStorage.setItem(storageKey, JSON.stringify(items));
}

export function getItemsFromStorage(key) {
  const storage = localStorage.getItem(key);
  if (storage === null) return undefined;

  const data = JSON.parse(storage);
  return data;
}

export function featureToGeoJson(feature) {
  return new GeoJSON({
    dataProjection: 'EPSG:3857',
    featureProjection: 'EPSG:3857'
  }).writeFeature(feature, {
    dataProjection: 'EPSG:3857',
    featureProjection: 'EPSG:3857'
  });
}

export function toLatLongFromWebMercator(coords) {
  //coords: array
  return transform(coords, 'EPSG:3857', 'EPSG:4326');
}

export function toWebMercatorFromLatLong(coords) {
  return fromLonLat(coords);
  //return transform(coords, "EPSG:4326", "EPSG:3857");
}

export function getGeoJSONFromGeometry(geometry) {
  const parser = new GeoJSON();
  return parser.writeGeometry(geometry);
}

export function getGeometryFromGeoJSON(geometry) {
  const parser = new GeoJSON();
  return parser.readGeometry(geometry);
}

export function showFeaturePopup(coord, feature, navigate) {
  window.popup.show(
    coord,
    <QueryClientProvider client={queryClient}>
      <FeaturePopupContent feature={feature} navigate={navigate} />
    </QueryClientProvider>
  );
}

function FeaturePopupContent(props) {
  const { navigate, feature } = props;

  let projectDetail = null;
  let ftProperties = feature.getProperties();
  let properties = {};

  // convert all keys to lower case
  Object.keys(ftProperties).forEach((key) => {
    if (key.toLocaleLowerCase() === 'name') {
      // Convert all 'name' keys to lower case
      // Makes it easier to extract the name field later
      properties['name'] = ftProperties[key];
    } else {
      properties[key] = ftProperties[key];
    }
  });

  let startInfo = { name: '' };

  if (properties.name) {
    startInfo.value = properties.name;
    delete properties.name;
  }

  let id = null;
  id = feature.getId();
  if (id && isNaN(id)) {
    id = id.split('.')[1];
  }

  // let { data, isLoading, error, isSuccess }
  let resObj = null;
  let isSuccess = false;
  let data = null;

  resObj = useProject(id);

  if (resObj && properties.theme) {
    data = resObj.data;
    isSuccess = resObj.isSuccess;
  }

  if (isSuccess) {
    projectDetail = data.attributes;
  }

  if (projectDetail && properties.county_manager_id) {
    properties['County Manager'] =
      projectDetail.county_manager.user.staff_number;
  }

  if (projectDetail && properties.field_officer_id) {
    properties['Field Officer'] = projectDetail.field_officer.user.staff_number;
  }

  if (projectDetail && properties.theme) {
    properties['Agents'] = projectDetail.agent
      .map((ag) => ag.id_number)
      .join(',');

    // Get theme name instead of ID

    properties['theme'] = properties.theme;
  }

  if (projectDetail && properties.area_id) {
    properties['County'] = projectDetail.area && projectDetail.area.county;
  }

  let excludeFields = [
    'latitude',
    'longitude',
    'description',
    'date_added',
    'area_id',
    'county_manager_id',
    'field_officer_id',
    'County Manager',
    'Field Officer',
    'Agents',
    'geometry',
    // Project fields
    'agent',
    'terms',
    'area', // complex object, won't display
    'initiated_by',
    'agent_status'
  ];

  let includeFields = ['name', 'theme', 'county', 'region', 'initiated_by'];

  let resourceName = null;
  let resourceId = null;

  if (projectDetail) {
    resourceName = 'projects';
    resourceId = id;
  }

  if (
    typeof feature.getId() === 'string' &&
    feature.getId().includes('threat')
  ) {
    resourceName = 'threats';
    resourceId = id;
  }

  return (
    <div className="sc-live-layer-popup-content">
      <List>
        <ListItem
          button
          component="a"
          key={getUID()}
          onClick={(e) => {
            if (resourceName) {
              return navigate(`/app/${resourceName}/${resourceId}`, {
                replace: true
              });
            }
          }}
        >
          <ListItemText
            primary="Name"
            secondary={startInfo.value}
            secondaryTypographyProps={{
              style: { color: '#0073e6', textDecoration: 'underline' }
            }}
          />
        </ListItem>
        <Divider />
        <AccordionItem title={'More Info'}>
          {Object.entries(properties).map((row) => {
            // ignore geometry field or any field starting with underscore
            if (
              row[0] !== 'geometry' &&
              row[0].substring(0, 1) !== '_' &&
              !row[0].includes('_') &&
              includeFields.includes(row[0])
            ) {
              // return <div>{row[1]}</div>;
              return (
                <ListItem key={getUID()}>
                  <ListItemText
                    primary={`${capitalize(row[0])}`}
                    secondary={row[1]}
                  />
                </ListItem>
              );
            }
            {
              /**   */
            }
            if (row[0].includes('County Manager')) {
              return (
                <ListItem
                  key={getUID()}
                  onClick={() =>
                    navigate(`/app/county_managers`, { replace: true })
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <Tooltip
                    title="Click to view county managers"
                    placement="right"
                  >
                    <ListItemText
                      primary={`${capitalize(row[0])}`}
                      secondary={`Staff No: ${row[1]}  `}
                    />
                  </Tooltip>
                </ListItem>
              );
            }

            if (row[0].includes('Field Officer')) {
              return (
                <ListItem
                  key={getUID()}
                  onClick={() =>
                    navigate(`/app/field_officers`, { replace: true })
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <Tooltip
                    title="Click to view field officers"
                    placement="right"
                  >
                    <ListItemText
                      primary={`${capitalize(row[0])}`}
                      secondary={`Staff No: ${row[1]}  `}
                    />
                  </Tooltip>
                </ListItem>
              );
            }

            if (row[0].includes('Agents')) {
              return (
                <ListItem
                  key={getUID()}
                  onClick={() => navigate(`/app/agents`, { replace: true })}
                  style={{ cursor: 'pointer' }}
                >
                  <Tooltip title="Click to view agents" placement="right">
                    <ListItemText
                      primary={`${capitalize(row[0])}`}
                      secondary={`Staff No's: ${row[1]}  `}
                    />
                  </Tooltip>
                </ListItem>
              );
            } else return null;
          })}
          <Divider />
          <ListItem
            button
            key={getUID()}
            onClick={() => {
              zoomToFeature(feature);
            }}
          >
            <ListItemIcon>
              <ZoomInIcon />
            </ListItemIcon>
          </ListItem>
        </AccordionItem>
      </List>
    </div>
  );
}
