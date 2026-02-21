import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, Mail, Lock, AlertCircle, ArrowRight, Loader2, Eye, EyeOff, User, Shield } from 'lucide-react';

const inputWrap = { position: 'relative' };
const inputBase = {
    width: '100%', padding: '13px 14px 13px 44px',
    fontSize: '15px', fontWeight: 500, color: '#fff',
    background: '#1c1c1c', border: '2px solid #2a2a2a',
    borderRadius: '12px', outline: 'none',
    transition: 'border-color 0.2s', fontFamily: 'inherit'
};
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#ccc', marginBottom: '8px' };
const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' };

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Fleet Manager');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (isSignUp) {
                if (!name.trim()) { setError('Name is required.'); setIsSubmitting(false); return; }
                await register(name, email, password, role);
            } else {
                await login(email, password);
            }
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || err.message;
            if (isSignUp) {
                setError(msg?.includes('duplicate') || msg?.includes('E11000') ? 'An account with this email already exists.' : msg || 'Registration failed.');
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
    };

    const focus = (e) => { e.target.style.borderColor = '#4f46e5'; };
    const blur = (e) => { e.target.style.borderColor = '#2a2a2a'; };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0a0a0a', padding: '20px', fontFamily: "'Inter', system-ui, sans-serif"
        }}>
            <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{
                        width: '64px', height: '64px', background: '#4f46e5', borderRadius: '18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(79,70,229,0.3)'
                    }}>
                        <Truck size={32} color="#fff" />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>FleetOS</h1>
                    <p style={{ color: '#666', fontSize: '14px', fontWeight: 500 }}>Fleet Management System</p>
                </div>

                {/* Card */}
                <div style={{ background: '#141414', borderRadius: '20px', padding: '36px', border: '1px solid #222' }}>
                    {/* Toggle Tabs */}
                    <div style={{
                        display: 'flex', gap: '4px', background: '#1a1a1a', borderRadius: '12px',
                        padding: '4px', marginBottom: '28px'
                    }}>
                        <button type="button" onClick={() => { setIsSignUp(false); setError(''); }} style={{
                            flex: 1, padding: '10px', fontSize: '14px', fontWeight: 700,
                            borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: !isSignUp ? '#4f46e5' : 'transparent',
                            color: !isSignUp ? '#fff' : '#666', transition: 'all 0.2s'
                        }}>Sign In</button>
                        <button type="button" onClick={() => { setIsSignUp(true); setError(''); }} style={{
                            flex: 1, padding: '10px', fontSize: '14px', fontWeight: 700,
                            borderRadius: '10px', border: 'none', cursor: 'pointer',
                            background: isSignUp ? '#4f46e5' : 'transparent',
                            color: isSignUp ? '#fff' : '#666', transition: 'all 0.2s'
                        }}>Sign Up</button>
                    </div>

                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                        {isSignUp ? 'Create account' : 'Welcome back'}
                    </h2>
                    <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
                        {isSignUp ? 'Fill in details to get started' : 'Sign in to your account'}
                    </p>

                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 16px', background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', marginBottom: '20px'
                        }}>
                            <AlertCircle size={18} color="#ef4444" />
                            <span style={{ color: '#f87171', fontSize: '13px', fontWeight: 500 }}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name field (sign up only) */}
                        {isSignUp && (
                            <div style={{ marginBottom: '18px' }}>
                                <label style={labelStyle}>Full Name</label>
                                <div style={inputWrap}>
                                    <User size={18} color="#555" style={iconStyle} />
                                    <input type="text" placeholder="John Doe"
                                        value={name} onChange={(e) => setName(e.target.value)} required
                                        style={inputBase} onFocus={focus} onBlur={blur} />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={labelStyle}>Email Address</label>
                            <div style={inputWrap}>
                                <Mail size={18} color="#555" style={iconStyle} />
                                <input type="email" placeholder={isSignUp ? 'you@company.com' : 'manager@fleet.com'}
                                    value={email} onChange={(e) => setEmail(e.target.value)} required
                                    style={inputBase} onFocus={focus} onBlur={blur} />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={labelStyle}>Password</label>
                            <div style={inputWrap}>
                                <Lock size={18} color="#555" style={iconStyle} />
                                <input type={showPassword ? 'text' : 'password'}
                                    placeholder={isSignUp ? 'Create a strong password' : 'Enter your password'}
                                    value={password} onChange={(e) => setPassword(e.target.value)} required
                                    style={{ ...inputBase, paddingRight: '44px' }} onFocus={focus} onBlur={blur} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    {showPassword ? <EyeOff size={18} color="#555" /> : <Eye size={18} color="#555" />}
                                </button>
                            </div>
                        </div>

                        {/* Role (sign up only) */}
                        {isSignUp && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={labelStyle}>Role</label>
                                <div style={inputWrap}>
                                    <Shield size={18} color="#555" style={iconStyle} />
                                    <select value={role} onChange={(e) => setRole(e.target.value)}
                                        style={{
                                            ...inputBase, paddingLeft: '44px', appearance: 'none',
                                            cursor: 'pointer', colorScheme: 'dark',
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 6.646a.5.5 0 0 1 .708 0L8 9.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center'
                                        }}
                                        onFocus={focus} onBlur={blur}>
                                        {['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].map(r =>
                                            <option key={r} value={r} style={{ background: '#1c1c1c', color: '#eee' }}>{r}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                        )}

                        {!isSignUp && <div style={{ height: '10px' }} />}

                        <button type="submit" disabled={isSubmitting} style={{
                            width: '100%', padding: '14px',
                            background: isSubmitting ? '#3730a3' : '#4f46e5', color: '#fff',
                            fontSize: '15px', fontWeight: 700, border: 'none', borderRadius: '12px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(79,70,229,0.3)', fontFamily: 'inherit'
                        }}>
                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> :
                                <><span>{isSignUp ? 'Create Account' : 'Sign In'}</span><ArrowRight size={18} /></>
                            }
                        </button>
                    </form>

                    {/* Toggle link */}
                    <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #222' }}>
                        <p style={{ color: '#666', fontSize: '13px' }}>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button type="button" onClick={toggleMode} style={{
                                background: 'none', border: 'none', color: '#818cf8',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer', marginLeft: '6px'
                            }}>
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                        {!isSignUp && (
                            <p style={{ color: '#555', fontSize: '11px', marginTop: '8px' }}>
                                Demo: <strong style={{ color: '#888' }}>manager@fleet.com</strong> / <strong style={{ color: '#888' }}>password123</strong>
                            </p>
                        )}
                    </div>
                </div>

                <p style={{ textAlign: 'center', color: '#444', fontSize: '12px', marginTop: '24px' }}>
                    © 2026 FleetOS. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
