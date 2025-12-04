import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OrderForm from './components/OrderForm';
import TechnicalSpecs from './components/TechnicalSpecs';
import Footer from './components/Footer';
import Luna from './components/Luna';

// Page d'accueil principale
const HomePage = () => (
  <>
    {/* Navbar visible sur TOUS les écrans (mobile et desktop) */}
    <Navbar />
    <Hero />
    <OrderForm />
    <TechnicalSpecs />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
              <HomePage />
            </div>
          } />
          <Route path="/Luna" element={<Luna />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;