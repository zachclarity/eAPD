import React from 'react';

const StateDashboardStatus = ({status}) => {
  if(status === 'pending') {
    return (
      <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-justify-content--center ds-u-align-items--center ds-u-margin-y--4">
        <img alt="Puzzle Piece Icon" src="../static/icons/puzzle.svg" width="57" />
        <h3 className="ds-u-margin-bottom--1">
          Approval Pending From State Administrator
        </h3>
        <p className="ds-u-margin--0">
          Please contact State Administrator for more information.
        </p>
      </div>
    )
  }

  if(status === 'denied') {
    return (
      <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-justify-content--center ds-u-align-items--center ds-u-margin-y--4">
        <img alt="Puzzle Piece Icon" src="../static/icons/alert.svg" height="51" />
        <h3 className="ds-u-margin-bottom--1">
          Approval Has Been Denied
        </h3>
        <p className="ds-u-margin--0">
          Please contact State Administrator for more information.
        </p>
      </div>
    )
  }

  if(status === 'revoked') {
    return (
      <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-justify-content--center ds-u-align-items--center ds-u-margin-y--4">
        <img alt="Puzzle Piece Icon" src="../static/icons/alert.svg" height="51" />
        <h3 className="ds-u-margin-bottom--1">
          Approval Permissions Revoked
        </h3>
        <p className="ds-u-margin--0">
          Please contact State Administrator for more information.
        </p>
      </div>
    )
  }

  if(status === 'approved') {
    return (
      <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-justify-content--center ds-u-align-items--center ds-u-margin-y--4">
        <img alt="Puzzle Piece Icon" src="../static/icons/thumbs-up.svg" width="57" />
        <h3 className="ds-u-margin-bottom--1">
          Approved
        </h3>
        <p className="ds-u-margin--0">
          Congratulations! You may now create an APD.
        </p>
      </div>
    )
  }
  return null;
}

export default StateDashboardStatus;