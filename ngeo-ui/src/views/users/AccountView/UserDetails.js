import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import { roleNames } from 'src/config';
// import capitalize from 'src/utils/capitalize';
import { useUpdateUser } from '../../../fetch/user';

const useStyles = makeStyles(() => ({
  root: {}
}));

/* eslint-disable */
const ProfileDetails = ({ className, profileDetails, ...rest }) => {
  const {
    first_name,
    last_name,
    email,
    staff_number,
    role,
    uuid: userId
  } = profileDetails;

  console.log({ profileDetails });

  const [error, setError] = React.useState(null);
  const classes = useStyles();

  const updateMutation = useUpdateUser();

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (values, { setError }) => {
    try {
      console.log({ values });

      updateMutation.mutate({ ...values, id: userId });
    } catch (err) {
      console.log({ err });
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: profileDetails?.first_name,
      last_name: profileDetails?.last_name,
      email: profileDetails?.email,
      staff_number: profileDetails?.staff_number,
      role: roleNames[profileDetails?.role]
    },
    onSubmit: handleSubmit
  });

  console.log({ fvalues: formik.values });

  return (
    <form
      autoComplete="off"
      className={clsx(classes.root, className)}
      onSubmit={formik.handleSubmit}
      {...rest}
    >
      <Card>
        <CardHeader subheader="" title="Profile Info" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="First name"
                name="first_name"
                onChange={formik.handleChange}
                value={formik.values.first_name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Last name"
                name="last_name"
                onChange={formik.handleChange}
                required
                value={formik.values.last_name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Staff Number"
                name="staff_number"
                onChange={formik.handleChange}
                value={formik.values.staff_number}
                disabled
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                onChange={formik.handleChange}
                value={formik.values.role}
                disabled
              />
            </Grid>
            {/**
              <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phone}
                variant="outlined"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="ID Number"
                name="idNumber"
                onChange={handleChange}
                required
                value={values.idNumber}
                variant="outlined"
              />
            </Grid>
            
            */}
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" variant="contained" type="submit">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
  profileDetails: PropTypes.object
};

export default ProfileDetails;
