import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import DashBoard from "../src/Pages/DashBoard"
import NotFoundPage from './Pages/NotFoundPage';

const App = () => {
  return (
    <>
    
    <Routes>
      <Route path='/DashBoard' element={<DashBoard/>}/>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
       <ToastContainer position="top-right" autoClose={3000} />
    
    
    </>
       
    
  );
}

export default App;
