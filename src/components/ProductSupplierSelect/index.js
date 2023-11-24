import React, { useEffect, useReducer, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText, InputLabel } from "@material-ui/core";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(() => ({
  btnWrapper: {
    position: "relative",
  },
  formControl: {
    minWidth: 120,
    minHeight: 80,
  },
}));

const initialState = {
  suppliers: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_SUPPLIERS":
      return { ...state, suppliers: action.payload };
    default:
      return state;
  }
};

const ProductSupplierSelect = ({ selectedSupplierId, onChange }) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchSuppliers = async () => {
        try {
          const { data } = await api.get("/suppliers", {});
          dispatch({ type: "LOAD_SUPPLIERS", payload: data.suppliers });
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchSuppliers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, []);

  console.log("selectsuipplioerID", selectedSupplierId);
  //console.log("selecasdq1231", selectedSupplier);
  const suppliers = state.suppliers;
  console.log("suppliers", suppliers);

  const selectedSupplier = suppliers.find(
    (supplier) => supplier.id === selectedSupplierId
  );

  return (
    <div
      style={{ width: 300, marginTop: 0, marginLeft: -8 }}
      className={classes.multFieldLine}
    >
      <FormControl fullWidth margin="dense" className={classes.formControl}>
        <Select
          displayEmpty
          variant="outlined"
          value={selectedSupplierId}
          onChange={handleChange}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          renderValue={() =>
            selectedSupplier && selectedSupplier.nomeFantasia
              ? selectedSupplier.nomeFantasia
              : i18n.t("productModal.form.supplier")
          }
        >
          <MenuItem dense value={null}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={""} />
          </MenuItem>
          {suppliers?.length > 0 &&
            suppliers.map((supplier) => (
              <MenuItem dense key={supplier.id} value={supplier.id}>
                <Checkbox size="small" color="primary" />
                <ListItemText primary={supplier.nomeFantasia} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ProductSupplierSelect;
