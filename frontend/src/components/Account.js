import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { getAccountInfo } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

function Account() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAccountInfo();
    } else {
      setLoading(false);
    }
  }, [user]);

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

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Please log in to view your API usage.</Alert>
      </Container>
    );
  }

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
          <h2 className="mb-0">API Usage Overview</h2>
        </Card.Header>
        <Card.Body>
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

