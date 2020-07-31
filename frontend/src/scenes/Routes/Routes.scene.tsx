import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Plans from "../Plans/Plans.scene";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const Routes = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Plans} />
      </Switch>
    </Router>
  );
};

export default Routes;
