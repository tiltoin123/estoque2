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
import ProductSupplierSelect from "../../components/ProductSupplierSelect";
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

/* const ProductSchema = Yup.object().shape({
  razaoSocial: Yup.string().required("Required"),
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  price: Yup.string().required("Required"),
  description: Yup.string()
    .min(2, "Too Short!")
    .max(500, "Too Long!")
    .required("Required"),
  unity: Yup.string().required("Required"),
}); */

const ProductModal = ({ open, onClose, productsId }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    price: "",
    description: "",
    unity: "1",
    quantity: "",
    supplierId: "1",
  };

  const [selectedSupplier, setSelectedSupplier] = useState();
  const [product, setProduct] = useState(initialState);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productsId) return;
      try {
        const { data } = await api.get(`/products/${productsId}`);
        setSelectedSupplier(data.supplierId);
        setProduct(data);
      } catch (err) {
        toastError(err);
      }
    };

    fetchProduct();
  }, [productsId, open]);

  const handleClose = () => {
    onClose();
    setProduct(initialState);
  };

  const handleSaveProduct = async (values) => {
    values.supplierId = selectedSupplier;
    const productData = { ...values };
    try {
      if (productsId) {
        await api.put(`/products/${productsId}`, productData);
      } else {
        await api.post("/products", productData);
      }
      toast.success(i18n.t("productModal.success"));
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} fullWidth scroll="paper">
        <DialogTitle id="form-dialog-title">
          {productsId
            ? `${i18n.t("productModal.title.edit")}`
            : `${i18n.t("productModal.title.add")}`}
        </DialogTitle>
        <Formik
          initialValues={product}
          enableReinitialize={true}
          //validationSchema={ProductSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveProduct(values);
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
                    name="name"
                    variant="outlined"
                    margin="dense"
                    label={i18n.t("productModal.form.name")}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    fullWidth
                  />
                </div>
                <div className={classes.multFieldLine}>
                  <Field
                    as={TextField}
                    label={i18n.t("productModal.form.price")}
                    name="price"
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <Field
                    as={TextField}
                    label={i18n.t("productModal.form.description")}
                    name="description"
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                  <InputLabel id="profile-selection-input-label">
                    {i18n.t("productModal.form.unity")}
                  </InputLabel>
                  <Field
                    as={Select}
                    label={i18n.t("productModal.form.unity")}
                    name="unity"
                    labelId="unity-selection-label"
                    id="unity-selection"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  >
                    <MenuItem value="metro">Metro</MenuItem>
                    <MenuItem value="kilograma">kilograma</MenuItem>
                    <MenuItem value="unidade">Unidade</MenuItem>
                  </Field>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    margin="dense"
                  >
                    <Field
                      as={TextField}
                      label={i18n.t("productModal.form.quantity")}
                      autoFocus
                      name="quantity"
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      style={{ width: 300, marginTop: 0, marginLeft: -8 }}
                    />
                    <ProductSupplierSelect
                      selectedSupplierId={selectedSupplier}
                      onChange={(value) => setSelectedSupplier(value)}
                    />
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
                  {i18n.t("productModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  {productsId
                    ? `${i18n.t("productModal.buttons.okEdit")}`
                    : `${i18n.t("productModal.buttons.okAdd")}`}
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

export default ProductModal;
