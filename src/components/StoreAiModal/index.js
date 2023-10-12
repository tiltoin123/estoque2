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
  textStoreAiContainer: {
    width: "100%",
  },
}));

const StoreAiSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  systemPrompt: Yup.string()
    .min(8, "Too Short!")
    .max(30000, "Too Long!")
    .required("Required"),
});

const StoreAiModal = ({ open, onClose, storeAiId, initialValues, onSave }) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const initialState = {
    name: "",
    systemPrompt: "",
  };

  const [storeAi, setStoreAi] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchStoreAi = async () => {
      if (initialValues) {
        setStoreAi((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      if (!storeAiId) return;

      try {
        const { data } = await api.get(`/storeai/${storeAiId}`);
        if (isMounted.current) {
          setStoreAi(data);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchStoreAi();
  }, [storeAiId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setStoreAi(initialState);
  };

  const handleSaveStoreAi = async (values) => {
    try {
      if (storeAiId) {
        await api.put(`/storeai/${storeAiId}`, values);
        handleClose();
      } else {
        const { data } = await api.post("/storeai", values);
        if (onSave) {
          onSave(data);
        }
        handleClose();
      }
      toast.success(i18n.t("storeAiModal.success"));
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
          {storeAiId
            ? `${i18n.t("storeAiModal.title.edit")}`
            : `${i18n.t("storeAiModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={storeAi}
          enableReinitialize={true}
          validationSchema={StoreAiSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveStoreAi(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.textStoreAiContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("storeAiModal.form.name")}
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
                <div className={classes.textStoreAiContainer}>
                  <Field
                    as={TextField}
                    label={i18n.t("storeAiModal.form.systemPrompt")}
                    name="systemPrompt"
                    error={touched.systemPrompt && Boolean(errors.systemPrompt)}
                    helperText={touched.systemPrompt && errors.systemPrompt}
                    variant="outlined"
                    margin="dense"
                    className={classes.textField}
                    multiline
                    rows={5}
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
                  {i18n.t("storeAiModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {storeAiId
                    ? `${i18n.t("storeAiModal.buttons.okEdit")}`
                    : `${i18n.t("storeAiModal.buttons.okAdd")}`}
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

export default StoreAiModal;
