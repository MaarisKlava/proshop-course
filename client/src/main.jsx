import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
// REDUX
import { Provider } from 'react-redux';
import store from './store.js';
// PAYPAL
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import {
  HomePage,
  ProductPage,
  CartPage,
  LoginPage,
  RegisterPage,
  ShippingPage,
  PaymentPage,
  PlaceOrderPage,
  OrderListPage,
  OrderPage,
  ProfilePage,
  ProductListPage,
  ProductEditPage,
  UserListPage,
} from './pages';
import { PrivateRoute, AdminRoute } from './components';
import UserEditPage from './pages/admin/UserEditPage.jsx';
import { HelmetProvider } from 'react-helmet-async';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/search/:keyword' element={<HomePage />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomePage />} />
      <Route path='/page/:pageNumber' element={<HomePage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      {/* https://blog.probirsarkar.com/privateroute-in-react-router-v6-how-to-create-protected-routes-in-your-react-app-bcda4c409360 */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/placeorder' element={<PlaceOrderPage />} />
        <Route path='/order/:id' element={<OrderPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderListPage />} />
        <Route path='/admin/productlist' element={<ProductListPage />} />
        <Route
          path='/admin/productlist/:pageNumber'
          element={<ProductListPage />}
        />
        <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
        <Route path='/admin/userlist' element={<UserListPage />} />
        <Route path='/admin/user/:id/edit' element={<UserEditPage />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={false}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
