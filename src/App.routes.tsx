import { createBrowserRouter, createRoutesFromElements, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { App } from "./App";
import { MemeForm } from "./Components/MemeForm";
import { SignIn } from "./Components/SignIn";
import { auth } from "./firebase";
import { Legal } from "./Pages/Legal";
import { Privacy } from "./Pages/Privacy";
import { UserProfile } from "./Pages/UserProfile";
import { ProtectedRoute } from "./utils/ProtectedRoute";


export const getRedirectRoute = () => {
   // TODO: implement user roles and redirect accordingly, dont forget code in protectedRoute.tsx
    return "/";
   };
   

const RootRedirect = () => {
    const user = auth.currentUser
    if (!user) {
      return (
        <Routes>
          <Route path={"/"} element={<App />} />
        </Routes>
      );
    }
    return <Navigate to={getRedirectRoute()} replace />;
   };
   
   
const SignInRedirect = () => {
    const user = auth.currentUser
    const location = useLocation();
    const redirect = location.state?.from;
    return user ? <Navigate to={redirect || "/"} /> : <SignIn />;
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute />
          }>
            <Route path="/profile" element={<UserProfile />} />
        </Route>
        <Route
          path="/form"
          element={
            <ProtectedRoute />
          }>
            <Route path="/form" element={<MemeForm />} />
        </Route>
        <Route path="" element={<RootRedirect />} />
        <Route path="signin" element={<SignInRedirect />} />
        <Route path="imprint" element={<Legal />} />
        <Route path="privacy" element={<Privacy />} />
    </Route>
))