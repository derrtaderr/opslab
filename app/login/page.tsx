'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Login failed. Please check your credentials.');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="max-w-md w-full bg-dark-surface p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">AI Ops Lab</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2 bg-red-900 bg-opacity-20 border border-red-500 rounded text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-dark-border bg-dark text-dark-text focus:outline-none focus:ring-1 focus:ring-dark-accent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-dark-border bg-dark text-dark-text focus:outline-none focus:ring-1 focus:ring-dark-accent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-dark-accent text-white rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-accent disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <p className="text-sm text-center text-dark-text">
            For development, you can use any email/password
          </p>
        </form>
      </div>
    </div>
  );
} 