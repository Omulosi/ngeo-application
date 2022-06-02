import React from 'react';

const useFilteredData = (data) => {
  const [filteredData, setFilteredData] = React.useState([]);

  React.useState(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    let result = [];

    result = data?.filter((d) => {
      console.log({ source: d.props.source.getKeys() });
      return d?.key?.toLocaleLowerCase().search(value) !== -1;
    });

    setFilteredData(result);
  };

  const resultList = filteredData.length ? filteredData : data;

  const test = resultList.map((t) => t.props.source.get('layerName'));
  console.log({ test });

  return { filteredData: resultList, setFilteredData, handleSearch };
};

export default useFilteredData;
