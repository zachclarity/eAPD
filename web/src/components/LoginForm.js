import { Button, Spinner } from '@cmsgov/design-system';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router';

const formSubmitNoop = e => e.preventDefault();

const LoginForm = ({
  cancelable,
  canSubmit,
  children,
  error,
  footer,
  history,
  id,
  legend,
  onSave,
  primaryButtonText: [primaryButtonNormal, primaryButtonWorking],
  sectionName,
  success,
  title,
  working
}) => (
  <div id={id} className="card--container">
    <div className="ds-l-container">
      <div className="ds-l-row card">
        <div className="ds-l-col--1 ds-u-margin-left--auto" />
        <div className="ds-l-col--12 ds-l-sm-col--10 ds-l-lg-col--6">
          <div className="ds-u-display--flex ds-u-flex-direction--column ds-u-justify-content--center ds-u-align-items--center">
            <img
              src="/static/img/eAPDLogoSVG:ICO/SVG/eAPDColVarSVG.svg"
              alt="eAPD Logo"
            />
            <h1 className="ds-h1 ds-u-margin-top--2">
              {sectionName.length > 0 && (
                <span className="ds-h6 ds-u-display--block">
                  {sectionName.toUpperCase()}
                </span>
              )}
              {title}
            </h1>
          </div>
          {!!success && <div className="ds-u-margin-top--3">{success}</div>}
          {!!error && <div className="ds-u-margin-top--3">{error}</div>}
          <form onSubmit={(canSubmit && onSave) || formSubmitNoop}>
            <fieldset className="ds-u-margin--0 ds-u-padding--0 ds-u-border--0">
              {!!legend && (
                <legend className="ds-u-visibility--screen-reader">
                  {legend}
                </legend>
              )}

              {children}

              <div className="ds-u-margin-top--5">
                {onSave && (
                  <Button
                    variation="primary"
                    type="submit"
                    disabled={!canSubmit || working}
                  >
                    {working ? (
                      <Fragment>
                        <Spinner /> {primaryButtonWorking}
                      </Fragment>
                    ) : (
                      primaryButtonNormal
                    )}
                  </Button>
                )}
                {cancelable && (
                  <Button variation="transparent" onClick={history.goBack}>
                    Cancel
                  </Button>
                )}
              </div>
            </fieldset>
          </form>
          {footer && <div className="card--foter">{footer}</div>}
        </div>
        <div className="ds-l-col--1 ds-u-margin-right--auto" />
      </div>
    </div>
  </div>
);

LoginForm.propTypes = {
  cancelable: PropTypes.bool,
  canSubmit: PropTypes.bool,
  children: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  history: PropTypes.object.isRequired,
  id: PropTypes.string,
  legend: PropTypes.string,
  onSave: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  primaryButtonText: PropTypes.arrayOf(PropTypes.string),
  sectionName: PropTypes.string,
  success: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  title: PropTypes.string.isRequired,
  working: PropTypes.bool
};

LoginForm.defaultProps = {
  cancelable: true,
  canSubmit: true,
  error: false,
  footer: false,
  id: 'start-main-content',
  legend: '',
  onSave: false,
  primaryButtonText: ['Save changes', 'Working'],
  sectionName: '',
  success: false,
  working: false
};

export default withRouter(LoginForm);

export { LoginForm as plain };
