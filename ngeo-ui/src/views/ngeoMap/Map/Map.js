/* eslint-disable */
import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as ol from 'ol';
import Popup from 'src/utils/helpers/Popup';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { XYZ } from 'ol/source';
import Feature from 'ol/Feature';
import { fromLonLat, toLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import * as helpers from 'src/utils/helpers';
import FloatingMenu, { FloatingMenuItem } from 'src/utils/helpers/FloatingMenu';
import { Item as MenuItem } from 'rc-menu';
import { useNavigate } from 'react-router-dom';
import Portal from 'src/utils/helpers/Portal';
import { ENVIRONMENT, BACKEND_HOST } from 'src/config';
import mainConfig from 'src/config/config.json';
import MapContext from './MapContext';
import MapStatus from 'src/components/MapStatus';
import capitalize from 'src/utils/capitalize';
import styles from '../geoStyles';
import AddMarkerDialog from 'src/components/AddMarkerDialog';
import './Map.css';
// CSS overrides for default open layer styles
import './olOverrides.css';

const MapProvider = ({ children }) => {
  const mapRef = useRef();
  const [mapObject, setMap] = useState(null);
  const [pointerCoordinates, setPointerCoordinates] = useState({
    longitude: '',
    latitude: ''
  });
  const [polygonInfo, setPolygonInfo] = React.useState(null);
  /* add marker variables */
  const [open, setOpen] = React.useState(false);
  const [coordinates, setCoordinates] = React.useState('');
  const [type, setMarkerType] = React.useState('');

  const { centerCoords, defaultZoom: zoom, maxZoom, mapserverUrl } = mainConfig;
  const navigate = useNavigate();

  // Covert to web mercator dimensions from  degrees
  const center = fromLonLat(centerCoords);

  // coordinate for currently clicked element
  let contextCoords = null;

  const handleOpenAddMarkerDialog = () => {
    setOpen(true);
  };

  const handleCloseAddMarkerDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    const source = {
      dev: new OSM(),
      prod: new XYZ({
        url: `${mapserverUrl}styles/osm-bright/{z}/{x}/{y}.png`
      })
    };

    const options = {
      view: new ol.View({
        zoom,
        center,
        maxZoom
        // projection: 'EPSG:3857'
      }),
      layers: [
        new TileLayer({
          source: source[ENVIRONMENT]
        })
      ],
      controls: [],
      overlays: []
    };

    /* Create map and update variables that pass it on, using context api */
    const map = new ol.Map(options);
    map.setTarget(mapRef.current);
    setMap(map);

    /* Add popup overaly to the map. */
    const popup = new Popup();
    map.addOverlay(popup);

    /* Set global objects to be accessed outside of react component tree e.g. in helpers module */
    window.map = map;
    window.popup = popup;

    /**
     * Call backs for handling right click context menu
     */
    const addMyMaps = () => {
      const marker = new Feature(new Point(contextCoords));
      const [lon, lat] = helpers.toLatLongFromWebMercator(contextCoords);

      setCoordinates([lon, lat]);
      setMarkerType('Point');
      handleOpenAddMarkerDialog();

      // window.emitter.emit('addMarker', marker, [lon, lat], 'Point');
    };

    const onMenuItemClick = (key) => {
      switch (key) {
        case 'sc-floating-menu-add-mymaps':
          addMyMaps();
          break;
        case 'sc-floating-menu-basic-mode':
          break;
        default:
          break;
      }
    };
    /* End of call backs */

    /**
     * This section adds behaviors to the map using
     * Event listeners
     */

    /**
     * Custom right click context menu: provides a way to dynamically add markers to map.
     * Listens for contextmenu event that's emitted on right click.
     *  */
    map.getViewport().addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
      contextCoords = map.getEventCoordinate(evt);

      const menu = (
        <Portal>
          <FloatingMenu
            key={helpers.getUID()}
            buttonEvent={evt}
            onMenuItemClick={onMenuItemClick}
            autoY
            autoX
          >
            <MenuItem
              className={
                mainConfig.rightClickMenuVisibility[
                  'sc-floating-menu-add-mymaps'
                ]
                  ? 'sc-floating-menu-toolbox-menu-item'
                  : 'sc-hidden'
              }
              key="sc-floating-menu-add-mymaps"
            >
              <FloatingMenuItem imageName="point.png" label="Add Marker" />
            </MenuItem>

            <MenuItem
              className={
                mainConfig.rightClickMenuVisibility[
                  'sc-floating-menu-save-map-extent'
                ]
                  ? 'sc-floating-menu-toolbox-menu-item'
                  : 'sc-hidden'
              }
              key="sc-floating-menu-save-map-extent"
            >
              <FloatingMenuItem
                imageName="globe-icon.png"
                label="Save as Default Extent"
              />
            </MenuItem>
            {/** Show details of a particular feature on layers side bar */}
            <MenuItem
              className={
                mainConfig.rightClickMenuVisibility['sc-floating-menu-identify']
                  ? 'sc-floating-menu-toolbox-menu-item'
                  : 'sc-hidden'
              }
              key="sc-floating-menu-identify"
            >
              <FloatingMenuItem imageName="identify.png" label="Identify" />
            </MenuItem>
          </FloatingMenu>
        </Portal>
      );
      ReactDOM.render(menu, document.getElementById('portal-root'));
    });

    map.once('rendercomplete', () => {
      window.emitter.emit('mapLoaded', map);
    });

    /**
     * Listen for pointer move events and show coordinates at pointer location
     * Listen for hover over multi-polygon areas
     */
    let featureAtPixel = null; // feature currently being hovered over
    map.on('pointermove', (e) => {
      const [longitude, latitude] = toLonLat(e.coordinate).map((c) =>
        c.toFixed(4)
      );
      setPointerCoordinates({ longitude, latitude });

      /* Hover event */
      // Ensure no previous feature, clear everything and start on clean slate
      if (featureAtPixel !== null) {
        featureAtPixel.setStyle(undefined);
        featureAtPixel = null;
      }

      map.forEachFeatureAtPixel(e.pixel, function (f) {
        featureAtPixel = f;
        // Only highlight multi-polygon areas
        if (f && f.getGeometry().getType() === 'MultiPolygon') {
          f.setStyle(styles.highlightAreaFunction);
        }

        return true;
      });

      if (featureAtPixel) {
        // Get properties of selected feature
        let region = featureAtPixel.get('REGION');
        let county = featureAtPixel.get('COUNTY');
        let constituency = featureAtPixel.get('CONSTITUEN');
        let division = featureAtPixel.get('DIVISION');
        let location = featureAtPixel.get('LOCATION');
        let subLocation = featureAtPixel.get('SUB_LOCATI');
        //
        let dispArray = [
          { name: 'region', value: region },
          { name: 'county', value: county },
          { name: 'sub county', value: constituency },
          { name: 'division', value: division },
          { name: 'location', value: location },
          { name: 'subLocation', value: subLocation }
        ];
        dispArray = dispArray.filter((v) => Boolean(v.value));
        dispArray = dispArray
          .map((v) => `${capitalize(v.name)}: ${capitalize(v.value)}`)
          .join(', ');
        setPolygonInfo(dispArray);
      } else {
        setPolygonInfo(null);
      }
    });

    map.on('singleclick', (evt) => {
      if (!window.isDrawingOrEditing) {
        const features = evt.map.getFeaturesAtPixel(evt.pixel);

        if (features.length > 0) {
          features.forEach((feature) => {
            if (feature) {
              // Show popup just for point features && lines, ignore for polygon
              let featureType = feature.getGeometry().getType();
              if (featureType === 'Point' || featureType === 'LineString') {
                helpers.showFeaturePopup(evt.coordinate, feature, navigate);
              }
            }
          });
        }
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  /**
   * Listens for add custom marker event.
   *
   * Takes coordinates of point/arrow on map, passes it to local state,
   * which is then passed along to a form dialog that allows addition of more
   * details to the added marker.
   *
   */
  window.emitter.addListener(
    'addMarker',
    (feature, coordinatesArray, markerType) => {
      setCoordinates(coordinatesArray);
      setMarkerType(markerType);
      handleOpenAddMarkerDialog();
    }
  );

  return (
    <MapContext.Provider value={{ map: mapObject }}>
      <div ref={mapRef} className="ol-map">
        {children}
        <MapStatus>
          <span>
            {pointerCoordinates.longitude &&
              pointerCoordinates.latitude &&
              `Longitude: ${pointerCoordinates.longitude}, Latitude: ${pointerCoordinates.latitude}`}
          </span>
          <span>{polygonInfo && polygonInfo}</span>
        </MapStatus>
      </div>
      <AddMarkerDialog
        coordinates={coordinates}
        type={type}
        open={open}
        handleClose={handleCloseAddMarkerDialog}
      />
    </MapContext.Provider>
  );
};

export default MapProvider;
