import React, { useState, FormEvent } from 'react';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

const LoginForm: React.FC = () => {
  const { authState, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!username || !password) {
      setFormError('Please enter both username and password');
      return;
    }
    
    try {
      await login(username, password);
    } catch (error) {
      setFormError('Authentication failed. Please try again.');
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-2">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Wellness Tracker</h1>
          <p className="text-gray-600 mt-2">Sign in to access your wellness dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {(formError || authState.error) && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {formError || authState.error}
            </div>
          )}
          
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            icon={<User className="h-5 w-5 text-gray-400" />}
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            icon={<Lock className="h-5 w-5 text-gray-400" />}
          />
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full"
              isLoading={authState.isLoading}
            >
              Sign In
            </Button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Don't have an account? Please contact your administrator.</p>
            <p className="mt-2 text-xs">Demo: Try username "johndoe" with password "john0101"</p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;