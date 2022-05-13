import React from 'react';
import ReactDOM from 'react-dom';
import AppProviders from './AppProviders';

import App from './App';

import * as serviceWorker from './serviceWorker';
// loads leaflet CSS
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
// react quill
import 'react-quill/dist/quill.snow.css';
import './index.css';

const { EventEmitter } = require('fbemitter');

// GLOBAL VARIABLES
window.map = null; // Global map object
window.emitter = new EventEmitter(); // For listening/broadcasting events
window.popup = null; // One popup for everything
window.isDrawingOrEditing = false;

/* eslint-disable */
ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,

  document.getElementById('root')
);

serviceWorker.register();
