import React from "react";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectAllPlans, selectAllUsers } from "plans";
import Plan from "./components/Plan.component";

const Plans = () => {
  const plans = useSelector(selectAllPlans);

  return (
    <div>
      <Typography variant="h1">Plans</Typography>
      <ul>
        {plans.map((plan) => (
          <Plan key={plan.id} id={plan.id} />
        ))}
      </ul>
    </div>
  );
};

export default Plans;
