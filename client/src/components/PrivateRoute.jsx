import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // The replace prop in the Navigate component means that navigating to the new location will replace the current entry in the history stack instead of adding a new one. This is similar to how window.location.replace works in the browser.
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};
export default PrivateRoute;
