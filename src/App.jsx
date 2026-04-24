import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/login' || location.pathname === '/admin-portal';

  return (
    <>
      {!isAdminPage && <Navigation />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-portal" element={<Admin />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;

