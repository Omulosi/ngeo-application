import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import { DrawerProvider } from './context/drawer.context';

import store from './redux/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: 0
    }
  }
});

/* eslint-disable */
export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <QueryClientProvider client={queryClient} contextSharing={true}>
            <DrawerProvider>{children}</DrawerProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}
