import React, { useState, useEffect } from 'react';
import { getAccountInfo } from '../utils/api';
import { User, RefreshCw, AlertCircle } from 'lucide-react';

function Account() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const fetchAccountInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAccountInfo();
      setAccountInfo(data);
    } catch (err) {
      setError('An error occurred while fetching account information. Please try again.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!accountInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No account information available.</p>
      </div>
    );
  }

  const usagePercentage = (accountInfo.requestUsed / accountInfo.requestLimit) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-white">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold">Account Information</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">API Usage Overview</h2>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {usagePercentage.toFixed(1)}% Used
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {accountInfo.requestUsed} / {accountInfo.requestLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Total Requests</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">
                  {accountInfo.requestLimit}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Remaining</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">
                  {accountInfo.remainingLimit}
                </div>
              </div>
            </div>

            <button
              onClick={fetchAccountInfo}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Account Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;

