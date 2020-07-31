import { CircularProgress, Container } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { createBrowserHistory } from "history";
import React from "react";
import { useSelector } from "react-redux";
import { Route, Router, Switch } from "react-router-dom";
import { AppState } from "../../store";
import Plans from "../Plans/Plans.scene";

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
      <Container>
        {hasLoaded ? (
          <Switch>
            <Route path="/" exact component={Plans} />
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
