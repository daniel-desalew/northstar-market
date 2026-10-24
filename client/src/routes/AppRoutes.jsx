import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute.jsx'
import Addresses from '../pages/Addresses.jsx'
import AdminCategories from '../pages/admin/AdminCategories.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminOrders from '../pages/admin/AdminOrders.jsx'
import AdminProducts from '../pages/admin/AdminProducts.jsx'
import AdminUsers from '../pages/admin/AdminUsers.jsx'
import CreateProduct from '../pages/admin/CreateProduct.jsx'
import EditProduct from '../pages/admin/EditProduct.jsx'
import Entertainment from '../pages/Entertainment.jsx'
import Cart from '../pages/Cart.jsx'
import Category from '../pages/Category.jsx'
import Checkout from '../pages/Checkout.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import MyOrders from '../pages/MyOrders.jsx'
import NotFound from '../pages/NotFound.jsx'
import OrderDetails from '../pages/OrderDetails.jsx'
import OrderSuccess from '../pages/OrderSuccess.jsx'
import ProductDetails from '../pages/ProductDetails.jsx'
import Products from '../pages/Products.jsx'
import Profile from '../pages/Profile.jsx'
import Register from '../pages/Register.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import SearchResults from '../pages/SearchResults.jsx'
import Wishlist from '../pages/Wishlist.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/categories/:categoryName" element={<Category />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/digital/:service" element={<Entertainment />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
      </Route>
      <Route path="/wishlist" element={<Wishlist />} />
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<CreateProduct />} />
        <Route path="/admin/products/:productId/edit" element={<EditProduct />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
