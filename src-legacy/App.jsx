import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DiaryPage from './pages/DiaryPage';
import PuppiesPage from './pages/PuppiesPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/puppies" element={<PuppiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,  // 動畫持續時間
      once: false,      // 動畫只播放一次
      easing: 'ease-out-cubic'  // 動畫效果
    });
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 