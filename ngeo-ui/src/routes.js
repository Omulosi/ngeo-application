import React from 'react';
import { Navigate } from 'react-router-dom';

import MapProvider from 'src/views/ngeoMap/Map';

// Layout
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';

import {
  // Authentication
  LoginView,
  RegisterView,
  ForgotPasswordView,
  ResetPasswordView,

  // User profile
  AccountView,
  SettingsView,

  // Projects
  ProjectsView,
  ProjectDetailView,
  AddProjectView,
  EditProjectView,

  // Home view
  HomeView,

  // Welcome view
  WelcomeView,

  // Ngeomap
  NgeoMapView,

  // Agents
  AgentsView,
  AgentProfile,
  AddAgentView,
  EditAgentView,

  // Incidents
  IncidentsView,
  IncidentDetail,
  AddIncidentsView,

  // Dashboard
  DashboardView,

  // Not found view
  NotFoundView,

  // Field officers
  FieldOfficerListView,
  FieldOfficerProfile,

  // County managers
  CountyManagerListView,
  CountyManagerProfile,

  // Deputy county manager
  DeputyCountyManagerListView,
  DeputyCountyManagerProfile,

  // Regional manager
  RegionalManagerListView,
  RegionalManagerProfile,

  // Deputy regional managers
  DeputyRegionalManagerListView,
  DeputyRegionalManagerProfile,

  // Users
  UserList,
  UserProfile,

  // Threats
  ThreatDetail,
  ThreatsView,
  AddThreatView,
  EditThreatView,

  // Themes
  ThemesView
} from 'src/views';

const routes = (isLoggedIn) => [
  {
    path: 'app',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      // Welcome view
      { path: 'activity', element: <WelcomeView /> },

      // Account + settings
      { path: 'account', element: <AccountView /> },

      // Dashboard
      { path: 'dashboard', element: <DashboardView /> },

      // Settings
      { path: 'settings', element: <SettingsView /> },

      // Agents views
      { path: 'agents', element: <AgentsView /> },
      { path: 'agents/:id', element: <AgentProfile /> },
      { path: 'agents/add', element: <AddAgentView /> },
      { path: 'agents/edit/:id', element: <EditAgentView /> },

      // Agent Returns
      // { path: 'returns', element: <AllAgentReturns /> },
      // { path: 'returns/add', element: <AddReturnView /> },
      // { path: 'returns/edit/:id', element: <EditReturnView /> },
      // { path: 'returns/:id', element: <ReturnDetailView /> },

      // projects views
      { path: 'projects', element: <ProjectsView /> },
      { path: 'projects/add', element: <AddProjectView /> },
      { path: 'projects/edit/:id', element: <EditProjectView /> },
      { path: 'projects/:id', element: <ProjectDetailView /> },

      // incidents views
      { path: 'incidents', element: <IncidentsView /> },
      { path: 'incidents/add', element: <AddIncidentsView /> },
      { path: 'incidents/:id', element: <IncidentDetail /> },

      // Threats views
      { path: 'threats', element: <ThreatsView /> },
      { path: 'threats/add', element: <AddThreatView /> },
      { path: 'threats/edit/:id', element: <EditThreatView /> },
      { path: 'threats/:id', element: <ThreatDetail /> },

      // field officers views.
      { path: 'field_officers', element: <FieldOfficerListView /> },
      { path: 'field_officers/:id', element: <FieldOfficerProfile /> },
      // { path: 'field_officers/add', element: <AddFieldOfficerView /> },
      // { path: 'field_officers/edit/:id', element: <EditFieldOfficerView /> },
      // { path: 'field_officers/agents/:id', element: <FieldOfficerAgentView /> },

      // county manager views.
      { path: 'county_managers', element: <CountyManagerListView /> },
      { path: 'county_managers/:id', element: <CountyManagerProfile /> },

      // Deputy county manager views.
      {
        path: 'deputy_county_managers',
        element: <DeputyCountyManagerListView />
      },
      {
        path: 'deputy_county_managers/:id',
        element: <DeputyCountyManagerProfile />
      },

      // Regional manager views
      { path: 'regional_managers', element: <RegionalManagerListView /> },
      { path: 'regional_managers/:id', element: <RegionalManagerProfile /> },

      // Deputy regional manager views
      {
        path: 'deputy_regional_managers',
        element: <DeputyRegionalManagerListView />
      },
      {
        path: 'deputy_regional_managers/:id',
        element: <DeputyRegionalManagerProfile />
      },

      // User List
      { path: 'users', element: <UserList /> },
      { path: 'users/:id', element: <UserProfile /> },

      // Thenes views
      { path: 'themes', element: <ThemesView /> },

      // Not Found Page
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomeView /> },
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: 'forgot-password', element: <ForgotPasswordView /> },
      {
        path: 'password/reset/:uid/:token',
        element: <ResetPasswordView />
      },
      {
        path: 'map',
        element: <Navigate to="/c/map" />
      },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/c',
    element: <DashboardLayout />,
    children: [
      // The map is loaded here
      {
        path: 'map',
        element: (
          <MapProvider>
            <div>
              <NgeoMapView />
            </div>
          </MapProvider>
        )
      }
    ]
  }
];

export default routes;
