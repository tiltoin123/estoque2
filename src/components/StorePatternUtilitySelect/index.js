import React, { useEffect, useReducer, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText } from "@material-ui/core";
import { i18n } from "../../translate/i18n";

const StorePatternUtilitySelect = ({ StorePatternUtilitySelect, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ width: 230, marginRight: 10 }}>
      <FormControl fullWidth margin="dense">
        <Select
          displayEmpty
          variant="outlined"
          value={StorePatternUtilitySelect}
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
            StorePatternUtilitySelect &&
            StorePatternUtilitySelect != "[##N/A##]"
              ? i18n.t(
                  `store.pattern.patternModal.form.utility.${StorePatternUtilitySelect}`
                )
              : i18n.t("store.pattern.patternModal.form.utility.placeholder")
          }
        >
          <MenuItem dense value={null}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={""} />
          </MenuItem>
          <MenuItem dense value={"updateTicketQueue"}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={"Mover para fila"} />
          </MenuItem>
          <MenuItem dense value={"verifyContactFullName"}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={"Editar nome completo"} />
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default StorePatternUtilitySelect;
