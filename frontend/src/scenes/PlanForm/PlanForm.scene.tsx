import { Button, Typography } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { createNewMyPlan } from "plans";
import React from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { addPlanConfigs, AppDispatch } from "../../store";
import { history } from "../Routes/Routes.scene";

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
});

const initialValues = {
  name: "",
  description: "",
};

const PlanForm = () => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div>
      <Typography variant="h1">New Plan</Typography>
      <Typography>
        Please bear with us while we develop this. It's very much a work in
        progress.
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={(values, helpers) => {
          const { name, description } = values;
          dispatch(
            createNewMyPlan(
              addPlanConfigs({
                plan: {
                  name,
                  description,
                },
              })
            )
          );

          history.push("/plans/mine");
        }}
      >
        <Form>
          <Field
            name="name"
            label="Plan name"
            component={TextField}
            fullWidth
          />
          <Field
            name="description"
            label="Plan description"
            helperText="Supports markdown"
            component={TextField}
            fullWidth
            multiline
            rows={12}
          />
          <Button variant="contained" type="submit">
            Save Plan
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default PlanForm;
