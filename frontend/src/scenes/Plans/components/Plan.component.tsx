import {
  createStyles,
  Divider,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { selectPlanWithUserAndRepoOrThrow } from "plans";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";

const Plan = ({ id }: { id: string }) => {
  const classes = useStyles();
  const { plan, repo } = useSelector((state: AppState) =>
    selectPlanWithUserAndRepoOrThrow(state, id)
  );

  return (
    <div>
      <Typography variant="h5" component="h3">
        Repo: {repo.name}
      </Typography>
      <Typography variant="h2">{plan.name}</Typography>
      <Typography>{plan.description}</Typography>
      <Divider className={classes.divider} />
    </div>
  );
};

export default Plan;

const useStyles = makeStyles((theme) =>
  createStyles({
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  })
);
