import DashboardIcon from '@material-ui/icons/Dashboard';
import FolderIcon from '@material-ui/icons/Folder';
// import MapIcon from '@material-ui/icons/Map';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import ViewListIcon from '@material-ui/icons/ViewList';
import WarningIcon from '@material-ui/icons/Warning';
import {
  User as UserIcon,
  MapPin,
  HelpCircle
  //   Users as UsersIcon
} from 'react-feather';
import { roles } from 'src/config';
import mainConfig from 'src/config/config.json';

/** Todo: Add Menu Names to the config file */

/* eslint-disable */
// Side menu items as a map of their links and components
const getMenuItems = (user) => {
  // check if a user object not empty.
  // Presence of this object shows user is authorized to use the app.
  const { sidebarMenu } = mainConfig;
  const isAuthorized = user && Object.entries(user).length !== 0;
  const isFieldOfficer = user && user.role && user.role === roles.FOO;
  const isRegionalManager = user && user.role && user.role === roles.RM;
  const isCountyManager = user && user.role && user.role === roles.CM;
  const isHR = user && user.role && user.role === roles.HR;
  const isFinance = user && user.role && user.role === roles.Finance;
  const isCEO = user && user.role && user.role === roles.CEO;
  const isDefault = user?.role === roles.Default;
  // deputy rm
  // deputy cm

  const items = [
    {
      href: '/app/activity',
      icon: HomeIcon,
      title: sidebarMenu.home.title,
      name: sidebarMenu.home.description,
      visible: isAuthorized && !isCEO && !isDefault
    },

    // {
    //   href: '/app/map',
    //   icon: MapIcon,
    //   title: 'Map',
    //   visible: true
    // },
    {
      href: '/app/dashboard',
      icon: DashboardIcon,
      title: sidebarMenu.dashboard.title,
      name: sidebarMenu.dashboard.description,
      visible: isAuthorized && !isDefault
    },
    {
      href: '/c/map',
      icon: MapPin,
      title: sidebarMenu.map.title,
      name: sidebarMenu.map.description,
      visible: true && !isHR
    },

    {
      href: '/app/users',
      icon: PeopleIcon,
      title: sidebarMenu.users.title,
      name: sidebarMenu.users.description,
      visible: isAuthorized && isHR
    },
    {
      href: '/app/regional_managers',
      icon: PeopleIcon,
      title: sidebarMenu.rm.title,
      name: sidebarMenu.rm.description,
      visible:
        isAuthorized &&
        !isFinance &&
        !isCountyManager &&
        !isFieldOfficer &&
        !isHR &&
        !isRegionalManager &&
        !isDefault
    },
    // deputy rm
    {
      href: '/app/deputy_regional_managers',
      icon: PeopleIcon,
      title: sidebarMenu.d_rm.title,
      name: sidebarMenu.d_rm.description,
      visible:
        isAuthorized &&
        !isFinance &&
        !isCountyManager &&
        !isFieldOfficer &&
        !isHR &&
        !isRegionalManager &&
        !isDefault
    },
    {
      href: '/app/county_managers',
      icon: PeopleIcon,
      title: sidebarMenu.cm.title,
      name: sidebarMenu.cm.description,
      visible: isAuthorized && (isRegionalManager || isCEO) && !isDefault
    },
    // Deputy CM
    {
      href: '/app/deputy_county_managers',
      icon: PeopleIcon,
      title: sidebarMenu.d_cm.title,
      name: sidebarMenu.d_cm.description,
      visible: isAuthorized && (isRegionalManager || isCEO) && !isDefault
    },
    {
      href: '/app/field_officers',
      icon: PeopleIcon,
      title: sidebarMenu.foo.title,
      name: sidebarMenu.foo.description,

      visible: isAuthorized && (isCountyManager || isCEO) && !isDefault
    },
    {
      href: '/app/agents',
      icon: PeopleIcon,
      title: sidebarMenu.agent.title,
      name: sidebarMenu.agent.description,
      visible:
        isAuthorized &&
        (isFieldOfficer || isFinance || isCountyManager || isCEO) &&
        !isHR &&
        !isDefault
      // items: !isFinance && [
      //   {
      //     href: '/app/agents',
      //     title: 'Agents',
      //     visible: isAuthorized
      //   },
      //   {
      //     href: '/app/returns',
      //     title: 'Returns',
      //     visible: isAuthorized
      //   }
      // ]
    },
    // {
    //   href: '/app/hr/agents',
    //   icon: PeopleIcon,
    //   title: 'BEA',
    //   visible: isAuthorized && isFinance
    // },
    // ############################ End of HR view ###########################################
    {
      href: '/app/projects',
      icon: FolderIcon,
      title: sidebarMenu.project.title,
      name: sidebarMenu.project.description,
      visible: isAuthorized && !isHR && !isDefault // && !isRegionalManager
    },
    // {
    //   href: '/app/incidents',
    //   icon: MapPin,
    //   title: 'Incidents',
    //   visible: isAuthorized && isFieldOfficer && !isHR
    // },
    {
      href: '/app/threats',
      icon: WarningIcon,
      title: sidebarMenu.threat.title,
      name: sidebarMenu.threat.description,
      visible: isAuthorized && !isHR && !isFieldOfficer && !isDefault
    },
    {
      href: '/app/themes',
      icon: ViewListIcon,
      title: sidebarMenu.theme.title,
      name: sidebarMenu.theme.description,
      visible: isAuthorized && isFinance && !isDefault
    },
    // Help - display user manual as pdf
    {
      href: '/app/help',
      icon: HelpCircle,
      title: sidebarMenu.help.title,
      name: sidebarMenu.help.description,
      visible: isAuthorized
    },
    {
      href: '/app/account',
      icon: UserIcon,
      title: sidebarMenu.account.title,
      name: sidebarMenu.account.description,
      visible: isAuthorized
    }
  ];

  return items;
};

export default getMenuItems;
