import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText } from "@material-ui/core";
import { i18n } from "../../translate/i18n";

const QueueStoreAiSelect = ({ storeAi, selectedStoreAiIds, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ width: 230, marginTop: -4 }}>
      <FormControl fullWidth margin="dense">
        <Select
          variant="outlined"
          value={selectedStoreAiIds}
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
          renderValue={() => i18n.t("queueStoreAiSelect.placeholder")}
        >
          <MenuItem dense value={null}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={""} />
          </MenuItem>
          {storeAi?.length > 0 &&
            storeAi.map((storeAi) => (
              <MenuItem dense key={storeAi.id} value={storeAi.id}>
                <Checkbox size="small" color="primary" />
                <ListItemText primary={storeAi.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default QueueStoreAiSelect;
