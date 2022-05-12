/* eslint-disable import/prefer-default-export */

// Home page
export { default as HomeView } from './home';

// Welcome page
export { default as WelcomeView } from './activity';

// Authentication view
export { default as LoginView } from './users/AuthView/LoginView';
export { default as RegisterView } from './users/AuthView/RegisterView';
export { default as ForgotPasswordView } from './users/AuthView/ForgotPassword';
export { default as ResetPasswordView } from './users/AuthView/ResetPassword';

// User profile
export { default as AccountView } from './users/AccountView';
export { default as SettingsView } from './settings/SettingsView';

// Projects
export { default as ProjectsView } from './project';
export { default as ProjectDetailView } from './project/ProjectDetail';
export { default as AddProjectView } from './project/AddProject';
export { default as EditProjectView } from './project/EditProject';

// Map view
export { default as NgeoMapView } from './ngeoMap';

// Agents
export { default as AgentsView } from './agent';
export { default as AgentProfile } from './agent/AgentProfile';
export { default as AddAgentView } from './agent/AddAgent';
export { default as EditAgentView } from './agent/EditAgent';

// Incidents
export { default as IncidentsView } from './incident';
export { default as AddIncidentsView } from './incident/AddIncident';
export { default as IncidentDetail } from './incident/IncidentDetail';

// Dashboard
export { default as DashboardView } from './reports/DashboardView';

// General
export { default as NotFoundView } from './errors/NotFoundView';

// Field Officers
export { default as FieldOfficerListView } from './field_officer';
export { default as FieldOfficerProfile } from './field_officer/FieldOfficerProfile';

// County Managers
export { default as CountyManagerListView } from './county_manager';
export { default as CountyManagerProfile } from './county_manager/CountyManagerProfile';

// Deputy county managers
export { default as DeputyCountyManagerListView } from './county_manager/DeputyCountyManager';
export { default as DeputyCountyManagerProfile } from './county_manager/DeputyCountyManagerProfile';

// Regional Managers
export { default as RegionalManagerListView } from './regional_manager';
export { default as RegionalManagerProfile } from './regional_manager/RegionalManagerProfile';

// Deputy Regional Managers
export { default as DeputyRegionalManagerListView } from './regional_manager/DeputyRegionalManager';
export { default as DeputyRegionalManagerProfile } from './regional_manager/DeputyRegionalManagerProfile';

// Users
export { default as UserList } from './users/UserListView';
export { default as UserProfile } from './users/UserListView/UserProfile';

// Threats
export { default as ThreatsView } from './threats';
export { default as AddThreatView } from './threats/AddThreat';
export { default as EditThreatView } from './threats/EditThreat';
export { default as ThreatDetail } from './threats/ThreatDetail';

// Themes
export { default as ThemesView } from './themes';
