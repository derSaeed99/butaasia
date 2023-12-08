import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { App } from "./App";
import { AppBar } from "./Components/AppBar";
import { Products } from "./Pages/Products";
import { ProductDetails } from "./Store/ProductDetails";
import { products } from "./Store/ProductsList";
import { BottomBar } from "./utils/BottomBar";
import { AboutUs } from "./Views/AboutUs";
import { CartView } from "./Views/CartView";
import { Contact } from "./Views/Contact";

export const getRedirectRoute = () => {
  // TODO: implement user roles and redirect accordingly, dont forget code in protectedRoute.tsx
  return "/";
};

const RootRedirect = () => {
  const userInfoFromLocalStorage = localStorage.getItem("userInfo");
  const userExists = userInfoFromLocalStorage
    ? JSON.parse(userInfoFromLocalStorage)
    : null;

  if (!userExists) {
    return (
      <Routes>
        <Route path={"/"} element={<App />} />
      </Routes>
    );
  }
  return <Navigate to={getRedirectRoute()} replace />;
};

// const SignInRedirect = () => {
//   const userInfoFromLocalStorage = localStorage.getItem("userInfo");
//   const userExists = userInfoFromLocalStorage
//     ? JSON.parse(userInfoFromLocalStorage)
//     : null;
//   const location = useLocation();
//   const redirect = location.state?.from;
//   console.log(userExists);
//   return userExists ? <Navigate to={redirect || "/"} /> : <SignIn />;
// };

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<><AppBar/><BottomBar/><App /></>}>
      <Route
        path="/"
        lazy={async () => {
          const { Home } = await import("./Pages/Home");
          return { Component: Home };
        }}
      />
      <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/products/:productId"
            element={<ProductDetails products={products} />}
          />
          <Route path="/cart" element={<CartView />} />
            <Route path="" element={<RootRedirect />} />
      {/* <Route path="profile/*" element={<ProtectedRoute />}>
        <Route
          path=":userId"
          lazy={async () => {
            const { UserProfile } = await import("./Pages/UserProfile");
            return { Component: UserProfile };
          }}
        />
      </Route> */}
      {/* <Route path="/form" element={<ProtectedRoute />}>
        <Route path="/form" element={<MemeForm />} />
      </Route> */}
      {/* <Route path="signin" element={<SignInRedirect />} /> */}
    </Route>
  )
);
