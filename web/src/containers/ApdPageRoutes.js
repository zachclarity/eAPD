import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  useRouteMatch as actualUseRouteMatch,
  Redirect
} from 'react-router-dom';

import ApdHeader from './ApdHeader';
import Activities from './activity/All';
import EntryPage from './activity/EntryPage';
import AssurancesAndCompliance from './AssurancesAndCompliance';
import Export from './ApdExport';
import ApdSummary from './ApdSummary';
import ExecutiveSummary from './ExecutiveSummary';
import PreviousActivities from './PreviousActivities';
import ProposedBudget from './ProposedBudget';
import ScheduleSummary from './ScheduleSummary';
import StateProfile from '../components/ApdStateProfile';

const ApdPageRoutes = ({ useRouteMatch }) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/activity/:activityIndex`}>
        <EntryPage />
      </Route>

      <Route path={path}>
        <ApdHeader />

        <Route exact path={path}>
          <Redirect to={`${path}/program-summary`} />
        </Route>

        <Route path={`${path}/state-profile`}>
          <StateProfile />
        </Route>

        <Route path={`${path}/program-summary`}>
          <ApdSummary />
        </Route>

        <Route path={`${path}/previous-activities`}>
          <PreviousActivities />
        </Route>

        <Route path={`${path}/activities`}>
          <Activities />
        </Route>

        <Route path={`${path}/schedule-summary`}>
          <ScheduleSummary />
        </Route>

        <Route path={`${path}/proposed-budget`}>
          <ProposedBudget />
        </Route>

        <Route path={`${path}/assurances-and-compliance`}>
          <AssurancesAndCompliance />
        </Route>

        <Route path={`${path}/executive-summary`}>
          <ExecutiveSummary />
        </Route>

        <Route path={`${path}/export`}>
          <Export />
        </Route>
      </Route>
    </Switch>
  );
};

ApdPageRoutes.defaultProps = {
  useRouteMatch: actualUseRouteMatch
};

ApdPageRoutes.propTypes = {
  useRouteMatch: PropTypes.func
};

export default ApdPageRoutes;
