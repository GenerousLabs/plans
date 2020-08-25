import { Typography } from "@material-ui/core";
import { selectAllPlans } from "plans";
import React from "react";
import { useSelector } from "react-redux";
import Plan from "./components/Plan.component";

const Plans = () => {
  const plans = useSelector(selectAllPlans);

  return (
    <div>
      <Typography variant="h1">Plans</Typography>
      {plans.map((plan) => (
        <Plan key={plan.id} id={plan.id} />
      ))}
    </div>
  );
};

export default Plans;
