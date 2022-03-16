/* eslint-disable object-curly-newline */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import clsx from 'clsx';
import { Divider, List, Tooltip, makeStyles } from '@material-ui/core';
import {
  isFinance as isFinanceOfficer,
  isCountyManager
} from 'src/utils/getRole';
import useUser from '../../fetch/user';
import pointIcon from './images/point.png';
import arrowIcon from './images/arrow.png';
import polygonIcon from './images/polygon.png';
import polyLineIcon from './images/polyline.png';
import noneIcon from './images/none.png';

import AccordionItem from './AccordionItem';

const useStyles = makeStyles({
  innerContent: {
    paddingLeft: '10px',
    backgroundColor: 'rgb(35, 48, 68)',
    paddingBottom: '1em'
  },
  buttonBar: {
    // background: 'linear-gradient(180deg, #fff 0,#e5e5e5)',
    // boxShadow: '0 0 0 1px rgb(0 0 0 / 10%), 0 4px 6px rgb(0 0 0 / 20%)',
    marginBottom: '10px',
    marginTop: '15px',
    marginLeft: '10px',
    width: '50%',
    display: 'inline-block',
    padding: '4px'
  },
  buttonContainer: {
    display: 'inline-block',
    // borderRight: '1px solid #e8e8e8',
    background: 'linear-gradient(180deg, #fff 0,#e5e5e5)',
    boxShadow: '0 0 0 1px rgb(0 0 0 / 10%), 0 4px 6px rgb(0 0 0 / 20%)'
  },
  button: {
    height: '38px',
    width: '34px',
    border: 'none',
    backgroundColor: 'initial',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  buttonActive: {
    // background: '#f2f5f6',
    background: 'linear-gradient(180deg,#f2f5f6 0,#e3eaed 37%,#c8d7dc)',
    border: '1px solid #97c3e8',
    boxShadow: '0 0 5px rgb(136 231 255 / 74%)'
  }
});

// eslint-disable-next-line object-curly-newline
const SideDrawer = ({ drawerContent, userData, state }) => {
  const classes = useStyles();
  // Get currently logged in user
  const { data: user } = useUser();
  const isAuthenticated = user?.isAuthenticated;

  return (
    <SideDrawer>
      {/** Layers Section - loads components for controling layer visibility on drawer  */}
      {isAuthenticated && (
        <List>
          <AccordionItem title="Layers">
            <Divider
              component="li"
              style={{ backgroundColor: 'rgb(238,238,238)' }}
            />
            <div className={classes.innerContent}>{drawerContent}</div>
          </AccordionItem>
        </List>
      )}

      {/** Threats Section - components for adding threats */}
      {isAuthenticated && isCountyManager(userData.role) && (
        <AccordionItem title="Threats">
          <Divider
            component="li"
            style={{ backgroundColor: 'rgb(238,238,238)' }}
          />
          <div className={classes.innerContent}>
            <AccordionItem title="Add Threat">
              <div className={classes.buttonBar}>
                {/** Arrow */}
                <Tooltip title="Add Threat" placement="right">
                  <div
                    className={clsx(
                      classes.buttonContainer,
                      state?.activeButton === 'arrow'
                        ? classes.buttonActive
                        : null
                    )}
                  >
                    <button
                      className={classes.button}
                      onClick={() => {
                        // setDrawType('Arrow');
                        // setActiveButton('arrow');
                      }}
                    >
                      <img src={arrowIcon} alt="arrow icon" />
                    </button>
                  </div>
                </Tooltip>

                {/** Cancel draw */}
                <Tooltip title="Cancel draw" placement="right">
                  <div
                    className={clsx(
                      classes.buttonContainer,
                      state?.activeButton === 'none'
                        ? classes.buttonActive
                        : null
                    )}
                  >
                    <button
                      className={classes.button}
                      onClick={() => {
                        // setDrawType('None');
                        // setActiveButton('none');
                      }}
                    >
                      <img src={noneIcon} alt="cancel icon" />
                    </button>
                  </div>
                </Tooltip>
              </div>
            </AccordionItem>
          </div>
        </AccordionItem>
      )}

      {/** Projects Section - components for adding projects */}
      {isAuthenticated && isFinanceOfficer(userData.role) && (
        <AccordionItem title="Projects">
          <Divider
            component="li"
            style={{ backgroundColor: 'rgb(238,238,238)' }}
          />
          <div className={classes.innerContent}>
            <AccordionItem title="Add Project">
              <div className={classes.buttonBar}>
                {/** Point */}

                <Tooltip title="Add Project" placement="right">
                  <div
                    className={clsx(
                      classes.buttonContainer,
                      state?.activeButton === 'point'
                        ? classes.buttonActive
                        : null
                    )}
                  >
                    <button
                      className={classes.button}
                      onClick={() => {
                        //   setDrawType('Point');
                        //   setActiveButton('point');
                      }}
                    >
                      <img src={pointIcon} alt="Point icon" />
                    </button>
                  </div>
                </Tooltip>

                {/** Cancel draw */}
                <Tooltip title="Cancel draw" placement="right">
                  <div
                    className={clsx(
                      classes.buttonContainer,
                      state?.activeButton === 'none'
                        ? classes.buttonActive
                        : null
                    )}
                  >
                    <button
                      className={classes.button}
                      onClick={() => {
                        // setDrawType('None');
                        // setActiveButton('none');
                      }}
                    >
                      <img src={noneIcon} alt="Cancel icon" />
                    </button>
                  </div>
                </Tooltip>
              </div>
            </AccordionItem>
          </div>
        </AccordionItem>
      )}

      {/** Tools Section - Measurement, print, coordinates, add data */}
      <AccordionItem title="Tools">
        <Divider
          component="li"
          style={{ backgroundColor: 'rgb(238,238,238)' }}
        />
        <div className={classes.innerContent}>
          <AccordionItem title="Measure">
            <div className={classes.buttonBar}>
              {/** LineString */}
              <Tooltip title="Measure Line" placement="right">
                <div
                  className={clsx(
                    classes.buttonContainer,
                    state?.activeButton === 'linestring'
                      ? classes.buttonActive
                      : null
                  )}
                >
                  <button
                    className={classes.button}
                    onClick={() => {
                      //   setMeasureType('LineString');
                      //   setActiveButton('linestring');
                    }}
                  >
                    <img src={polyLineIcon} alt="line icon" />
                  </button>
                </div>
              </Tooltip>

              {/** Area */}
              <Tooltip title="Measure Area" placement="right">
                <div
                  className={clsx(
                    classes.buttonContainer,
                    state?.activeButton === 'area' ? classes.buttonActive : null
                  )}
                >
                  <button
                    className={classes.button}
                    onClick={() => {
                      //   setMeasureType('Area');
                      //   setActiveButton('area');
                    }}
                  >
                    <img src={polygonIcon} alt="polygon icon" />
                  </button>
                </div>
              </Tooltip>

              {/** Cancel */}
              <Tooltip title="Cancel Measure" placement="right">
                <div
                  className={clsx(
                    classes.buttonContainer,
                    state?.activeButton === 'cancel'
                      ? classes.buttonActive
                      : null
                  )}
                >
                  <button
                    className={classes.button}
                    onClick={() => {
                      //   setMeasureType('None');
                      //   setActiveButton('cancel');
                    }}
                  >
                    <img src={noneIcon} alt="cancel icon" />
                  </button>
                </div>
              </Tooltip>
            </div>
          </AccordionItem>
        </div>
      </AccordionItem>
    </SideDrawer>
  );
};

export default SideDrawer;
