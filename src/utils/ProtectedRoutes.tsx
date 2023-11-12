import { Navigate } from 'react-router-dom';

import { auth } from '../firebase';

interface PrivateRouteProps {
  children: React.ReactElement;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  return auth.currentUser ? children : <Navigate to="/signin" />;
}
