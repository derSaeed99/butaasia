import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { App } from "./App";
import { MemeForm } from "./Components/MemeForm";
import { SignIn } from "./Components/SignIn";
import { Legal } from "./Pages/Legal";
import { Privacy } from "./Pages/Privacy";
import { ProtectedRoute } from "./utils/ProtectedRoute";

export const getRedirectRoute = () => {
  // TODO: implement user roles and redirect accordingly, dont forget code in protectedRoute.tsx
  return "/";
};

const RootRedirect = () => {
    const userInfoFromLocalStorage = localStorage.getItem("userInfo");
    const userExists = userInfoFromLocalStorage ? JSON.parse(userInfoFromLocalStorage) : null;
    
  if (!userExists) {
    return (
      <Routes>
        <Route path={"/"} element={<App />} />
      </Routes>
    );
  }
  return <Navigate to={getRedirectRoute()} replace />;
};

const SignInRedirect = () => {
    const userInfoFromLocalStorage = localStorage.getItem("userInfo");
    const userExists = userInfoFromLocalStorage ? JSON.parse(userInfoFromLocalStorage) : null;
  const location = useLocation();
  const redirect = location.state?.from;
  console.log(userExists)
  return userExists ? <Navigate to={redirect || "/"} /> : <SignIn />;
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path="/"
        lazy={async () => {
          const { HomePage } = await import("./Pages/HomePage");
          return { Component: HomePage };
        }}
      />
      <Route path="profile/*" element={<ProtectedRoute />}>
        <Route 
        path=":userId"
        lazy={async () => {
            const { UserProfile } = await import("./Pages/UserProfile");
            return { Component: UserProfile };
        }} />
      </Route>
      <Route path="/form" element={<ProtectedRoute />}>
        <Route path="/form" element={<MemeForm />} />
      </Route>
      <Route path="" element={<RootRedirect />} />
      <Route path="signin" element={<SignInRedirect />} />
      <Route path="imprint" element={<Legal />} />
      <Route path="privacy" element={<Privacy />} />
    </Route>
  )
);
