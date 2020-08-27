import { Button } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { createNewRepo } from "plans";
import React from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { addPlanConfigs, AppDispatch } from "../../../../store";

const schema = yup.object().shape({
  name: yup.string().required(),
  invite: yup.string().url().required(),
});

const initialValues = {
  name: "",
  invite: "",
};

const RepoForm = () => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values, helpers) => {
          const { name, invite } = values;
          dispatch(
            createNewRepo(
              addPlanConfigs({
                repo: {
                  name,
                  remote: invite,
                },
              })
            )
          );
          console.log("submit #3fXsT6", name, invite);
          helpers.resetForm();
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
