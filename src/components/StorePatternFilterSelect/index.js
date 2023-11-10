import React, { useEffect, useReducer, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText } from "@material-ui/core";
import { i18n } from "../../translate/i18n";

const StorePatternFilterSelect = ({ selectedStorePatternFilter, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ width: 230, marginRight: 10 }}>
      <FormControl fullWidth margin="dense">
        <Select
          displayEmpty
          variant="outlined"
          value={selectedStorePatternFilter}
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
            selectedStorePatternFilter &&
            selectedStorePatternFilter !== "[##N/A##]"
              ? i18n.t(
                  `store.pattern.patternModal.form.filter.${selectedStorePatternFilter}`
                )
              : i18n.t("store.pattern.patternModal.form.filter.placeholder")
          }
        >
          <MenuItem dense value={null}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={""} />
          </MenuItem>
          <MenuItem dense value={"startsWith"}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={"inicia com"} />
          </MenuItem>
          <MenuItem dense value={"finishesWith"}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={"termina com"} />
          </MenuItem>
          <MenuItem dense value={"contains"}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={"contém"} />
          </MenuItem>
          <MenuItem dense value={"exactMatch"}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={"correspondência exata"} />
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default StorePatternFilterSelect;
