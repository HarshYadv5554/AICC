import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const provider = searchParams.get('provider');
        const error = searchParams.get('error');

        if (error) {
          setStatus('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (token) {
          // Store the token
          localStorage.setItem('token', token);
          setStatus(`Successfully signed in with ${provider}! Redirecting...`);
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus('No authentication token received. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('An error occurred during authentication. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm p-8 rounded-xl shadow-2xl bg-white/95 backdrop-blur-sm border border-white/20 animate-fade-in-up transition-all duration-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication</h2>
          <p className="text-gray-600">{status}</p>
        </div>
      </div>
    </main>
  );
};

export default OAuthCallback;
