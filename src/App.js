import './App.css';
import Home from './Components/Home/Home';
import Layout from './Components/Layout/Layout';
import Cart from './Components/Cart/Cart';
import Brands from './Components/Brands/Brands';
import Categories from './Components/Categories/Categories';
import Login from './Components/Login/Login';
import Products from './Components/Products/Products';
import Register from './Components/Register/Register';
import NotFound from './Components/NotFound/NotFound';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from './Context/UserContext/UserContext';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import ProtectedRegisterRoute from './Components/ProtectedRegisterRoute/ProtectedRegisterRoute';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import CartContextProvider from './Context/CartContext/CartContext';
import { ToastContainer } from 'react-toastify';
import BrandDetails from './Components/BrandDetails/BrandDetails';
import CategoryDetails from './Components/CategoryDetails/CategoryDetails';
import ProductsOfSpecificSubcategory from './Components/SubcategoryDetails/SubcategoryDetails';
import WishList from './Components/WishList/WishList';
import Orders from './Components/Orders/Orders';
import PlaceOrder from './Components/PlaceOrder/PlaceOrder';
import AddRating from './Components/AddRating/AddRating';

const routers = createHashRouter([{
  path: '/', element: <Layout />, children: [
    { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
    { path: '/cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
    { path: '/brands', element: <ProtectedRoute><Brands /></ProtectedRoute> },
    { path: '/brand-details/:id', element: <ProtectedRoute><BrandDetails /></ProtectedRoute> },
    { path: '/register', element: <ProtectedRegisterRoute><Register /></ProtectedRegisterRoute> },
    { path: '/products', element: <ProtectedRoute><Products /></ProtectedRoute> },
    { path: '/product-details/:id', element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
    { path: '/wish-list', element: <ProtectedRoute><WishList /></ProtectedRoute> },
    { path: '/place-order', element: <ProtectedRoute><PlaceOrder /></ProtectedRoute> },
    { path: '/orders', element: <ProtectedRoute><Orders /></ProtectedRoute> },
    { path: '/add-rating/:id', element: <ProtectedRoute><AddRating /></ProtectedRoute> },
    {
      path: '/category-details/:id', element: <ProtectedRoute><CategoryDetails /></ProtectedRoute>, children: [
        { path: ':subCategoryId', element: <ProductsOfSpecificSubcategory /> }
      ]
    },
    { path: '/login', element: <ProtectedRegisterRoute><Login /></ProtectedRegisterRoute> },
    { path: '/forget-password', element: <ProtectedRegisterRoute><ForgetPassword /></ProtectedRegisterRoute> },
    { path: '/categories', element: <ProtectedRoute><Categories /></ProtectedRoute> },
    { path: '*', element: <NotFound /> },
  ]
}])
function App() {
  const { setToken, setUserRole } = useContext(UserContext)
  useEffect(() => {
    if (localStorage.getItem("Token")) {
      setToken(localStorage.getItem("Token"))
      setUserRole(localStorage.getItem("Role"))
    }
  }, [])
  return <CartContextProvider> <ToastContainer theme='colored' autoClose={800} /> <RouterProvider router={routers}></RouterProvider></CartContextProvider>
}

export default App;
