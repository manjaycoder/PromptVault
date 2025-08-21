import React, { useState } from 'react';
import { useNavigate } from 'react-router';


const Register = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Mock API call - replace with your actual registration endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On successful registration
      setIsSuccess(true);
      navigate("/DashBoard")
      
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-lg max-w-md w-full mx-4">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-white text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-gray-300">You'll be redirected to login shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Image Section - Hidden on mobile */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <img 
          src="https://images.unsplash.com/photo-1642988047968-f828f6ec17aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU0fHw0ayUyMGNhcnRvb258ZW58MHx8MHx8fDA%3D" 
          alt="Decorative background" 
          className='h-full w-full object-cover'  
        />
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 h-screen flex items-center justify-center bg-black p-4">
        <div className="w-full max-w-md">
          <h2 className='text-white font-bold text-2xl mb-1'>Login an Users</h2>
          <p className='text-gray-400 text-sm mb-6'>
            Create an account? 
            <span 
              className='text-blue-500 ml-1 cursor-pointer hover:underline'
              onClick={navigate("/")}
            >
              Sign in
            </span>
          </p>
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded text-sm">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            
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
                placeholder="" 
                className={`w-full p-2.5 bg-black border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                }`}
              />
              {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email}</p>}
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
                placeholder="" 
                className={`w-full p-2.5 bg-black border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                }`}
              />
              {errors.password && <p className="mt-1 text-red-400 text-xs">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className='block text-gray-300 text-sm font-medium mb-1'>
                Confirm Password
              </label>
              <input 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="" 
                className={`w-full p-2.5 bg-black border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                }`}
              />
              {errors.confirmPassword && <p className="mt-1 text-red-400 text-xs">{errors.confirmPassword}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-[50%] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded transition duration-200 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
