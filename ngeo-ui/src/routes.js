import React from 'react';
import { Navigate } from 'react-router-dom';

/* eslint-disable */

import MapProvider from 'src/views/ngeoMap/Map';

// Layout
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';

// Authentication
import LoginView from 'src/views/users/AuthView/LoginView';
import RegisterView from 'src/views/users/AuthView/RegisterView';
import ForgotPasswordView from 'src/views/users/AuthView/ForgotPassword';
import ResetPasswordView from 'src/views/users/AuthView/ResetPassword';

// User profile
import AccountView from 'src/views/users/AccountView';
import SettingsView from 'src/views/settings/SettingsView';

// Projects
import ProjectsView from 'src/views/project';
import ProjectDetailView from 'src/views/project/ProjectDetail';
// import ProjectProfileView from 'src/views/project/ProjectProfile';
import AddProjectView from 'src/views/project/AddProject';
import EditProjectView from 'src/views/project/EditProject';

// Home page
import HomeView from 'src/views/home';

// Welcome Page
import WelcomeView from 'src/views/activity';

// Map
// import MapView from 'src/views/map/Map';
// Do not use code splitting here, causes strange behavior on map load
import NgeoMapView from 'src/views/ngeoMap';

// Agents
import AgentsView from 'src/views/agent';
import AgentProfile from 'src/views/agent/AgentProfile';
import AddAgentView from 'src/views/agent/AddAgent';
import EditAgentView from 'src/views/agent/EditAgent';

// Incidents
import IncidentsView from 'src/views/incident';
import AddIncidentsView from 'src/views/incident/AddIncident';
import IncidentDetail from 'src/views/incident/IncidentDetail';

// Dashboard
import DashboardView from 'src/views/reports/DashboardView';

// General
import NotFoundView from 'src/views/errors/NotFoundView';

// Field Officers
import FieldOfficerListView from 'src/views/field_officer';
import FieldOfficerProfile from 'src/views/field_officer/FieldOfficerProfile';
// import AddFieldOfficerView from 'src/views/field_officer/AddFieldOfficer';
// import EditFieldOfficerView from 'src/views/field_officer/EditFieldOfficer';
// import FieldOfficerAgentView from 'src/views/field_officer/ManageAgents';

// County Managers
import CountyManagerListView from 'src/views/county_manager';
import CountyManagerProfile from 'src/views/county_manager/CountyManagerProfile';

// Regional Managers
import RegionalManagerListView from 'src/views/regional_manager';
import RegionalManagerProfile from 'src/views/regional_manager/RegionalManagerProfile';

// Returns
import AllAgentReturns from 'src/views/agent/AllAgentReturns';
import AddReturnView from 'src/views/agent/AddReturn';
import EditReturnView from 'src/views/agent/EditReturn';
import ReturnDetailView from 'src/views/agent/ReturnDetails';

// User List
import UserList from 'src/views/users/UserListView';
import UserProfile from 'src/views/users/UserListView/UserProfile';

// Threats
import ThreatsView from 'src/views/threats';
import AddThreatView from 'src/views/threats/AddThreat';
import EditThreatView from 'src/views/threats/EditThreat';
import ThreatDetail from 'src/views/threats/ThreatDetail';

// Themes
import ThemesView from 'src/views/themes';

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
      { path: 'returns', element: <AllAgentReturns /> },
      { path: 'returns/add', element: <AddReturnView /> },
      { path: 'returns/edit/:id', element: <EditReturnView /> },
      { path: 'returns/:id', element: <ReturnDetailView /> },

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

      // field officers views
      { path: 'field_officers', element: <FieldOfficerListView /> },
      { path: 'field_officers/:id', element: <FieldOfficerProfile /> },
      // { path: 'field_officers/add', element: <AddFieldOfficerView /> },
      // { path: 'field_officers/edit/:id', element: <EditFieldOfficerView /> },
      // { path: 'field_officers/agents/:id', element: <FieldOfficerAgentView /> },

      // county manager views
      { path: 'county_managers', element: <CountyManagerListView /> },
      { path: 'county_managers/:id', element: <CountyManagerProfile /> },

      // Regional manager views
      { path: 'regional_managers', element: <RegionalManagerListView /> },
      { path: 'regional_managers/:id', element: <RegionalManagerProfile /> },

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
