export const GEOSERVER_USERNAME = process.env.REACT_APP_GEOSERVER_USERNAME;
export const GEOSERVER_PASSWORD = process.env.REACT_APP_GEOSERVER_PASSWORD;

const base64 = require('base-64');

const AUTH = { user: GEOSERVER_USERNAME, pass: GEOSERVER_PASSWORD };

const config = (method) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Basic ${base64.encode(`${AUTH.user}:${AUTH.pass}`)}`
  }
});

export const configXML = (method) => ({
  method,
  headers: {
    'Content-Type': 'text/xml',
    Accept: 'text/xml',
    Authorization: `Basic ${base64.encode(`${AUTH.user}:${AUTH.pass}`)}`
  }
});

export default config;
