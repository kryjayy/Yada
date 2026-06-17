import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import CheckIn from './pages/CheckIn';
import Journal from './pages/Journal';
import Crisis from './pages/Crisis';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/onboarding" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/checkin" element={<PrivateRoute><CheckIn /></PrivateRoute>} />
      <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
      <Route path="/crisis" element={<PrivateRoute><Crisis /></PrivateRoute>} />
    </Routes>
  );
}