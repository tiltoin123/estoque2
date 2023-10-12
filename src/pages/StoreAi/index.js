import React, { useEffect, useReducer, useState } from "react";

import openSocket from "../../services/socket-io";

import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { DeleteOutline, Edit } from "@material-ui/icons";
import StoreAiModal from "../../components/StoreAiModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_STOREAI") {
    const storeAi = action.payload;
    const newStoreAi = [];

    storeAi.forEach((storeAi) => {
      const storeAiIndex = state.findIndex((s) => s.id === storeAi.id);
      if (storeAiIndex !== -1) {
        state[storeAiIndex] = storeAi;
      } else {
        newStoreAi.push(storeAi);
      }
    });

    return [...state, ...newStoreAi];
  }

  if (action.type === "UPDATE_STOREAI") {
    const storeAi = action.payload;
    const storeAiIndex = state.findIndex((u) => u.id === storeAi.id);

    if (storeAiIndex !== -1) {
      state[storeAiIndex] = storeAi;
      return [...state];
    } else {
      return [storeAi, ...state];
    }
  }

  if (action.type === "DELETE_STOREAI") {
    const storeAiId = action.payload;
    const storeAiIndex = state.findIndex((s) => s.id === storeAiId);
    if (storeAiIndex !== -1) {
      state.splice(storeAiIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const StoreAi = () => {
  const classes = useStyles();

  const [storeAi, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);

  const [storeAiModalOpen, setStoreAiModalOpen] = useState(false);
  const [selectedStoreAi, setSelectedStoreAiOpen] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/storeai");
        dispatch({ type: "LOAD_STOREAI", payload: data });

        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const socket = openSocket();

    socket.on("storeai", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_STOREAI", payload: data.storeAi });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_STOREAI", payload: data.storeAi });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenStoreAiModal = () => {
    setStoreAiModalOpen(true);
    setSelectedStoreAiOpen(null);
  };

  const handleCloseStoreAiModal = () => {
    setStoreAiModalOpen(false);
    setSelectedStoreAiOpen(null);
  };

  const handleEditStoreAi = (storeAi) => {
    setSelectedStoreAiOpen(storeAi);
    setStoreAiModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedStoreAiOpen(null);
  };

  const handleDeleteStoreAi = async (storeAiId) => {
    try {
      await api.delete(`/storeai/${storeAiId}`);
      toast.success(i18n.t("storeai deleted successfully!"));
    } catch (err) {
      toastError(err);
    }
    setSelectedStoreAiOpen(null);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          selectedStoreAi &&
          `${i18n.t("storeAi.confirmationModal.deleteTitle")} ${
            selectedStoreAi.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteStoreAi(selectedStoreAi.id)}
      >
        {i18n.t("storeAi.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <StoreAiModal
        open={storeAiModalOpen}
        onClose={handleCloseStoreAiModal}
        storeAiId={selectedStoreAi && selectedStoreAi.id}
      ></StoreAiModal>
      <MainHeader>
        <Title>{i18n.t("storeAi.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenStoreAiModal}
          >
            {i18n.t("storeAi.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                {i18n.t("storeAi.table.name")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("storeAi.table.systemPrompt")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("storeAi.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {storeAi.map((storeAi) => (
                <TableRow key={storeAi.id}>
                  <TableCell align="center">{storeAi.name}</TableCell>
                  <TableCell align="center">{storeAi.systemPrompt}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditStoreAi(storeAi)}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedStoreAiOpen(storeAi);
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

export default StoreAi;
