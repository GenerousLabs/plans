import {
  Button,
  createStyles,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { selectAllRepos } from "plans";
import React from "react";
import { useSelector } from "react-redux";
import RepoForm from "./scenes/RepoForm/RepoForm.scene";

const Connections = () => {
  const classes = useStyles();
  const repos = useSelector(selectAllRepos);

  return (
    <div>
      <Typography variant="h1">Connections</Typography>
      <Typography variant="h2">Import</Typography>
      <Typography>
        When a friend sends you an invite code, enter it here:
      </Typography>
      <Paper className={classes.paper} elevation={1}>
        <RepoForm />
      </Paper>
      <Typography variant="h2" className={classes.h2}>
        Current
      </Typography>
      <Typography>
        You are currently viewing plans from the following connections.
      </Typography>
      {repos.map((repo) => (
        <Paper key={repo.id} elevation={1} className={classes.paper}>
          <Typography variant="h3">{repo.name}</Typography>
          <Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                alert(
                  "Sorry, deleting is still a work in progress. " +
                    "Please let us know if you need this urgently " +
                    "and we'll implement it as soon as possible."
                );
              }}
            >
              Delete
            </Button>
          </Typography>
        </Paper>
      ))}
    </div>
  );
};

export default Connections;

const useStyles = makeStyles((theme) =>
  createStyles({
    h2: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(1),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    divider: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(8),
    },
  })
);
