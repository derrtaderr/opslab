'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        // Show a success message for sign up
        setError('Account created! Please check your email to verify your account.');
        setLoading(false);
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        // Redirect to dashboard after successful login
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-full max-w-md p-8 bg-dark-surface rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Create an Account' : 'Sign In to AI Ops Lab'}
          </h1>
          <p className="text-text-secondary">
            {isSignUp 
              ? 'Create your account to start your AI Ops journey' 
              : 'Sign in to access your AI design sprint board'}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded text-sm text-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-dark-surface-dark border border-dark-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-white"
                placeholder="Enter your name"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-dark-surface-dark border border-dark-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-white"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-dark-surface-dark border border-dark-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-white"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? 'Loading...' 
              : isSignUp 
                ? 'Create Account' 
                : 'Sign In'
            }
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline focus:outline-none"
          >
            {isSignUp 
              ? 'Already have an account? Sign In' 
              : 'Don\'t have an account? Sign Up'
            }
          </button>
        </div>
      </div>
    </div>
  );
} 