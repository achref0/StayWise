import React, { useState, useEffect } from 'react';
import { getAccountInfo } from '../utils/api';

function Account() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    refreshAccountInfo();
  }, []);

  const refreshAccountInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAccountInfo();
      setAccountInfo(data);
    } catch (err) {
      setError('An error occurred while fetching account information');
    }
    setLoading(false);
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="error">{error}</div>;

  if (!accountInfo) return null;

  const usagePercentage = (accountInfo.requestUsed / accountInfo.requestLimit) * 100;

  return (
    <div>
      <h1>API Usage Information</h1>
      <div id="account-info">
        <h2>Account Information</h2>
        <p>Total Requests Allowed: {accountInfo.requestLimit}</p>
        <p>Requests Used: {accountInfo.requestUsed}</p>
        <p>Remaining Requests: <strong>{accountInfo.remainingLimit}</strong></p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${usagePercentage}%` }}></div>
        </div>
        <p>API Usage: {usagePercentage.toFixed(2)}%</p>
      </div>
      <button onClick={refreshAccountInfo}>Refresh Account Info</button>
    </div>
  );
}

export default Account;

