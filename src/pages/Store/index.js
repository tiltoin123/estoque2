import React, { useState, useEffect, useReducer } from "react";
import openSocket from "../../services/socket-io";

import {
  Button,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Table,
  TableHead,
  Paper,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { Edit, DeleteOutline } from "@material-ui/icons";
import MainContainer from "../../components/MainContainer";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainHeader from "../../components/MainHeader";
import { toast } from "react-toastify";
import Title from "../../components/Title";
import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";
import StoreModal from "../../components/StoreModal/index.js";
import StorePatternModal from "../../components/StorePatternModal/index.js";
import ConfirmationModal from "../../components/ConfirmationModal";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(8, 8, 3),
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
  },

  settingOption: {
    marginLeft: "auto",
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const initialState = {
  name: "",
  email: "",
  siteUrl: "",
};

const reducerForStore = (state, action) => {
  if (action.type === "LOAD_STORE") {
    const store = action.payload;
    return { ...store };
  }

  if (action.type === "UPDATE_STORE") {
    const store = action.payload;
    if (state.id === action.payload.id) {
      return { ...store };
    }
    return { ...state, ...store };
  }
  if (action.type === "RESET") {
    return initialState;
  }
};

const reducerForStorePatterns = (state, action) => {
  if (action.type === "LOAD_STOREPATTERNS") {
    const storePatterns = action.payload;
    const newStorePatterns = [];

    storePatterns.forEach((storePattern) => {
      const storePatternIndex = state.findIndex(
        (s) => s.id === storePattern.id
      );
      if (storePatternIndex !== -1) {
        state[storePatternIndex] = storePattern;
      } else {
        newStorePatterns.push(storePattern);
      }
    });

    return [...state, ...newStorePatterns];
  }

  if (action.type === "UPDATE_STOREPATTERNS") {
    const storePattern = action.payload;
    const storePatternIndex = state.findIndex((p) => p.id === storePattern.id);

    if (storePatternIndex !== -1) {
      state[storePatternIndex] = storePattern;
      return [...state];
    } else {
      return [storePattern, ...state];
    }
  }

  if (action.type === "DELETE_STOREPATTERNS") {
    const storePatternId = action.payload;
    const storePatternIndex = state.findIndex((s) => s.id === storePatternId);
    if (storePatternIndex !== -1) {
      state.splice(storePatternIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Store = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [store, dispatchStore] = useReducer(reducerForStore, []);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [storePatterns, dispatchStorePatterns] = useReducer(
    reducerForStorePatterns,
    []
  );
  const [selectedStorePattern, setSelectedStorePattern] = useState(null);
  const [storePatternModalOpen, setStorePatternModalOpen] = useState(false);
  // const [storePatterns, setStorePatterns] = useState([]);

  useEffect(() => {
    dispatchStore({ type: "RESET" });
  }, []);

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/store", {});
        dispatchStore({ type: "LOAD_STORE", payload: data });
        setLoading(false);
      } catch (err) {
        toastError(err);
      }
    };
    fetchStore();
  }, []);

  useEffect(() => {
    dispatchStorePatterns({ type: "RESET" });
  }, []);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchStorePatterns = async () => {
        try {
          const { data } = await api.get("/storePatterns");
          dispatchStorePatterns({
            type: "LOAD_STOREPATTERNS",
            payload: data.storePatterns,
          });
          setLoading(false);
        } catch (err) {
          toastError(err);
          setLoading(false);
        }
      };
      fetchStorePatterns();
    }, 500);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, []);

  useEffect(() => {
    const socket = openSocket();

    socket.on("storePatterns", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatchStorePatterns({
          type: "UPDATE_STOREPATTERNS",
          payload: data.storePattern,
        });
      }
      if (data.action === "delete") {
        dispatchStorePatterns({
          type: "DELETE_STOREPATTERNS",
          payload: +data.storePatternId,
        });
      }
    });

    socket.on("store", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatchStore({ type: "UPDATE_STORE", payload: data.store });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCloseStoreModal = () => {
    setSelectedStore(null);
    setStoreModalOpen(false);
  };

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setStoreModalOpen(true);
  };

  const handleOpenStorePatternModal = () => {
    setStorePatternModalOpen(true);
    setSelectedStorePattern(null);
  };

  const handleCloseStorePatternModal = () => {
    setSelectedStorePattern(null);
    setStorePatternModalOpen(false);
  };

  const handleEditStorePattern = (storePattern) => {
    setSelectedStorePattern(storePattern);
    setStorePatternModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedStorePattern(null);
  };

  const handleDeleteStorePattern = async (storePatternsId) => {
    try {
      await api.delete(`/storePatterns/${storePatternsId}`);
      toast.success(i18n.t("Store Pattern deleted successfully!"));
    } catch (err) {
      toastError(err);
    }
    setSelectedStorePattern(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          selectedStorePattern &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${
            selectedStorePattern.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteStorePattern(selectedStorePattern.id)}
      >
        {i18n.t("queues.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <StoreModal
        open={storeModalOpen}
        onClose={handleCloseStoreModal}
        aria-labelledby="form-dialog-title"
        storeId={selectedStore && selectedStore.id}
      ></StoreModal>
      <StorePatternModal
        open={storePatternModalOpen}
        onClose={handleCloseStorePatternModal}
        aria-labelledby="form-dialog-title"
        storePatternsId={selectedStorePattern && selectedStorePattern.id}
      ></StorePatternModal>
      <MainHeader>
        <Title>{i18n.t("store.title")}</Title>
        <MainHeaderButtonsWrapper></MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">{i18n.t("store.name")}</TableCell>
              <TableCell align="center">{i18n.t("store.email")}</TableCell>
              <TableCell align="center">{i18n.t("store.site")}</TableCell>
              <TableCell align="center">
                {i18n.t("connections.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">{store.name}</TableCell>
              <TableCell align="center">{store.email}</TableCell>
              <TableCell align="center">{store.siteUrl}</TableCell>
              <TableCell align="center">
                <IconButton size="small" onClick={() => handleEditStore(store)}>
                  <Edit />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <MainHeader>
        <Title>{i18n.t("store.pattern.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenStorePatternModal}
          >
            {i18n.t("store.pattern.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                {i18n.t("store.pattern.name")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("store.pattern.utility")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("store.pattern.target")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("store.pattern.filter")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("store.pattern.pattern")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("store.pattern.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {storePatterns.length > 0 &&
                storePatterns.map((storePattern) => (
                  <TableRow key={storePattern.id}>
                    <TableCell align="center">{storePattern.name}</TableCell>
                    <TableCell align="center">{storePattern.utility}</TableCell>
                    <TableCell align="center">{storePattern.target}</TableCell>
                    <TableCell align="center">{storePattern.filter}</TableCell>
                    <TableCell align="center">{storePattern.pattern}</TableCell>

                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditStorePattern(storePattern)}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedStorePattern(storePattern);
                          setConfirmModalOpen(true);
                        }}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {loading && <TableRowSkeleton columns={4} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Store;
