import { Typography } from "@material-ui/core";
import { selectAllPlans } from "plans";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Plan from "./components/Plan.component";

const Plans = () => {
  const plans = useSelector(selectAllPlans);

  return (
    <div>
      <Typography variant="h1">Plans</Typography>
      <Typography>
        You can see who is sharing plans with you, and input new invite codes
        you have received on the <Link to="/connections">connections</Link>{" "}
        screen.
      </Typography>
      {plans.map((plan) => (
        <Plan key={plan.id} id={plan.id} />
      ))}
    </div>
  );
};

export default Plans;
