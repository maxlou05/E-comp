import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes} from 'react-router-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Head from 'next/head';
import Link from 'next/link';

import Home from './home';
import Login from './login';
import CreateAccount from'./createAccount';
import MyEvents from './myEvents';

//<Route path="/" element={< />}/>

//export default function App() {
//  return (
//    <>
//      <Router>
//        <Routes>
//          <Route path="/" element={<Home/>}/>
//          <Route path="/login" element={<Login/>}/>
//          <Route path="/createAccount" element={<CreateAccount/>}/>
//          <Route path="/myEvents" element={<MyEvents/>}/>
//        </Routes>
//      </Router>
//    </>
//  )
//}
