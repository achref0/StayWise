import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Search from './components/Search';
import HotelDetails from './components/HotelDetails';
import Account from './components/Account';
import AccountSettings from './components/AccountSettings';
import AuthTest from './components/AuthTest';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.min.css';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/hotel/:id" element={<HotelDetails />} />
              <Route path="/api-usage" element={<Account />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/auth-test" element={<AuthTest />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

