import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import MaskedInput from "react-text-mask";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    minHeight: 80,
  },
}));

/* const CNPJMask = ({ inputRef, ...other }) => {
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        "/",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
      ]}
      placeholderChar={"\u2000"}
      showMask
    />
  );
};

const validateCNPJ = async (cnpj) => {
  if (!cnpj || cnpj.trim() === "") {
    return false;
  }
  const cleanCNPJ = cnpj.replace(/[^\d]+/g, "");

  if (cleanCNPJ.length !== 14) {
    return false;
  }

  if (/^(\d)\1+$/.test(cleanCNPJ)) {
    return false;
  }

  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== digits.charAt(0)) {
    return false;
  }

  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== digits.charAt(1)) {
    return false;
  }

  return true;
}; */

const SupplierSchema = Yup.object().shape({
  razaoSocial: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  nomeFantasia: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  cnpj: Yup.string().min(18).required("Required"),
  tipoJur: Yup.string().required("Required"),
  endereco: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  telefone: Yup.string()
    .min(8, "Too Short!")
    .max(20, "Too Long!")
    .required("Telefone é obrigatório"),
});

const SupplierModal = ({ open, onClose, supplierId }) => {
  const classes = useStyles();

  const initialState = {
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    tipoJur: "",
    endereco: "",
    email: "",
    telefone: "",
  };

  const [supplier, setSupplier] = useState(initialState);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!supplierId) return;
      try {
        const { data } = await api.get(`/suppliers/${supplierId}`);
        setSupplier(data);
      } catch (err) {
        toastError(err);
      }
    };

    fetchSupplier();
  }, [supplierId, open]);

  const handleClose = () => {
    onClose();
    setSupplier(initialState);
  };

  const handleSaveSupplier = async (values) => {
    console.log("handle save modal", values);
    const supplierData = { ...values };
    try {
      if (supplierId) {
        await api.put(`/suppliers/${supplierId}`, supplierData);
      } else {
        await api.post("/suppliers", supplierData);
      }
      toast.success(i18n.t("supplierModal.success"));
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} fullWidth scroll="paper">
        <DialogTitle id="form-dialog-title">
          {supplierId
            ? `${i18n.t("supplierModal.title.edit")}`
            : `${i18n.t("supplierModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={supplier}
          enableReinitialize={true}
          validationSchema={SupplierSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveSupplier(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("supplierModal.form.nomeFantasia")}
                    autoFocus
                    name="nomeFantasia"
                    error={touched.nomeFantasia && Boolean(errors.nomeFantasia)}
                    helperText={touched.nomeFantasia && errors.nomeFantasia}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    name="razaoSocial"
                    variant="outlined"
                    margin="dense"
                    label={i18n.t("supplierModal.form.razaoSocial")}
                    error={touched.razaoSocial && Boolean(errors.razaoSocial)}
                    helperText={touched.razaoSocial && errors.razaoSocial}
                    fullWidth
                  />
                </div>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("supplierModal.form.email")}
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label={i18n.t("supplierModal.form.cnpj")}
                    name="cnpj"
                    fullWidth
                    error={touched.cnpj && Boolean(errors.cnpj)}
                    variant="outlined"
                    margin="dense"
                    style={{ height: 40, borderRadius: "4px" }}
                  />

                  <Field
                    as={TextField}
                    label={i18n.t("supplierModal.form.endereco")}
                    name="endereco"
                    error={touched.endereco && Boolean(errors.endereco)}
                    helperText={touched.endereco && errors.endereco}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label={i18n.t("supplierModal.form.telefone")}
                    name="telefone"
                    error={touched.telefone && Boolean(errors.telefone)}
                    helperText={touched.telefone && errors.telefone}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    margin="dense"
                  >
                    <InputLabel id="profile-selection-input-label">
                      {i18n.t("supplierModal.form.tipoJur")}
                    </InputLabel>

                    <Field
                      as={Select}
                      label={i18n.t("supplierModal.form.profile")}
                      name="tipoJur"
                      labelId="profile-selection-tipoJur"
                      id="profile-selection"
                      required
                      style={{ width: 240, marginLeft: -8 }}
                    >
                      <MenuItem value="mei">MEI</MenuItem>
                      <MenuItem value="eireli">Eireli</MenuItem>
                      <MenuItem value="ltda">Sociedade limitada</MenuItem>
                      <MenuItem value="S.A">Sociedade Anônima</MenuItem>
                    </Field>
                  </FormControl>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("supplierModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {supplierId
                    ? `${i18n.t("supplierModal.buttons.okEdit")}`
                    : `${i18n.t("supplierModal.buttons.okAdd")}`}
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

export default SupplierModal;
