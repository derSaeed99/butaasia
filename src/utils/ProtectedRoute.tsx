import { Navigate, Outlet, useLocation } from "react-router-dom";


export interface ProtectedRouteProps {
  permittedRoles?: string[];
}

export const ProtectedRoute = () => {
  const location = useLocation();
  const userInfoFromLocalStorage = localStorage.getItem("userInfo");
  const userExists = userInfoFromLocalStorage ? JSON.parse(userInfoFromLocalStorage) : null;
  // const canOpen = () =>
  //   Boolean(authUser && user && (!permittedRoles || permittedRoles.includes(user.role ?? "")));

  const from = `${location?.pathname}${
    location?.search ? location?.search : ""
  }`;
  return (
    <>
      {userExists ? (
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
