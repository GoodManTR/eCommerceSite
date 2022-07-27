import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom'
import { matchPath } from "react-router";
import { Link, useNavigate } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext';
import { collection, addDoc, setDoc, doc, getDoc, query, onSnapshot } from "firebase/firestore";
import { firestoreDb } from '../firebase';
import React, { useState, useEffect } from 'react'

import Login from './Login';
import PageMain from './PageMain';
import Signup from './Register';
import PrivateRoute from './PrivateRoute';
import LoggedInRoute from './LoggedInRoute';
import ForgotPassword from './ForgotPassword';
import ContactUs from './ContactUs';
import Profile_Orders from './Profile_Orders';
import Profile_Info from './Profile_Info';
import Header from './Header';
import Footer from './Footer';
import ShoppingCart from './ShoppingCart';
import Admin from './Admin';
import AdminRoute from './AdminRoute';
import Products from './Products';
import ProductDetail from './ProductDetail';


export default function App() {
  return (
      <>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"></link>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet"></link>
        <Router>
          <AuthProvider>
            <Header />
            <div>
            <Routes>
              <Route path="/" element={<PageMain />}></Route>
              <Route path="/products" element={<Products />}></Route>  
              <Route path="/product-details" element={<ProductDetail />}></Route>         
              <Route path="/orders" element={<PrivateRoute><Profile_Orders /></PrivateRoute>}></Route>
              <Route path="/profile-info" element={<PrivateRoute><Profile_Info /></PrivateRoute>}></Route>
              <Route path="/shopping-cart" element={<PrivateRoute><ShoppingCart /></PrivateRoute>}></Route>
              <Route path="/signup" element={<LoggedInRoute><Signup /></LoggedInRoute>}></Route>
              <Route path="/login" element={<LoggedInRoute><Login /></LoggedInRoute>}></Route>
              <Route path="/add-product" element={<AdminRoute><Admin /></AdminRoute>}></Route>
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/communication' element={<ContactUs />} />
              <Route path="/products/:productId" element={<ProductDetail />}></Route>
            </Routes>
            </div>
            <Footer />
          </AuthProvider>
        </Router>
      </>
  )
}