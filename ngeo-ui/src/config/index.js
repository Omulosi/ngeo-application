export const BACKEND_HOST = process.env.REACT_APP_API_HOST;
export const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT; // dev or prod

const BASE_URL = `${BACKEND_HOST}/api/v1`;

export default BASE_URL;

/**
 * (In Assign Role Module)
 */
export const roleNames = {
  1: 'Admin',
  2: 'CEO',
  // 3: 'Auditor',
  4: 'Finance',
  5: 'Regional Manager',
  6: 'CM',
  7: 'FOO',
  8: 'Default-Unassigned',
  9: 'Human Resource'
};

/**
 * Agent Terms
 *
 * PERMANENT_HQ = 1
 * PERMANENT_COUNTY = 2
 * CONTRACT = 3
 *
 * Permanent should have the keys '1' or '2'
 */
// (in Agent List Page)
export const agentTerms = {
  // 1: 'Permanent - HQ',
  // 2: 'Permanent - County',
  2: 'Permanent',
  3: 'Contract'
};

export const threatTypes = [
  { name: 'Incoming', value: 'incoming', color: 'red' },
  { name: 'Outgoing', value: 'outgoing', color: 'yellow' }
];

export const initiatedByList = {
  HQ: 'HQ',
  COUNTY: 'County'
};

/**
 * Maps default role names to their keys
 *
 * SHOULD NOT BE MODIFIED!
 */
export const roles = {
  Admin: 1,
  CEO: 2,
  Audit: 3,
  Finance: 4,
  // Regional Manager
  RM: 5,
  // County Manager
  CM: 6,
  // Field Outreach Officer
  FOO: 7,
  HR: 9,
  Default: 8
};

// update a value to modify all its occurences in the
// projects query centre popup.
// Leave the keys as is.
export const queryCentreAttributes = {
  agents: 'BEA',
  hq: 'HQ',
  county: 'County',
  project: 'Project-123'
};

/**
 * Agent Identification Field
 */
export const ID_FIELD_LABEL = 'ID Number';
