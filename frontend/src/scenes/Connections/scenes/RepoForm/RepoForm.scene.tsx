import React from "react";
import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { Button } from "@material-ui/core";

const schema = yup.object().shape({
  name: yup.string().required(),
  invite: yup.string().url().required(),
});

const initialValues = {
  name: "",
  invite: "",
};

const RepoForm = () => {
  return (
    <div>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values, helpers) => {
          const { name, invite } = values;
          console.log("submit #3fXsT6", name, invite);
        }}
      >
        <Form>
          <Field
            name="name"
            label="Connection name"
            component={TextField}
            fullWidth
          />
          <Field
            name="invite"
            label="Invitation URL"
            component={TextField}
            fullWidth
          />
          <Button variant="contained" type="submit">
            Create Connection
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default RepoForm;
