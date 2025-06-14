 import React from 'react';
 import LoginForm from '../components/auth/LoginForm';
 import logo from '../assets/logo.png';
 
 const LoginPage: React.FC = () => {
   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
       <div className="sm:mx-auto sm:w-full sm:max-w-md">
         <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-16 w-16" />
         </div>
         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
           Wellness Tracker
         </h2>
         <p className="mt-2 text-center text-sm text-gray-600 max-w">
           Track, monitor, and improve your daily wellness
         </p>
       </div>
 
       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
         <LoginForm />
       </div>
     </div>
   );
 };
 

export default LoginPage;
 
