import { Container } from "@material-ui/core";
import { createBrowserHistory } from "history";
import React from "react";
import { useSelector } from "react-redux";
import { Route, Router, Switch } from "react-router-dom";
import { AppState } from "../../store";
import Bar from "../Bar/Bar.scene";
import Connections from "../Connections/Connections.scene";
import MyPlans from "../MyPlans/MyPlans.scene";
import PlanForm from "../PlanForm/PlanForm.scene";
import Plans from "../Plans/Plans.scene";
import Welcome from "../Welcome/Welcome.scene";

export const history = createBrowserHistory();

const Routes = () => {
  const hasLoaded = useSelector(
    (state: AppState) => state.__plans.startup.initCompleted
  );

  return (
    <Router history={history}>
      <Bar />
      <Container>
        {hasLoaded ? (
          <Switch>
            <Route path="/" exact component={Welcome} />
            <Route path="/plans" exact component={Plans} />
            <Route path="/connections" exact component={Connections} />
            <Route path="/plans/mine" exact component={MyPlans} />
            <Route path="/plans/new" exact component={PlanForm} />
          </Switch>
        ) : (
          <Welcome loading={!hasLoaded} />
        )}
      </Container>
    </Router>
  );
};

export default Routes;
