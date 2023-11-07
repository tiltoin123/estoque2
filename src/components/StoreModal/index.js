import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
  makeStyles,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    width: "100%",
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  textStoreContainer: {
    width: "100%",
  },
}));

const StoreSchema = Yup.object().shape({
  name: Yup.string()
    .min(8, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .min(8, "Too Short!")
    .required("Required"),
  siteUrl: Yup.string()
    .min(8, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
});

const StoreModal = ({ open, onClose, storeId, initialValues, onSave }) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const initialState = {
    name: "",
    email: "",
    siteUrl: "",
  };

  const [store, setStore] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchStore = async () => {
      if (initialValues) {
        setStore((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!storeId) return;

      try {
        const { data } = await api.get("/store");
        if (isMounted.current) {
          setStore(data);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchStore();
  }, [storeId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setStore(initialState);
  };

  const handleSaveStore = async (values) => {
    try {
      if (storeId) {
        await api.put("/store", values);
      }
      handleClose();
      toast.success(i18n.t("storeModal.success"));
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          {i18n.t("store.storeModal.title")}
        </DialogTitle>
        <Formik
          initialValues={store}
          enableReinitialize={true}
          validationSchema={StoreSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveStore(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.textStoreContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("store.storeModal.form.name")}
                    name="name"
                    autoFocus
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                  />
                </div>
                <div className={classes.textStoreContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("store.storeModal.form.email")}
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                  />
                </div>
                <div className={classes.textStoreContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("store.storeModal.form.siteUrl")}
                    name="siteUrl"
                    error={touched.siteUrl && Boolean(errors.siteUrl)}
                    helperText={touched.siteUrl && errors.siteUrl}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("store.storeModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {i18n.t("store.storeModal.buttons.okEdit")}

                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default StoreModal;
