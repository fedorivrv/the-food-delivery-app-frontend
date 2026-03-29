import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '@/app/login/page';
import { Orders } from '@/app/orders/page';
import { PrivateRoute } from '@/components/PrivateRoute/PrivateRoute';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};