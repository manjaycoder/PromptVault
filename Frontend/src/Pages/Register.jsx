import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await axios.post('http://localhost:3000/Auth/Register', formData);

    // ✅ Corrected: log response data from backend
    console.log(response.data);

    toast.success('Registration successful! Redirecting to login...', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/DashBoard');
    }, 3000);

  } catch (error) {
    let errorMessage = 'Registration failed';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'No response from server';
    }

    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="w-full h-screen flex">
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Image Section */}
      <div className="hidden md:block w-full md:w-1/2 h-screen">
        <img 
          src="https://images.unsplash.com/photo-1600031830097-10d2791a3b83?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI4fHw0a3xlbnwwfHwwfHx8MA%3D%3D" 
          alt="Decorative background showing a modern workspace" 
          className='h-full w-full object-cover'  
        />
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 h-screen flex items-center justify-center bg-black p-4 relative">
        <div className="w-full max-w-md">
          <h2 className='text-white font-bold text-2xl mb-1'>Welcome to PromptVault</h2>
          <p className='text-gray-400 text-sm mb-6'>
            Already have an account? 
            <span 
              className='text-blue-500 ml-1 cursor-pointer hover:underline'
              onClick={() => navigate('/login')}
            >
              Login here
            </span>
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className='block text-gray-300 text-sm font-medium mb-1'>
                Username
              </label>
              <input 
                type="text" 
                name="username" 
                id="username" 
                value={formData.username}
                onChange={handleChange}
                className='w-full p-2.5 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className='block text-gray-300 text-sm font-medium mb-1'>
                Email Address
              </label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                className='w-full p-2.5 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className='block text-gray-300 text-sm font-medium mb-1'>
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                value={formData.password}
                onChange={handleChange}
                className='w-full p-2.5 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
                minLength="6"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-[50%] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded transition duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
