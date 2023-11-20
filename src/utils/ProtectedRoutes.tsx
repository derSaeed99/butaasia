import { Navigate } from "react-router-dom";

import { User } from "firebase/auth";

interface PrivateRouteProps {
  user: User | null;
  children: React.ReactElement;
}

export default function PrivateRoute({ user, children }: PrivateRouteProps) {
  if (!user) {
    // Redirect to the sign-in page if the user is not authenticated
    return <Navigate to="/signin" />;
  }

  // Render the protected routes if the user is authenticated
  return children;
}
