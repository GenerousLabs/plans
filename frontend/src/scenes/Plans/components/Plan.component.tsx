import { Typography } from "@material-ui/core";
import { selectPlanWithUserOrThrow } from "plans";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";

const Plan = ({ id }: { id: string }) => {
  const { plan, user } = useSelector((state: AppState) =>
    selectPlanWithUserOrThrow(state, id)
  );

  return (
    <div>
      <Typography variant="h3">{user.name}</Typography>
      <Typography variant="h2">{plan.name}</Typography>
      <Typography>{plan.description}</Typography>
    </div>
  );
};

export default Plan;
