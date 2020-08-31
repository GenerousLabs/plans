import {
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";

const Welcome = ({ loading }: { loading: boolean }) => {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h1" component="h2">
        Welcome
      </Typography>
      <Typography>
        Share your digital plans (accounts) with people you love and trust.
      </Typography>
      <Typography>
        Right now this is a <strong>private beta</strong> and a{" "}
        <strong>test server</strong>. Any data you enter here might become
        public, and might be lost at any time. This is very experimental
        software!
      </Typography>
      <Typography variant="h3">Getting started</Typography>
      <Typography>Follow these steps to get started.</Typography>
      <Typography>1: Tell Callum what username you would like.</Typography>
      <Typography>
        2: Once Callum sends you an activation code, reload this page.
      </Typography>
      <Typography>3: Enter the activation code.</Typography>
      <Typography>
        4: Go to the "My Plans" section, click "Add a plan", and add some plans.
      </Typography>
      <Typography>
        5: Send the sharing code from the My Plans page to friends who also have
        an account.
      </Typography>
      {loading ? (
        <div className={classes.loadingWrapper}>
          <CircularProgress size="6rem" />
        </div>
      ) : null}
    </div>
  );
};

export default Welcome;

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
      zIndex: 100,
      opacity: 0.5,
      backgroundColor: "black",
    },
  })
);
