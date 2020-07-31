import {
  Typography,
  Divider,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { selectAllMyPlans } from "plans";
import React from "react";
import { useSelector } from "react-redux";

const MyPlans = () => {
  const classes = useStyles();
  const myPlans = useSelector(selectAllMyPlans);

  return (
    <div>
      <Typography variant="h1">My Plans</Typography>
      <Typography>
        This app is a work in progress. Please bear with us while we improve it.
      </Typography>
      {myPlans.map((plan) => (
        <div key={plan.id}>
          <Typography variant="h2">{plan.name}</Typography>
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
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  })
);
