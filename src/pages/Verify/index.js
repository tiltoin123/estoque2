import React, { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  Avatar,
  Button,
  CssBaseline,
  Box,
  Typography,
  Container,
  Link,
} from "@material-ui/core";

import { LockOutlined } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Verify = () => {
  const classes = useStyles();
  const { confirmationToken } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.post(`/verify/${confirmationToken}`);
        // Optionally, you can add logic to handle the response here
      } catch (error) {
        toast.error("Email verification failed.");
      }
    };

    // Call the verifyEmail function when the component is mounted
    verifyEmail();
  }, [confirmationToken]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {i18n.t("verify.verifiedMessage")}
        </Typography>
        <Link href="#" variant="body2" component={RouterLink} to="/login">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {i18n.t("verify.buttons.login")}
          </Button>
        </Link>
      </div>
      <Box mt={8}>{/* <Copyright /> */}</Box>
    </Container>
  );
};

export default Verify;
