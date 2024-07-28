import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import isAdminAuthenticated from './utils/isAdminAuthenticated'; // Import the function

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAdminAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="dash" />
      )
    }
  />
);

export default ProtectedRoute;
