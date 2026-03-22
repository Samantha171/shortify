import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Links from './pages/Links';
import QR from './pages/QR';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Expired from './components/Expired';
import PublicStats from './pages/PublicStats';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/links" element={<Links />} />
              <Route path="/qr" element={<QR />} />
              <Route path="/analytics/:id?" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/expired" element={<Expired />} />
          <Route path="/r/:short_code/stats" element={<PublicStats />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
