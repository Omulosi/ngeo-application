/* eslint-disable */
import axios from 'axios';
import { makeUseAxios } from 'axios-hooks';
import BASE_URL from 'src/config';
import { setupCache } from 'axios-cache-adapter';

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 2 * 60 * 60 * 1000
});

export const axiosWithAuth = () => {
  const token = localStorage.getItem('token');

  const client = axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  });

  client.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 500) {
        // do nothing
        localStorage.removeItem('token');
        // window.location.reload();
        // return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const axiosWithoutAuth = () => {
  return axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const axiosGeneral = () => {
  return axios.create({
    // headers: { 'Cache-Control': 'no-cache' },
    // Wait for 2 hrs before issuing another call
    adapter: cache.adapter
  });
};

export const useAxios = () => {
  const token = localStorage.getItem('token');

  return makeUseAxios({
    axios: axios.create({
      baseURL: `${BASE_URL}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })
  });
};
