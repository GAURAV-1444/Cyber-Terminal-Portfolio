import React from 'react';
import Home from './components/Home';
import SystemStatus from './components/SystemStatus'; // <--- Import new dashboard component
import './index.css';
import Projects from './components/Projects';
import About from './components/About';
import Navbar from './components/Navbar';
import Skills from './components/Skill';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Footer from './components/Footer';
import MatrixBackground from './components/MatrixBackground';

function App() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="app">
      <MatrixBackground />
      <Navbar />
      <Home />
      <SystemStatus />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;