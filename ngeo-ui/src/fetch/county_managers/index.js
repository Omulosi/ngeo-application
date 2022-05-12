/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import { useQuery } from 'react-query';
import fetchResource from '../fetchers';

const getCountyManager = async () => {
  const { data } = await fetchResource('/county_managers/me/');
  return data;
};

const getCountyManagerById = async (id) => {
  const { data } = await fetchResource(`/county_managers/${id}`);
  return data;
};

const getDeputyCountyManagerById = async (id) => {
  const { data } = await fetchResource(`/deputy_county_managers/${id}`);
  return data;
};

const getCountyManagerList = async () => {
  const { data } = await fetchResource('/county_managers');
  return data;
};

const getDeputyCountyManagerList = async () => {
  const { data } = await fetchResource('/deputy_county_managers');
  return data;
};

export default function useCountyManager() {
  return useQuery('countyManager', () => getCountyManager());
}

export function useCountyManagerById(cmId) {
  return useQuery(['countyManager', cmId], () => getCountyManagerById(cmId));
}

export function useCountyManagerList() {
  return useQuery('countyManager-list', () => getCountyManagerList());
}

export function useDeputyCountyManagerList() {
  return useQuery('deputy-countyManager-list', () =>
    getDeputyCountyManagerList()
  );
}

export function useDeputyCountyManagerById(cmId) {
  return useQuery(['deputy-countyManager', cmId], () =>
    getDeputyCountyManagerById(cmId)
  );
}
