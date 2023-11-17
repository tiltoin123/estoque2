import React, { useState, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import openSocket from "../../services/socket-io";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import SupplierModal from "../../components/SupplierModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";

const reducer = (state, action) => {
  if (action.type === "LOAD_SUPPLIERS") {
    const suppliers = action.payload;
    const newSuppliers = [];

    suppliers.forEach((supplier) => {
      const supplierIndex = state.findIndex((s) => s.id === supplier.id);
      if (supplierIndex !== -1) {
        state[supplierIndex] = supplier;
      } else {
        newSuppliers.push(supplier);
      }
    });

    return [...state, ...newSuppliers];
  }

  if (action.type === "UPDATE_SUPPLIERS") {
    console.log("aç~~ update", action);
    const supplier = action.payload;
    const supplierIndex = state.findIndex((s) => s.id === supplier.id);
    if (supplierIndex !== -1) {
      state[supplierIndex] = supplier;
      return [...state];
    } else {
      return [supplier, ...state];
    }
  }

  if (action.type === "DELETE_SUPPLIER") {
    const supplierId = action.payload;

    const supplierIndex = state.findIndex((s) => s.id === supplierId);
    if (supplierIndex !== -1) {
      state.splice(supplierIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const Suppliers = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [suppliers, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchSuppliers = async () => {
        try {
          const { data } = await api.get("/suppliers/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_SUPPLIERS", payload: data.suppliers });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchSuppliers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("supplier", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_SUPPLIERS", payload: data.supplier });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_SUPPLIER", payload: +data.supplierId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenSupplierModal = () => {
    setSelectedSupplier(null);
    setSupplierModalOpen(true);
  };

  const handleCloseSupplierModal = () => {
    setSelectedSupplier(null);
    setSupplierModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditSupplier = (supplier) => {
    console.log("handle edit ", supplier);
    setSelectedSupplier(supplier);
    setSupplierModalOpen(true);
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      await api.delete(`/suppliers/${supplierId}`);
      toast.success(i18n.t("supplierId.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingSupplier(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingSupplier &&
          `${i18n.t("suppliers.confirmationModal.deleteTitle")} ${
            deletingSupplier.nomeFantasia
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteSupplier(deletingSupplier.id)}
      >
        {i18n.t("suppliers.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <SupplierModal
        open={supplierModalOpen}
        onClose={handleCloseSupplierModal}
        aria-labelledby="form-dialog-title"
        supplierId={selectedSupplier && selectedSupplier.id}
      />
      <MainHeader>
        <Title>{i18n.t("suppliers.title")}</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenSupplierModal}
          >
            {i18n.t("suppliers.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
        style={{ overflowX: "auto" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                {i18n.t("suppliers.table.razaoSocial")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("suppliers.table.nomeFantasia")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("suppliers.table.tipoJur")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("suppliers.table.telefone")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("suppliers.table.email")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("suppliers.table.endereco")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("suppliers.table.cnpj")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("suppliers.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell align="center">{supplier.razaoSocial}</TableCell>
                  <TableCell align="center">{supplier.nomeFantasia}</TableCell>
                  <TableCell align="center">{supplier.tipoJur}</TableCell>
                  <TableCell align="center">{supplier.telefone}</TableCell>
                  <TableCell align="center">{supplier.email}</TableCell>
                  <TableCell align="center">{supplier.endereco}</TableCell>
                  <TableCell align="center">{supplier.cnpj}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditSupplier(supplier)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingSupplier(supplier);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={7} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Suppliers;
