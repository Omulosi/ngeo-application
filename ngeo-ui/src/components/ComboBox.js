/* eslint-disable no-use-before-define */
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

/* eslint-disable */
const ComboBox = ({
  label,
  value,
  setValue,
  data,
  name,
  groupBy,
  disabled = false,
  setAssignAreaDisabled
}) => {
  return (
    <Autocomplete
      id="combo-box"
      disabled={disabled}
      value={value}
      onChange={(evt, newValue) => {
        setValue(newValue);
        setAssignAreaDisabled?.(newValue);
      }}
      options={data}
      getOptionLabel={(option) => option.name}
      groupBy={groupBy}
      renderInput={(params) => (
        <TextField {...params} label={label} name={name} variant="outlined" />
      )}
    />
  );
};

ComboBox.propTypes = {
  label: PropTypes.string,
  data: PropTypes.object
};

export default ComboBox;
