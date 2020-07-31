import React from "react";
import { Typography, Button } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { TextField } from "formik-material-ui";

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
});

const initialValues = {
  name: "",
  description: "",
};

const PlanForm = () => {
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
        onSubmit={() => {
          debugger;
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
            rows={4}
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
