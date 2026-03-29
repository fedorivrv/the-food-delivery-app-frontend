import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

export const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};