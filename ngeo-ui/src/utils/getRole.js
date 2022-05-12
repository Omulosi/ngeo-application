import { roles } from 'src/config';

export function isFieldOfficer(role) {
  return role === roles.FOO;
}

export function isCountyManager(role) {
  return role === roles.CM || role === roles.DCM;
}

export function isRegionalManager(role) {
  // Deputy RM has the same rights as RM
  return role === roles.RM || role === roles.DRM;
}

export function isFinance(role) {
  return role === roles.Finance;
}

export function isHR(role) {
  return role === roles.HR;
}

export function isCEO(role) {
  return role === roles.CEO;
}
