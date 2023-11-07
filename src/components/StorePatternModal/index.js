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

const StorePatternSchema = Yup.object().shape({
  name: Yup.string()
    .min(8, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  utility: Yup.string().min(3, "Too Short!").required("Required"),
  pattern: Yup.string()
    .min(3, "Too Short!")
    .max(500, "Too Long!")
    .required("Required"),
});

const StorePatternModal = ({
  open,
  onClose,
  storePatternsId,
  initialValues,
  onSave,
}) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const initialState = {
    name: "",
    utility: "",
    pattern: "",
  };

  const [storePatterns, setStorePatterns] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchStorePatterns = async () => {
      if (initialValues) {
        setStorePatterns((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!storePatternsId) return;

      try {
        const { data } = await api.get(`/storePatterns/${storePatternsId}`);
        if (isMounted.current) {
          setStorePatterns(data);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchStorePatterns();
  }, [storePatternsId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setStorePatterns(initialState);
  };

  const handleSaveStorePattern = async (values) => {
    try {
      if (storePatternsId) {
        await api.put(`/storePatterns/${storePatternsId}`, values);
      } else {
        await api.post("/storePatterns", values);
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
          {storePatternsId
            ? `${i18n.t("storeModal.title.edit")}`
            : `${i18n.t("storeModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={storePatterns}
          enableReinitialize={true}
          validationSchema={StorePatternSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveStorePattern(values);
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
                    label={i18n.t("storeModal.form.name")}
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
                    label={i18n.t("storeModal.form.utility")}
                    name="utility"
                    error={touched.utility && Boolean(errors.utility)}
                    helperText={touched.utility && errors.utility}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    fullWidth
                  />
                </div>
                <div className={classes.textStoreContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("storeModal.form.pattern")}
                    name="pattern"
                    error={touched.pattern && Boolean(errors.pattern)}
                    helperText={touched.pattern && errors.pattern}
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
                  {i18n.t("storeModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {storePatternsId
                    ? `${i18n.t("storeModal.buttons.okEdit")}`
                    : `${i18n.t("storeModal.buttons.okAdd")}`}
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

export default StorePatternModal;
