import {
  Typography,
  Paper,
  makeStyles,
  createStyles,
  Button,
  Divider,
} from "@material-ui/core";
import { selectAllRepos } from "plans";
import React from "react";
import { useSelector } from "react-redux";

const Connections = () => {
  const classes = useStyles();
  const repos = useSelector(selectAllRepos);

  return (
    <div>
      <Typography variant="h1">Connections</Typography>
      <Typography>
        You can <strong>invite your friends</strong> to share your plans. You
        can also paste invitations that you have received.
      </Typography>
      <Typography variant="h2" className={classes.h2}>
        Invitations
      </Typography>
      <Typography>
        Invitations you have sent to others are listed here.
      </Typography>
      {/* <Paper elevation={1} className={classes.paper}> */}
      <Typography variant="h3">Create a new invitation</Typography>
      <Typography>
        Enter the name of the person you want to share your plans with:
      </Typography>
      <Typography>
        <input type="text" />
      </Typography>
      <Typography>
        <Button variant="contained" onClick={() => {}}>
          Submit
        </Button>
      </Typography>
      {/* </Paper> */}
      <Divider className={classes.divider} />
      <Typography variant="h2" className={classes.h2}>
        Received
      </Typography>
      <Typography>
        The invitations you have <strong>received</strong> are listed here.
      </Typography>
      {repos.map((repo) => (
        <Paper key={repo.id} elevation={1} className={classes.paper}>
          <Typography variant="h3">{repo.name}</Typography>
          <Typography>
            <Button variant="contained" size="small">
              Delete
            </Button>
          </Typography>
        </Paper>
      ))}
      {/* <Paper elevation={1} className={classes.paper}> */}
      <Typography variant="h3">Import a new invite</Typography>
      <Typography>Enter your invite text here:</Typography>
      <Typography>
        <input type="text" />
      </Typography>
      <Typography>
        <Button variant="contained" onClick={() => {}}>
          Submit
        </Button>
      </Typography>
      {/* </Paper> */}
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
