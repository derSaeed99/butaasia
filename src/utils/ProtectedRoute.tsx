import { Navigate, Outlet, useLocation } from "react-router-dom";

import { auth } from "../firebase";

export interface ProtectedRouteProps {
  permittedRoles?: string[];
}

export const ProtectedRoute = () => {
  const location = useLocation();

  // const canOpen = () =>
  //   Boolean(authUser && user && (!permittedRoles || permittedRoles.includes(user.role ?? "")));

  const from = `${location?.pathname}${
    location?.search ? location?.search : ""
  }`;
  return (
    <>
      {auth ? (
        <Outlet />
      ) : (
        <Navigate
          replace={true}
          state={{ from }}
          to={{
            pathname: "/signin",
          }}
        />
      )}
    </>
  );
};
