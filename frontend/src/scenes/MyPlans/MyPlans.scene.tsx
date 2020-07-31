import { Typography } from "@material-ui/core";
import { selectAllMyPlans } from "plans";
import React from "react";
import { useSelector } from "react-redux";

const MyPlans = () => {
  const myPlans = useSelector(selectAllMyPlans);

  return (
    <div>
      <Typography variant="h1">My Plans</Typography>
      <Typography>
        This app is a work in progress. Please bear with us while we improve it.
      </Typography>
      <ul>
        {myPlans.map((plan) => (
          <li key={plan.id}>{plan.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyPlans;
