import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Footer from './components/Footer'
import Collection from './pages/Collection'
import Product from './pages/Product'
import FullCart from './pages/FullCart'
import Checkout from './pages/Checkout'
import Search from './pages/Search'
import Confirmed from './pages/Confirmed'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import AdminPanel from './pages/AdminPanel'
import UpdateProduct from './pages/UpdateProduct'
import Notfound from './components/Notfound'
import OrderHistory from './pages/OrderHistory'
import Payment from './pages/Checkout'


function App() {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';
  const isSearch = location.pathname === '/search/:q'

  return (
    <>
      {!isCheckout && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<Notfound />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/products' element={<Collection />} />
        <Route path='/cart' element={<FullCart />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/search/:q' element={<Search />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/confirm' element={<Confirmed />} />
        <Route path='/user/order/orderhistory' element={<OrderHistory />} />
        <Route path='/checkout2' element={<Payment />} />
        <Route path='/admin' element={<AdminPanel />} />
        <Route path='/admin/product/update/:id' element={<UpdateProduct />} />
      </Routes>
      {(!isCheckout && !isSearch) && <Footer />}
      <ToastContainer />
    </>
  );
}



export default App
