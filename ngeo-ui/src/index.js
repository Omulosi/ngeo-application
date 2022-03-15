import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import { DrawerProvider } from './context/drawer.context';

import App from './App';
import store from './redux/store';

import * as serviceWorker from './serviceWorker';
// loads leaflet CSS
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
// react quill
import 'react-quill/dist/quill.snow.css';
import './index.css';

const { EventEmitter } = require('fbemitter');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: 0
    }
  }
});

// GLOBAL VARIABLES
window.map = null; // Global map object
window.emitter = new EventEmitter(); // For listening/broadcasting events
window.popup = null; // One popup for everything
window.isDrawingOrEditing = false;

/* eslint-disable */
ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <DrawerProvider>
            <App />
          </DrawerProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register();
