import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    Wrench, Plus, Trash2, X, Calendar, DollarSign, AlertTriangle,
    CheckCircle, Clock, TrendingUp, Activity, Shield, Zap,
    ChevronRight, BarChart3, Brain, RefreshCw, Info
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedNumber, StaggerContainer, StaggerItem, AnimatedButton } from '../components/AnimatedComponents';
import { useConfirm, useToast } from '../context/ConfirmContext';

/* ─────────────────────── constants ─────────────────────── */
const SERVICE_TYPES = [
    'Oil Change', 'Brake Service', 'Tire Rotation', 'Engine Repair',
    'Transmission', 'Battery', 'AC Service', 'General Inspection'
];

// Default service intervals (can be tuned per serviceType)
const DEFAULT_INTERVAL_KM = 5000;
const DEFAULT_INTERVAL_DAYS = 90;

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ─────────────────────── helpers ─────────────────────── */
const today = () => new Date();

const daysDiff = (d1, d2) => Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

/** Derive prediction for a vehicle from its most recent maintenance record */
const buildPrediction = (vehicle, records) => {
    // filter records for this vehicle, sorted newest-first
    const vRecs = records
        .filter(r => (r.vehicle?._id || r.vehicle) === vehicle._id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const lastRec = vRecs[0] || null;
    const lastDate = lastRec ? new Date(lastRec.date) : null;

    const now = today();
    const currentOdo = vehicle.odometer || 0;

    // Estimate last service odometer: assume daily usage ~100 km
    const daysSinceLast = lastDate ? daysDiff(lastDate, now) : 999;
    const approxLastOdo = lastDate ? Math.max(0, currentOdo - daysSinceLast * 100) : 0;

    const nextDueDate = lastDate ? new Date(lastDate.getTime() + DEFAULT_INTERVAL_DAYS * 86400000) : null;
    const kmSinceLast = currentOdo - approxLastOdo;
    const kmRemaining = DEFAULT_INTERVAL_KM - kmSinceLast;
    const daysRemaining = nextDueDate ? daysDiff(now, nextDueDate) : null;

    let status = 'Safe';
    if (!lastDate || (daysRemaining !== null && daysRemaining < 0) || kmRemaining <= 0) {
        status = 'Overdue';
    } else if ((daysRemaining !== null && daysRemaining < 15) || kmRemaining < 500) {
        status = 'Due Soon';
    }

    return {
        vehicleId: vehicle._id,
        plate: vehicle.licensePlate,
        model: vehicle.model,
        odometer: currentOdo,
        lastServiceDate: lastDate,
        lastServiceType: lastRec?.serviceType || '—',
        nextDueDate,
        kmRemaining: Math.max(0, kmRemaining),
        daysRemaining,
        status,
    };
};

/** Build last-6-months cost breakdown from maintenance records */
const buildMonthlyData = (records) => {
    const now = today();
    return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const cost = records
            .filter(r => {
                const rd = new Date(r.date);
                return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
            })
            .reduce((s, r) => s + r.cost, 0);
        return { month: MONTH_LABELS[d.getMonth()], cost };
    });
};

/** Service-type distribution */
const buildTypeData = (records) => {
    const counts = {};
    records.forEach(r => { counts[r.serviceType] = (counts[r.serviceType] || 0) + r.cost; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

/* ─────────────────────── sub-components ─────────────────────── */

// glass panel wrapper
const Glass = ({ children, style, className }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
            background: 'rgba(16,16,20,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '24px',
            ...style,
        }}
    >
        {children}
    </motion.div>
);

// section heading
const SectionHead = ({ icon: Icon, title, color = '#6366f1', badge }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: `${color}18`, border: `1px solid ${color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Icon size={16} color={color} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>{title}</h3>
        {badge && (
            <span style={{
                fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px',
                background: `${color}15`, color, border: `1px solid ${color}25`,
                letterSpacing: '0.6px', textTransform: 'uppercase'
            }}>{badge}</span>
        )}
    </div>
);

// status badge
const StatusBadge = ({ status }) => {
    const map = {
        Safe: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: CheckCircle },
        'Due Soon': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: Clock },
        Overdue: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.25)', icon: AlertTriangle },
        Scheduled: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', icon: Calendar },
        'In Progress': { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', icon: RefreshCw },
        Completed: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: CheckCircle },
    };
    const cfg = map[status] || { color: '#888', bg: 'rgba(128,128,128,0.1)', border: 'rgba(128,128,128,0.2)', icon: Info };
    const Icon = cfg.icon;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        }}>
            <Icon size={11} />
            {status}
        </span>
    );
};

// custom tooltip
const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#1a1a24', border: '1px solid #2a2a36', borderRadius: '10px',
            padding: '10px 14px', fontSize: '12px', color: '#ccc'
        }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#fff' }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ margin: '2px 0', color: p.color }}>
                    {p.name}: <strong>₹{Number(p.value).toLocaleString('en-IN')}</strong>
                </p>
            ))}
        </div>
    );
};

// form input style
const inputStyle = {
    width: '100%', padding: '11px 14px', fontSize: '14px', color: '#eee', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
    outline: 'none', fontFamily: 'inherit', colorScheme: 'dark',
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const Maintenance = () => {
    const [records, setRecords] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ vehicle: '', serviceType: '', description: '', date: '', cost: '', status: 'Completed' });
    const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'logs'

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirm = useConfirm();
    const toast = useToast();

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [vRes, mRes] = await Promise.all([
                axios.get('http://localhost:5000/api/vehicles', { headers }),
                axios.get('http://localhost:5000/api/maintenance', { headers }),
            ]);
            setVehicles(vRes.data);
            setRecords(mRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/maintenance',
                { ...form, cost: Number(form.cost) }, { headers });
            setShowModal(false);
            setForm({ vehicle: '', serviceType: '', description: '', date: '', cost: '', status: 'Completed' });
            loadData();
            toast('Service record logged successfully', 'success');
        } catch (err) { console.error(err); toast('Failed to log record', 'error'); }
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: 'Delete Maintenance Record',
            message: 'This action cannot be undone. Are you sure?'
        });
        if (!ok) return;
        try {
            await axios.delete(`http://localhost:5000/api/maintenance/${id}`, { headers });
            toast('Record deleted', 'success');
            loadData();
        } catch (e) { toast(e.response?.data?.error || 'Failed to delete', 'error'); }
    };

    /* ── derived data ── */
    const predictions = useMemo(() => vehicles.map(v => buildPrediction(v, records)), [vehicles, records]);
    const monthlyData = useMemo(() => buildMonthlyData(records), [records]);
    const typeData = useMemo(() => buildTypeData(records), [records]);

    const totalCost = records.reduce((s, r) => s + r.cost, 0);
    const avgCost = records.length ? totalCost / records.length : 0;
    const overdueCount = predictions.filter(p => p.status === 'Overdue').length;
    const dueSoonCount = predictions.filter(p => p.status === 'Due Soon').length;

    /* ── loading spinner ── */
    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #1e1e2e', borderTop: '3px solid #6366f1' }} />
            <p style={{ color: '#444', fontSize: '14px', fontWeight: 600 }}>Loading maintenance data…</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ══ HERO HEADER ══ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'linear-gradient(135deg, #0f0f14 0%, #12121a 50%, #0f0f1a 100%)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '24px', padding: '28px 32px',
                    position: 'relative', overflow: 'hidden',
                }}
            >
                {/* ambient glows */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-40px', left: '120px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 24px rgba(99,102,241,0.4)',
                        }}>
                            <Brain size={24} color="#fff" />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h1 style={{
                                    fontSize: '26px', fontWeight: 900, margin: 0,
                                    background: 'linear-gradient(135deg, #fff 30%, #a5b4fc)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>Predictive Maintenance Hub</h1>
                                <span style={{
                                    fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px',
                                    background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                                    border: '1px solid rgba(99,102,241,0.3)', letterSpacing: '1px'
                                }}>✦ AI POWERED</span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#555', margin: '4px 0 0', fontWeight: 600 }}>
                                {records.length} service records · {vehicles.length} vehicles monitored
                            </p>
                        </div>
                    </div>
                    <AnimatedButton onClick={() => setShowModal(true)} variant="primary">
                        <Plus size={15} /> Log Service
                    </AnimatedButton>
                </div>
            </motion.div>

            {/* ══ KPI STRIP ══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                {[
                    { label: 'Total Records', value: records.length, icon: Wrench, color: '#818cf8', prefix: '' },
                    { label: 'Total Spend', value: Math.round(totalCost), icon: DollarSign, color: '#f43f5e', prefix: '₹' },
                    { label: 'Avg Cost', value: Math.round(avgCost), icon: TrendingUp, color: '#10b981', prefix: '₹' },
                    { label: 'Overdue', value: overdueCount, icon: AlertTriangle, color: '#f43f5e', prefix: '' },
                    { label: 'Due Soon', value: dueSoonCount, icon: Clock, color: '#f59e0b', prefix: '' },
                ].map((s, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}
                        style={{
                            background: 'rgba(16,16,20,0.85)', backdropFilter: 'blur(16px)',
                            border: `1px solid ${s.color}22`, borderRadius: '16px', padding: '20px',
                            position: 'relative', overflow: 'hidden',
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '70px', height: '70px', borderRadius: '50%', background: `${s.color}12`, filter: 'blur(16px)' }} />
                        <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: `${s.color}14`, border: `1px solid ${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                            <s.icon size={18} color={s.color} />
                        </div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>{s.label}</p>
                        <p style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-1px' }}>
                            {s.prefix}<AnimatedNumber value={s.value} />
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* ══ TAB SWITCHER ══ */}
            <div style={{ display: 'flex', gap: '8px' }}>
                {[
                    { key: 'schedule', label: 'Predictive Schedule', icon: Brain },
                    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { key: 'logs', label: 'Service Logs', icon: Wrench },
                ].map(tab => {
                    const active = activeTab === tab.key;
                    return (
                        <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '7px',
                                padding: '9px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                                border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                                background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                                color: active ? '#818cf8' : '#555', cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* ══ TAB: PREDICTIVE SCHEDULE ══ */}
            <AnimatePresence mode="wait">
                {activeTab === 'schedule' && (
                    <motion.div key="schedule"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Glass>
                            <SectionHead icon={Brain} title="Auto-Maintenance Schedule Prediction" color="#6366f1"
                                badge="Predicted using usage trends" />

                            {/* AI methodology note */}
                            <div style={{
                                display: 'flex', alignItems: 'flex-start', gap: '10px',
                                padding: '12px 16px', marginBottom: '20px', borderRadius: '12px',
                                background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.14)',
                            }}>
                                <Info size={14} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: 1.6 }}>
                                    Predictions use a <strong style={{ color: '#818cf8' }}>5,000 km</strong> service-interval and
                                    <strong style={{ color: '#818cf8' }}> 90-day</strong> calendar cycle derived from each vehicle's
                                    last logged maintenance record. Status updates dynamically as odometer and dates advance.
                                </p>
                            </div>

                            {/* legend */}
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Safe', color: '#10b981' },
                                    { label: 'Due Soon (< 15 days or < 500 km)', color: '#f59e0b' },
                                    { label: 'Overdue', color: '#f43f5e' },
                                ].map((l, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                                        <span style={{ fontSize: '11px', color: '#555', fontWeight: 600 }}>{l.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            {['Vehicle', 'Model', 'Odometer', 'Last Service', 'Last Type', 'Next Due Date', 'KM Remaining', 'Status'].map(h => (
                                                <th key={h} style={{ padding: '12px 14px', fontSize: '10px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {predictions.length === 0 ? (
                                            <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#333', fontSize: '14px' }}>No vehicles found</td></tr>
                                        ) : predictions.map((p, i) => {
                                            const rowGlow = p.status === 'Overdue' ? 'rgba(244,63,94,0.04)' : p.status === 'Due Soon' ? 'rgba(245,158,11,0.04)' : 'transparent';
                                            return (
                                                <motion.tr key={p.vehicleId}
                                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.04 }}
                                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: rowGlow }}
                                                >
                                                    <td style={{ padding: '14px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <Wrench size={15} color="#fbbf24" />
                                                            </div>
                                                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#eee' }}>{p.plate}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '14px', fontSize: '12px', color: '#777' }}>{p.model}</td>
                                                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: 700, color: '#ccc' }}>
                                                        {p.odometer.toLocaleString()} km
                                                    </td>
                                                    <td style={{ padding: '14px', fontSize: '12px', color: p.lastServiceDate ? '#aaa' : '#444' }}>
                                                        {p.lastServiceDate ? p.lastServiceDate.toLocaleDateString('en-IN') : 'Never'}
                                                    </td>
                                                    <td style={{ padding: '14px', fontSize: '12px', color: '#aaa' }}>{p.lastServiceType}</td>
                                                    <td style={{ padding: '14px' }}>
                                                        {p.nextDueDate ? (
                                                            <div>
                                                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ccc', display: 'block' }}>
                                                                    {p.nextDueDate.toLocaleDateString('en-IN')}
                                                                </span>
                                                                {p.daysRemaining !== null && (
                                                                    <span style={{ fontSize: '11px', color: p.daysRemaining < 0 ? '#f43f5e' : p.daysRemaining < 15 ? '#f59e0b' : '#555' }}>
                                                                        {p.daysRemaining < 0 ? `${Math.abs(p.daysRemaining)}d overdue` : `in ${p.daysRemaining}d`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : <span style={{ color: '#333', fontSize: '12px' }}>—</span>}
                                                    </td>
                                                    <td style={{ padding: '14px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <div style={{ flex: 1, height: '4px', background: '#1e1e2e', borderRadius: '2px', overflow: 'hidden', minWidth: '60px' }}>
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${Math.min(100, (p.kmRemaining / DEFAULT_INTERVAL_KM) * 100)}%` }}
                                                                    transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.04 }}
                                                                    style={{ height: '100%', borderRadius: '2px', background: p.status === 'Overdue' ? '#f43f5e' : p.status === 'Due Soon' ? '#f59e0b' : '#10b981' }}
                                                                />
                                                            </div>
                                                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#666', whiteSpace: 'nowrap' }}>
                                                                {p.kmRemaining.toLocaleString()} km
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '14px' }}>
                                                        <StatusBadge status={p.status} />
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* AI badge footer */}
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                <Zap size={12} color="#6366f1" />
                                <span style={{ fontSize: '11px', color: '#444', fontWeight: 700 }}>
                                    Predictions auto-refresh with live odometer and maintenance history data
                                </span>
                            </div>
                        </Glass>
                    </motion.div>
                )}

                {/* ══ TAB: ANALYTICS ══ */}
                {activeTab === 'analytics' && (
                    <motion.div key="analytics"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                        {/* Monthly cost area chart */}
                        <Glass>
                            <SectionHead icon={TrendingUp} title="Monthly Maintenance Cost" color="#10b981" badge="Last 6 months" />
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={monthlyData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#555' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#555' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Area type="monotone" dataKey="cost" name="Cost (₹)" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#818cf8' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Glass>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Service type donut */}
                            <Glass>
                                <SectionHead icon={Activity} title="Spend by Service Type" color="#f59e0b" />
                                {typeData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                                                {typeData.map((_, i) => (
                                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a36', borderRadius: '10px', fontSize: '12px', color: '#ccc' }}
                                                formatter={(v) => ['₹' + v.toLocaleString('en-IN'), 'Spend']} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#777' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <p style={{ color: '#333', fontSize: '14px' }}>No data yet</p>
                                    </div>
                                )}
                            </Glass>

                            {/* Per-type bar chart */}
                            <Glass>
                                <SectionHead icon={BarChart3} title="Records per Service Type" color="#06b6d4" />
                                {(() => {
                                    const counts = SERVICE_TYPES.map(t => ({
                                        name: t.replace(' ', '\n'), count: records.filter(r => r.serviceType === t).length
                                    })).filter(d => d.count > 0);
                                    return counts.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={240}>
                                            <BarChart data={counts} margin={{ top: 4, right: 8, left: -20, bottom: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" />
                                                <YAxis tick={{ fontSize: 11, fill: '#555' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                                <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a36', borderRadius: '10px', fontSize: '12px', color: '#ccc' }} />
                                                <Bar dataKey="count" name="Records" radius={[6, 6, 0, 0]}>
                                                    {counts.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <p style={{ color: '#333', fontSize: '14px' }}>No data yet</p>
                                        </div>
                                    );
                                })()}
                            </Glass>
                        </div>

                        {/* Summary stats row */}
                        <Glass>
                            <SectionHead icon={Shield} title="Fleet Maintenance Health Summary" color="#8b5cf6" />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                                {[
                                    { label: 'Vehicles — Safe', value: predictions.filter(p => p.status === 'Safe').length, color: '#10b981', max: vehicles.length },
                                    { label: 'Vehicles — Due Soon', value: predictions.filter(p => p.status === 'Due Soon').length, color: '#f59e0b', max: vehicles.length },
                                    { label: 'Vehicles — Overdue', value: predictions.filter(p => p.status === 'Overdue').length, color: '#f43f5e', max: vehicles.length },
                                    { label: 'Never Serviced', value: predictions.filter(p => !p.lastServiceDate).length, color: '#6366f1', max: vehicles.length },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>{s.label}</span>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: s.color }}>{s.value}/{s.max}</span>
                                        </div>
                                        <div style={{ height: '5px', background: '#1e1e2e', borderRadius: '3px', overflow: 'hidden' }}>
                                            <motion.div initial={{ width: 0 }}
                                                animate={{ width: s.max > 0 ? `${(s.value / s.max) * 100}%` : '0%' }}
                                                transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 }}
                                                style={{ height: '100%', background: s.color, borderRadius: '3px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Glass>
                    </motion.div>
                )}

                {/* ══ TAB: SERVICE LOGS ══ */}
                {activeTab === 'logs' && (
                    <motion.div key="logs"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Glass>
                            <SectionHead icon={Wrench} title="Service Logs" color="#fbbf24" />
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            {['Vehicle', 'Service Type', 'Description', 'Date', 'Cost', 'Status', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '12px 14px', fontSize: '10px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.length === 0 ? (
                                            <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#333', fontSize: '14px' }}>No records yet — log your first service</td></tr>
                                        ) : records.map((r, i) => (
                                            <motion.tr key={r._id || i}
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                                                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                            >
                                                <td style={{ padding: '14px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Wrench size={14} color="#fbbf24" />
                                                        </div>
                                                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#eee' }}>{r.vehicle?.licensePlate || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#bbb' }}>{r.serviceType}</span>
                                                </td>
                                                <td style={{ padding: '14px', maxWidth: '240px' }}>
                                                    <span style={{ fontSize: '12px', color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{r.description}</span>
                                                </td>
                                                <td style={{ padding: '14px', fontSize: '12px', fontWeight: 600, color: '#aaa', whiteSpace: 'nowrap' }}>
                                                    {new Date(r.date).toLocaleDateString('en-IN')}
                                                </td>
                                                <td style={{ padding: '14px' }}>
                                                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#4ade80' }}>₹{r.cost.toLocaleString()}</span>
                                                </td>
                                                <td style={{ padding: '14px' }}>
                                                    <StatusBadge status={r.status || 'Completed'} />
                                                </td>
                                                <td style={{ padding: '14px', textAlign: 'center' }}>
                                                    <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDelete(r._id)}
                                                        style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', color: '#f43f5e', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Glass>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══ LOG SERVICE MODAL ══ */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, backdropFilter: 'blur(8px)', padding: '20px',
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                background: 'rgba(14,14,20,0.98)', backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '22px',
                                padding: '32px', width: '100%', maxWidth: '500px',
                                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                            }}
                        >
                            {/* modal header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Wrench size={18} color="#818cf8" />
                                    </div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>Log Service Record</h3>
                                </div>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowModal(false)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#666', cursor: 'pointer', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Vehicle */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>Vehicle</label>
                                    <select value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} required style={{ ...inputStyle, appearance: 'auto' }}>
                                        <option value="">Select vehicle…</option>
                                        {vehicles.map(v => <option key={v._id} value={v._id}>{v.licensePlate} — {v.model}</option>)}
                                    </select>
                                </div>

                                {/* Service Type */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>Service Type</label>
                                    <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} required style={{ ...inputStyle, appearance: 'auto' }}>
                                        <option value="">Select type…</option>
                                        {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>Description</label>
                                    <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="e.g. Full synthetic oil change and filter replacement" style={inputStyle} />
                                </div>

                                {/* Date + Cost */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>Date</label>
                                        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>Cost (₹)</label>
                                        <input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} required placeholder="0" min="0" style={inputStyle} />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ ...inputStyle, appearance: 'auto' }}>
                                        <option value="Completed">Completed</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Scheduled">Scheduled</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                    <AnimatedButton type="submit" variant="primary" style={{ flex: 1 }}>
                                        <CheckCircle size={15} /> Save Record
                                    </AnimatedButton>
                                    <AnimatedButton type="button" variant="secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </AnimatedButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Maintenance;
