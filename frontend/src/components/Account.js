import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ProgressBar } from 'react-bootstrap';
import { getAccountInfo } from '../utils/api';

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
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  if (!accountInfo) {
    return (
      <Container className="mt-5">
        <p className="text-center text-muted">No account information available.</p>
      </Container>
    );
  }

  const usagePercentage = (accountInfo.requestUsed / accountInfo.requestLimit) * 100;

  return (
    <Container className="mt-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">Account Information</h2>
        </Card.Header>
        <Card.Body>
          <h3 className="mb-4">API Usage Overview</h3>
          <ProgressBar 
            now={usagePercentage} 
            label={`${usagePercentage.toFixed(1)}%`} 
            className="mb-3"
          />
          <p className="text-muted">
            {accountInfo.requestUsed} / {accountInfo.requestLimit} requests used
          </p>
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Total Requests</Card.Title>
                  <Card.Text className="display-4">{accountInfo.requestLimit}</Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6 mb-3">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Remaining</Card.Title>
                  <Card.Text className="display-4">{accountInfo.remainingLimit}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={fetchAccountInfo} 
            className="mt-3"
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh Account Info
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Account;

