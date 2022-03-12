/* eslint-disable object-curly-newline */
import React from 'react';
import * as helpers from 'src/utils/helpers';
import mainConfig from 'src/config/config.json';
import { WMSCapabilities } from 'ol/format';
import geoserverConfig from 'src/config/geoserver';

const {
  geoserverCapabilitiesUrl,
  geoserverRestUrl,
  geoserverWorkspace
} = mainConfig;

const allLayerGroupsURL = `${geoserverRestUrl}/workspaces/${geoserverWorkspace}/layergroups`;

const useLayerGroupAndCapabilityData = () => {
  const [layerGroupsArray, setLayerGroupsArray] = React.useState(
    () => helpers.getItemsFromStorage('layerGroup') || []
  );
  const [layers, setLayers] = React.useState(
    () => helpers.getItemsFromStorage('layers') || []
  );
  const [capabilities, setCapabilities] = React.useState(
    () => helpers.getItemsFromStorage('capabilities') || []
  );

  const parser = new WMSCapabilities();

  React.useEffect(() => {
    /* loads capabilities (metadata) for each layer */
    if (!capabilities.length) {
      fetch(`${geoserverCapabilitiesUrl}`)
        .then((response) => {
          return response.text();
        })
        .then((text) => {
          const result = parser.read(text);
          // eslint-disable-next-line no-shadow
          let capabilities = result.Capability.Layer.Layer;
          capabilities = capabilities.map((layer) => ({
            name: layer.Name,
            title: layer.Title,
            extentCRS: layer.BoundingBox[0].extent,
            extentEPSG: layer.BoundingBox[1].extent,
            extent4326: layer.EX_GeographicBoundingBox,
            abstract: layer.Abstract
          }));
          setCapabilities(capabilities);
          helpers.saveToStorage('capabilities', capabilities);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    /* loads info on all layer groups */
    if (!layerGroupsArray.length) {
      fetch(allLayerGroupsURL, geoserverConfig('GET'))
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // eslint-disable-next-line no-shadow
          const layerGroupsArray = data && data.layerGroups.layerGroup;
          setLayerGroupsArray(layerGroupsArray);
          helpers.saveToStorage('layerGroup', layerGroupsArray);
        })
        .catch((err) => {
          setLayerGroupsArray([]);
          console.error(err);
        });
    }
  }, []);

  /* Loads info on all layers from each layer group loaded above */
  React.useEffect(async () => {
    if (!layers.length) {
      if (layerGroupsArray && layerGroupsArray.length > 0) {
        let promises = [];
        /* For each layer group, fetch data pertinent to that layer */
        promises = layerGroupsArray.map((layerGroup) => {
          const url = layerGroup.href;
          // fetch(url.replace(process.env.REACT_APP_LAYER_GROUP_URL, '/'), geoserverConfig('GET'))
          return fetch(url, geoserverConfig('GET'))
            .then((response) => {
              return response.json();
            })
            .catch((err) => {
              console.error(`Layer group fetch error: ${err}`);
            });
        });

        Promise.all(promises).then((resolvedArray) => {
          setLayers([...layers, ...resolvedArray]);
          helpers.saveToStorage('layers', [...layers, ...resolvedArray]);
        });
      }
    }
  }, [layerGroupsArray]);

  return { layers, capabilities };
};

export default useLayerGroupAndCapabilityData;
