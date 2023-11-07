import React, { useEffect, useReducer, useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText } from "@material-ui/core";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";

const initialState = {
  queues: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_QUEUES":
      return { ...state, queues: action.payload };
    default:
      return state;
  }
};

const StorePatternQueueSelect = ({ selectedQueueId, onChange }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchQueues = async () => {
        try {
          const { data } = await api.get("/queue", {});
          console.log("queueselectpatternFE", data);
          dispatch({ type: "LOAD_QUEUES", payload: data });
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchQueues();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, []);

  const queues = state.queues; // Extract storeAi from the state

  return (
    <div style={{ width: 230, marginTop: -4 }}>
      <FormControl fullWidth margin="dense">
        <Select
          displayEmpty
          variant="outlined"
          value={selectedQueueId}
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
          renderValue={() => i18n.t("store.pattern.patternModal.form.target")}
        >
          <MenuItem dense value={null}>
            <Checkbox size="small" color="primary" />
            <ListItemText primary={""} />
          </MenuItem>
          {queues?.length > 0 &&
            queues.map((queue) => (
              <MenuItem dense key={queue.id} value={queue.id}>
                <Checkbox size="small" color="primary" />
                <ListItemText primary={queue.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default StorePatternQueueSelect;
