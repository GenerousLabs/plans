import { Button } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import Noty from "noty";
import { createNewRepo } from "plans";
import React from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { parseRepoSharingKey } from "../../../../services/key/key.service";
import { addPlanConfigs, AppDispatch } from "../../../../store";

const schema = yup.object().shape({
  name: yup.string().required(),
  invite: yup.string().required(),
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
          try {
            const { name, invite } = values;
            const remote = parseRepoSharingKey(invite);
            dispatch(
              createNewRepo(
                addPlanConfigs({
                  repo: {
                    name,
                    remote,
                  },
                })
              )
            );
            console.log("submit #3fXsT6", name, invite);
          } catch (error) {
            new Noty({
              type: "error",
              timeout: 3e3,
              layout: "topCenter",
              text: error.message,
            }).show();
          }
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
            label="Invitation code"
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
