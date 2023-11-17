import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LoggedInLayout from "../layout";

import Signup from "../pages/Signup/";
import Login from "../pages/Login/";
import Verify from "../pages/Verify";
import Users from "../pages/Users";
import { AuthProvider } from "../context/Auth/AuthContext";
import Route from "./Route";
import Suppliers from "../pages/Suppliers";
import Products from "../pages/Products";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/verify/:confirmationToken?" component={Verify} />
          <LoggedInLayout>
            <Route exact path="/products" component={Products} isPrivate />
            <Route exact path="/users" component={Users} isPrivate />
            <Route exact path="/suppliers" component={Suppliers} isPrivate />
          </LoggedInLayout>
        </Switch>
        <ToastContainer autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
