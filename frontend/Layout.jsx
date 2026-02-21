import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard, Truck, Users, Route,
    Wrench, BarChart3, Receipt, LogOut, Menu, X, Atom
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from './AnimatedComponents';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Vehicles', icon: Truck, path: '/vehicles' },
        { name: 'Drivers', icon: Users, path: '/drivers' },
        { name: 'Trips', icon: Route, path: '/trips' },
        { name: 'Maintenance', icon: Wrench, path: '/maintenance' },
        { name: 'Analytics', icon: BarChart3, path: '/analytics' },
        { name: 'Expenses', icon: Receipt, path: '/expenses' },
        { name: 'EcoFlux Fleet', icon: Atom, path: '/anti-gravity' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#fff', overflowX: 'hidden' }}>
            {/* Sidebar */}
            <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0, width: isCollapsed ? '80px' : '260px' }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                style={{
                    background: '#0f0f0f',
                    borderRight: '1px solid #1e1e1e',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 100,
                    overflow: 'hidden'
                }}
            >
                <div style={{ padding: '32px 20px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            minWidth: '40px', height: '40px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Truck size={24} color="#fff" />
                    </motion.div>
                    {!isCollapsed && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}
                        >FleetOS</motion.h1>
                    )}
                </div>

                <nav style={{ flex: 1, padding: '0 12px' }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                title={isCollapsed ? item.name : ''}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 14px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : '#666',
                                    background: isActive ? 'rgba(79,70,229,0.1)' : 'transparent',
                                    marginBottom: '4px',
                                    transition: 'all 0.2s',
                                    fontWeight: isActive ? 600 : 500,
                                    fontSize: '14px',
                                    justifyContent: isCollapsed ? 'center' : 'flex-start'
                                }}
                            >
                                <item.icon size={20} color={isActive ? '#818cf8' : '#666'} />
                                {!isCollapsed && <span>{item.name}</span>}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="active-pill"
                                        style={{ marginLeft: 'auto', width: '4px', height: '16px', background: '#818cf8', borderRadius: '2px' }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid #1e1e1e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
                        <div style={{
                            minWidth: '36px', height: '36px', borderRadius: '50%',
                            background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: 700, color: '#818cf8'
                        }}>
                            {user?.name?.[0] || 'A'}
                        </div>
                        {!isCollapsed && (
                            <div style={{ overflow: 'hidden' }}>
                                <p style={{ fontSize: '13px', fontWeight: 600, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user?.name || 'Admin'}</p>
                                <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>Fleet Manager</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            width: '100%', padding: '10px', borderRadius: '10px',
                            background: 'rgba(239,68,68,0.05)', color: '#f87171',
                            border: '1px solid rgba(239,68,68,0.1)', fontSize: '13px',
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                        }}
                    >
                        <LogOut size={16} /> {!isCollapsed && 'Logout'}
                    </button>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            marginTop: '12px', width: '100%', padding: '8px',
                            background: 'transparent', border: 'none', color: '#333',
                            cursor: 'pointer', display: 'flex', justifyContent: 'center'
                        }}
                    >
                        {isCollapsed ? <Menu size={16} /> : <X size={16} />}
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
                animate={{ marginLeft: isCollapsed ? '80px' : '260px' }}
                style={{ flex: 1, padding: '40px', transition: 'margin-left 0.3s ease' }}
            >
                <PageTransition>
                    {children}
                </PageTransition>
            </motion.div>
        </div>
    );
};

export default Layout;
