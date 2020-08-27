import {
  Button,
  createStyles,
  Divider,
  Input,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { selectAllMyPlans } from "plans";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

/**
 * NOTE - We cannot use the Plan component to render my plans, because they do
 * not have a "user" or a "repo" in redux, and so the Plan component will crash
 * when trying to find non existent data from redux.
 */

const MyPlans = () => {
  const classes = useStyles();
  const myPlans = useSelector(selectAllMyPlans);

  return (
    <div>
      <Typography variant="h1">My Plans</Typography>
      <Typography>
        This app is a work in progress. Please bear with us while we improve it.
      </Typography>
      <Typography variant="h2">Sharing</Typography>
      <Typography>
        To share your plans with others, give them this URL.
      </Typography>
      <Typography>
        <Input fullWidth value="https://plans.tld/user/123" />
      </Typography>
      <Divider className={classes.divider} />
      <Typography variant="h2">Plans</Typography>
      <Typography className={classes.addNew}>
        <Button variant="contained" to="/plans/new" component={Link}>
          Add a new plan
        </Button>
      </Typography>
      {myPlans.map((plan) => (
        <div key={plan.id}>
          <Typography variant="h3">{plan.name}</Typography>
          <Typography>{plan.description}</Typography>
          <Divider className={classes.divider} />
        </div>
      ))}
    </div>
  );
};

export default MyPlans;

const useStyles = makeStyles((theme) =>
  createStyles({
    addNew: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  })
);
