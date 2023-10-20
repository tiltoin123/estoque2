import React, { useEffect, useReducer, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText } from "@material-ui/core";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";

const initialState = {
  storeAi: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_STOREAI":
      return { ...state, storeAi: action.payload };
    default:
      return state;
  }
};

const QueueStoreAiSelect = ({ selectedStoreAiId, onChange }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchStoreAi = async () => {
        try {
          const { data } = await api.get("/storeai", {});
          dispatch({ type: "LOAD_STOREAI", payload: data.storeAi });
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchStoreAi();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, []);

  const storeAi = state.storeAi; // Extract storeAi from the state

  return (
    <div style={{ width: 230, marginTop: -4 }}>
      <FormControl fullWidth margin="dense">
        <Select
          variant="outlined"
          value={selectedStoreAiId}
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
