import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';

import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Maintenance from './pages/Maintenance';
import AntiGravity from './pages/AntiGravity';
import { AnimatePresence } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return <Layout>{children}</Layout>;
};

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
                <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
                <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
                <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
                <Route path="/anti-gravity" element={<ProtectedRoute><AntiGravity /></ProtectedRoute>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <ConfirmProvider>
                <AuthProvider>
                    <AnimatedRoutes />
                </AuthProvider>
            </ConfirmProvider>
        </Router>
    );
}

export default App;
