import React from 'react';
/* eslint-disable */
import NgeoMap from './NgeoMap';
import Page from 'src/components/Page';
import useLayerGroupAndCapabilityData from 'src/hooks/useLayerGroupAndCapabilityData';

/**
 * Load information on layers from geoserver
 */
const Map = () => {
  const { layers, capabilities } = useLayerGroupAndCapabilityData();

  return (
    <Page title="Map">
      <NgeoMap layers={layers} capabilities={capabilities} />
    </Page>
  );
};

export default Map;
