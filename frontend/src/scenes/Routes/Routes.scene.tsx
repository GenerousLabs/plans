import { CircularProgress, Container } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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

const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.loadingWrapper}>
      <CircularProgress size="6rem" />
    </div>
  );
};

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
          <Loading />
        )}
      </Container>
    </Router>
  );
};

export default Routes;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      flexGrow: 1,
    },
    loadingWrapper: {
      width: "100vw",
      height: "100vh",
      position: "absolute",
      top: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: -1,
    },
  })
);
