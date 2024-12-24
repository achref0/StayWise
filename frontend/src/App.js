import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Search from './components/Search';
import HotelDetails from './components/HotelDetails';
import Account from './components/Account';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

