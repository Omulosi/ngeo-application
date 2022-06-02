import React from 'react';
/* eslint-disable */
import NgeoMap from './NgeoMap';
import Page from 'src/components/Page';
import useLayerGroupAndCapabilityData from 'src/hooks/useLayerGroupAndCapabilityData';

/**
 * Loads layers information from geoserver
 */
const Map = () => {
  const {
    layers: layerGroups,
    capabilities
  } = useLayerGroupAndCapabilityData();

  return (
    <Page title="Map">
      <NgeoMap layers={layerGroups} capabilities={capabilities} />
    </Page>
  );
};

export default Map;
