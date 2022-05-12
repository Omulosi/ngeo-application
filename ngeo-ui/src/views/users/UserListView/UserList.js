/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react/prop-types */
import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
// eslint-disable-next-line object-curly-newline
import { Avatar, Box, Container, Tooltip, makeStyles } from '@material-ui/core';
// import DataGridToolbar from 'src/components/DataGridToolbar';
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import DataGridDisplay from 'src/components/DataGridDisplay';
// import AddIcon from '@material-ui/icons/Add';
import PageToolbar from 'src/components/PageToolbar';
import FailureChip from 'src/components/FailureChip';
import SuccessChip from 'src/components/SuccessChip';
import { roleNames as roles } from 'src/config';

const useStyles = makeStyles(() => ({
  dark: {
    color: '#263238',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#263238'
    }
  },
  actionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewAction: {
    marginLeft: '0.7rem'
  }
}));

const UserList = ({ userList, user, title }) => {
  const navigate = useNavigate();
  const classes = useStyles();

  let rows =
    userList.length > 0
      ? userList.map((u) => {
          return {
            id: u.id,
            ...u.attributes,
            role: roles[u.attributes.role],
            is_active: { isActive: u.attributes.is_active },
            date_joined: moment(u.attributes.date_joined),
            user: { id: u.id }
          };
        })
      : [];

  const columns = [];
  const displayFields = [
    'id',
    'first_name',
    'last_name',
    'email',
    'date_joined',
    'is_active',
    'created',
    'role'
  ];
  if (rows.length > 0) {
    const fields = Object.keys(rows[0]);
    fields.forEach((field) => {
      let header = '';

      if (field === 'user') {
        return;
      }

      if (field === 'is_active') {
        return;
      }

      // Display only allowable fields
      if (!displayFields.includes(field)) {
        return;
      }

      switch (field) {
        case 'id':
          header = 'ID';
          break;
        case 'first_name':
          header = 'First Name';
          break;
        case 'last_name':
          header = 'Last Name';
          break;
        case 'email':
          header = 'Email';
          break;
        case 'date_joined':
          header = 'Date Joined';
          break;
        case 'created':
          header = 'Created';
          break;
        case 'role':
          header = 'Role';
          break;
        default:
          header = field;
      }
      columns.push({
        field,
        headerName: header,
        width: 200,
        hide: field === 'id' || field === 'created'
      });
    });

    const statusField = {
      field: 'is_active',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => {
        if (params.value.isActive) {
          return (
            <Box className={classes.actionItem}>
              <SuccessChip label="Active" />
            </Box>
          );
        }
        return (
          <Box className={classes.actionItem}>
            <FailureChip label="Inactive" />
          </Box>
        );
      }
    };

    const actionField = {
      field: 'user',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box className={classes.actionItem}>
          <Tooltip title="View" placement="bottom">
            <Avatar className={clsx(classes.dark, classes.viewAction)}>
              <ArrowRight
                onClick={() => navigate(`/app/users/${params.value.id}`)}
              />
            </Avatar>
          </Tooltip>
        </Box>
      )
    };

    columns.push(statusField);
    columns.push(actionField);
  }

  // Skip current current from list of users
  rows = rows
    ?.filter((u) => u.email !== user?.attributes.email)
    ?.filter((u) => !u.is_staff);

  const userListData = { columns, rows };

  return (
    <Container maxWidth={false}>
      <PageToolbar title={title} />
      <DataGridDisplay data={userListData} title={title} />
    </Container>
  );
};

export default UserList;
