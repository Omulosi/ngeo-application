import React from 'react';
/* eslint-disable */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  // Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import FullScreenDialog from '../../../components/modals/FullScreenDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    '& :hover': {
      cursor: 'pointer'
    }
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  }
}));

const SummaryCard = ({ children, className, count, label, icon = null }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!icon) {
    icon = <PeopleIcon />;
  }

  return (
    <>
      <Card className={clsx(classes.root, className)} onClick={handleOpen}>
        <CardContent>
          <Grid container justify="space-between" spacing={3}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="h6">
                {label}
              </Typography>
              <Typography color="textPrimary" variant="h3">
                {count}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar}>{icon}</Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {open && (
        <FullScreenDialog open={open} handleClose={handleClose} label={label}>
          {children}
        </FullScreenDialog>
      )}
    </>
  );
};

SummaryCard.propTypes = {
  className: PropTypes.string
};

export default SummaryCard;
