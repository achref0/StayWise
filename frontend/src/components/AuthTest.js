import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AuthTest = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const testAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/test-auth', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMessage(JSON.stringify(response.data, null, 2));
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An error occurred');
      }
    };

    if (user) {
      testAuth();
    } else {
      setError('User is not logged in');
    }
  }, [user]);

  return (
    <div className="container mt-5">
      <h2>Authentication Test</h2>
      {user ? (
        <p>Logged in as: {user.username}</p>
      ) : (
        <p>Not logged in</p>
      )}
      {message && (
        <div>
          <h3>Success:</h3>
          <pre>{message}</pre>
        </div>
      )}
      {error && (
        <div>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AuthTest;

