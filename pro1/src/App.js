import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CartProvider } from "./Context/cartcontext";

import Navbar from './Components/Navbar/Navbar';

import Home from './Pages/Home';
import Volunteer from './Pages/Volunteer';
import EventBooking from './Pages/EventBooking'
import Login from './Pages/Login';
import AdminRedirect from "./Pages/AdminRedirect";
import UserVolunteer from './Pages/UserVolunteer'
import Activity from './Pages/Activity';
import MyBookings from './Pages/MyBookings'
import Donate from './Pages/Donation';
import ShopPage from "./Pages/Mainshop";
import CartPage from "./Pages/Maincart";
import Checkout from "./Pages/Checkout"
import OrderHistory from './Components/Orders/Orders';
import YogaRecommendation from './Pages/Yoga';

const App = () => {
  return (
    <div>
      <CartProvider>
      <BrowserRouter>
      <Navbar/>
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/volunteer" element={<Volunteer />} />
         <Route path="/volunteer-request" element={<UserVolunteer />} />
         <Route path="/events" element={<EventBooking />} />
         <Route path="/donate" element={<Donate />} />
         <Route path="/mybookings" element={<MyBookings/>}/>
         <Route path= "/yoga" element={<YogaRecommendation/>}/>
         <Route path="/shop" element={<ShopPage  />} />
         <Route path="/cart" element={<CartPage  />} />
         <Route path="/checkout" element={<Checkout />} />
         <Route path="/orders" element={<OrderHistory />} />
         <Route path="/login" element={<Login />} />
         <Route path="/admin" element={<AdminRedirect />} />
         <Route path="/activity" element={<Activity/>}/>
      

      </Routes>
      
      </BrowserRouter>
      </CartProvider>
      
    </div>
  )
}

export default App;
