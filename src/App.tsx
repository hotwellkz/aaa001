import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import PythonInstallation from './pages/PythonInstallation';
import NewEraLearning from './components/NewEraLearning';
import StartLearning from './components/StartLearning';
import SuitableFor from './components/SuitableFor';
import Reviews from './components/Reviews/Reviews';
import StartFree from './components/StartFree';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Curriculum from './pages/Curriculum';
import AIChat from './components/AIChat';
import Lesson from './pages/Lesson';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen">
            <Header />
            <main>
              <Hero />
              <Features />
              <NewEraLearning />
              <StartLearning />
              <SuitableFor />
              <Reviews />
              <StartFree />
              <FAQ />
            </main>
            <Footer />
            <AIChat />
          </div>
        } />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/lesson/python-introduction" element={<Lesson />} />
        <Route path="/lesson/python-installation" element={<PythonInstallation />} />
      </Routes>
    </Router>
  );
}
export default App;