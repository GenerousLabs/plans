import {
  AppBar,
  createStyles,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const Bar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            component="h1"
            color="inherit"
          >
            Generous Plans v1
          </Typography>
          <Button component={Link} to="/">
            Browse
          </Button>
          <Button component={Link} to="/plans/new">
            New Plan
          </Button>
          <Button component={Link} to="/plans/mine">
            My Plans
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  })
);

export default Bar;
