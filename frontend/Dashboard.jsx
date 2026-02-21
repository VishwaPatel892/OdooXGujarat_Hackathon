import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Truck, Users, Route, Receipt, Wrench, Fuel,
    TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
    Clock, Activity, BarChart3, Shield, Zap, ArrowUpRight
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid, Area, AreaChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedNumber, StaggerContainer, StaggerItem } from '../components/AnimatedComponents';

/* ── colour tokens ── */
const COLORS = {
    indigo: '#6366f1',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    cyan: '#06b6d4',
    violet: '#8b5cf6',
};

const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e'];

/* ── tiny helpers ── */
const fmt = (n) => n?.toLocaleString('en-IN') ?? '—';
const fmtCur = (n) => '₹' + fmt(Math.round(n));

/* ── gradient KPI card ── */
const KpiCard = ({ label, value, prefix = '', suffix = '', icon: Icon, color, trend, trendLabel, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` }}
        style={{
            background: `linear-gradient(135deg, #141414 0%, #1a1a1a 100%)`,
            border: `1px solid ${color}30`,
            borderRadius: '20px',
            padding: '24px 24px 20px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'default',
        }}
    >
        {/* glow blob */}
        <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '100px', height: '100px', borderRadius: '50%',
            background: `${color}18`, filter: 'blur(30px)', pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{
                width: '46px', height: '46px', borderRadius: '14px',
                background: `${color}15`, border: `1px solid ${color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon size={22} color={color} />
            </div>
            {trend !== undefined && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '11px', fontWeight: 700, padding: '4px 10px',
                    borderRadius: '20px',
                    background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                    color: trend >= 0 ? '#10b981' : '#f43f5e',
                    border: `1px solid ${trend >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                }}>
                    {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>

        <p style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>
            {label}
        </p>
        <h3 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: '-1px' }}>
            {prefix}<AnimatedNumber value={value} />{suffix}
        </h3>
        {trendLabel && (
            <p style={{ fontSize: '12px', color: '#444', margin: 0 }}>{trendLabel}</p>
        )}
    </motion.div>
);

/* ── section heading ── */
const SectionHead = ({ icon: Icon, title, color = '#6366f1' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <Icon size={16} color={color} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>{title}</h3>
    </div>
);

/* ── panel wrapper ── */
const Panel = ({ children, style }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '20px',
            padding: '24px',
            ...style
        }}
    >
        {children}
    </motion.div>
);

/* ── health bar row ── */
const HealthBar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: '#888', fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: '13px', color, fontWeight: 800 }}>{value}/{max}</span>
        </div>
        <div style={{ height: '5px', background: '#1e1e1e', borderRadius: '3px', overflow: 'hidden' }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value / max) * 100}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ height: '100%', background: color, borderRadius: '3px' }}
            />
        </div>
    </div>
);

/* ── custom tooltip ── */
const ChartTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#ccc'
        }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#fff' }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ margin: '2px 0', color: p.color }}>
                    {p.name}: <strong>{p.value}</strong>
                </p>
            ))}
        </div>
    );
};

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [now] = useState(new Date());

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const load = async () => {
            try {
                const [v, d, t, e] = await Promise.all([
                    axios.get('http://localhost:5000/api/vehicles', { headers }),
                    axios.get('http://localhost:5000/api/drivers', { headers }),
                    axios.get('http://localhost:5000/api/trips', { headers }),
                    axios.get('http://localhost:5000/api/expenses', { headers }),
                ]);
                setVehicles(v.data);
                setTrips(t.data);
                setExpenses(e.data);
                setStats({
                    totalVehicles: v.data.length,
                    activeVehicles: v.data.filter(x => x.status === 'Available' || x.status === 'On Trip').length,
                    inMaintenance: v.data.filter(x => x.status === 'In Shop').length,
                    outOfService: v.data.filter(x => x.status === 'Out of Service').length,
                    activeDrivers: d.data.filter(dr => dr.status === 'On Duty').length,
                    totalDrivers: d.data.length,
                    totalTrips: t.data.length,
                    pendingTrips: t.data.filter(tr => tr.status === 'Draft' || tr.status === 'Dispatched').length,
                    completedTrips: t.data.filter(tr => tr.status === 'Completed').length,
                    totalExpenses: e.data.reduce((a, c) => a + c.amount, 0),
                    fuelCost: e.data.filter(x => x.type === 'Fuel').reduce((a, c) => a + c.amount, 0),
                    maintCost: e.data.filter(x => x.type === 'Maintenance').reduce((a, c) => a + c.amount, 0),
                    revenue: e.data.filter(x => x.type === 'Revenue').reduce((a, c) => a + c.amount, 0),
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #1e1e1e', borderTop: '3px solid #6366f1' }}
            />
            <p style={{ color: '#444', fontSize: '14px', fontWeight: 600 }}>Loading fleet data…</p>
        </div>
    );

    /* derived chart data */
    const vehicleStatusData = [
        { name: 'Available', value: vehicles.filter(v => v.status === 'Available').length },
        { name: 'On Trip', value: vehicles.filter(v => v.status === 'On Trip').length },
        { name: 'In Shop', value: vehicles.filter(v => v.status === 'In Shop').length },
        { name: 'Out of Service', value: vehicles.filter(v => v.status === 'Out of Service').length },
    ].filter(d => d.value > 0);

    const tripStatusData = [
        { name: 'Draft', count: trips.filter(t => t.status === 'Draft').length },
        { name: 'Dispatched', count: trips.filter(t => t.status === 'Dispatched').length },
        { name: 'Completed', count: trips.filter(t => t.status === 'Completed').length },
        { name: 'Cancelled', count: trips.filter(t => t.status === 'Cancelled').length },
    ];

    const expenseBreakdown = [
        { name: 'Fuel', amount: stats?.fuelCost || 0 },
        { name: 'Maintenance', amount: stats?.maintCost || 0 },
        { name: 'Other', amount: Math.max(0, (stats?.totalExpenses || 0) - (stats?.fuelCost || 0) - (stats?.maintCost || 0)) },
    ].filter(d => d.amount > 0);

    const recentTrips = [...trips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

    const statusColor = { Draft: '#6366f1', Dispatched: '#f59e0b', Completed: '#10b981', Cancelled: '#f43f5e' };
    const statusBg = { Draft: 'rgba(99,102,241,0.1)', Dispatched: 'rgba(245,158,11,0.1)', Completed: 'rgba(16,185,129,0.1)', Cancelled: 'rgba(244,63,94,0.1)' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* ── HERO HEADER ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'linear-gradient(135deg, #0f0f0f 0%, #141414 50%, #0f0f1a 100%)',
                    border: '1px solid #1e1e2e',
                    borderRadius: '24px',
                    padding: '32px 36px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* bg accent */}
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-40px', left: '200px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                width: '42px', height: '42px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(99,102,241,0.4)'
                            }}>
                                <Activity size={22} color="#fff" />
                            </div>
                            <div>
                                <h1 style={{
                                    fontSize: '28px', fontWeight: 900, margin: 0,
                                    background: 'linear-gradient(135deg, #fff 30%, #a5b4fc)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                }}>
                                    Command Center
                                </h1>
                                <p style={{ fontSize: '13px', color: '#555', margin: 0, fontWeight: 600 }}>
                                    Fleet overview and real-time status
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '9px 16px', borderRadius: '12px',
                            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                        }}>
                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>System Online</span>
                        </div>
                        <div style={{ padding: '9px 16px', borderRadius: '12px', background: '#1a1a1a', border: '1px solid #242424' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#555' }}>
                                {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* quick metrics strip */}
                <div style={{
                    marginTop: '28px',
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '12px'
                }}>
                    {[
                        { label: 'Total Fleet', val: stats?.totalVehicles, color: COLORS.indigo },
                        { label: 'Active Vehicles', val: stats?.activeVehicles, color: COLORS.emerald },
                        { label: 'In Maintenance', val: stats?.inMaintenance, color: COLORS.amber },
                        { label: 'Pending Trips', val: stats?.pendingTrips, color: COLORS.cyan },
                        { label: 'Active Drivers', val: stats?.activeDrivers, color: COLORS.violet },
                        { label: 'Completed Trips', val: stats?.completedTrips, color: COLORS.emerald },
                    ].map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 * i }}
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: `1px solid ${m.color}20`,
                                borderRadius: '12px',
                                padding: '12px 16px',
                            }}
                        >
                            <p style={{ fontSize: '10px', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>{m.label}</p>
                            <p style={{ fontSize: '22px', fontWeight: 900, color: m.color, margin: 0 }}>{m.val ?? '—'}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ── KPI CARDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                <KpiCard label="Total Fuel Cost" value={Math.round(stats?.fuelCost ?? 0)} prefix="₹" icon={Fuel} color={COLORS.amber} trend={-8} trendLabel="vs last month" delay={0.05} />
                <KpiCard label="Maintenance Cost" value={Math.round(stats?.maintCost ?? 0)} prefix="₹" icon={Wrench} color={COLORS.rose} trend={12} trendLabel="vs last month" delay={0.1} />
                <KpiCard label="Total Revenue" value={Math.round(stats?.revenue ?? 0)} prefix="₹" icon={TrendingUp} color={COLORS.emerald} trend={18} trendLabel="vs last month" delay={0.15} />
                <KpiCard label="Total Expenses" value={Math.round(stats?.totalExpenses ?? 0)} prefix="₹" icon={Receipt} color={COLORS.violet} trendLabel="Overall spend" delay={0.2} />
            </div>

            {/* ── CHARTS ROW ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Vehicle Status Doughnut */}
                <Panel>
                    <SectionHead icon={Truck} title="Vehicle Status" color={COLORS.indigo} />
                    {vehicleStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={vehicleStatusData} cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={90}
                                    paddingAngle={3} dataKey="value"
                                >
                                    {vehicleStatusData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '10px', fontSize: '12px', color: '#ccc' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#888' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: '#333', fontSize: '14px' }}>No vehicle data</p>
                        </div>
                    )}
                </Panel>

                {/* Trips by Status Bar */}
                <Panel>
                    <SectionHead icon={BarChart3} title="Trips by Status" color={COLORS.cyan} />
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={tripStatusData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<ChartTip />} />
                            <Bar dataKey="count" name="Trips" radius={[6, 6, 0, 0]}
                                fill="url(#barGrad)"
                            />
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={COLORS.cyan} />
                                    <stop offset="100%" stopColor={COLORS.indigo} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </Panel>
            </div>

            {/* ── EXPENSE BREAKDOWN + FLEET HEALTH ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>

                {/* Expense area chart */}
                <Panel>
                    <SectionHead icon={Receipt} title="Expense Breakdown" color={COLORS.violet} />
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={expenseBreakdown} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTip />} formatter={(v) => ['₹' + v.toLocaleString('en-IN'), 'Amount']} />
                            <Bar dataKey="amount" name="Amount (₹)" radius={[6, 6, 0, 0]}>
                                {expenseBreakdown.map((_, i) => (
                                    <Cell key={i} fill={[COLORS.amber, COLORS.rose, COLORS.violet][i % 3]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Panel>

                {/* Fleet health */}
                <Panel>
                    <SectionHead icon={Shield} title="Fleet Health" color={COLORS.emerald} />
                    <HealthBar label="Available" value={vehicles.filter(v => v.status === 'Available').length} max={Math.max(1, stats?.totalVehicles)} color={COLORS.emerald} />
                    <HealthBar label="On Trip" value={vehicles.filter(v => v.status === 'On Trip').length} max={Math.max(1, stats?.totalVehicles)} color={COLORS.indigo} />
                    <HealthBar label="In Shop" value={stats?.inMaintenance ?? 0} max={Math.max(1, stats?.totalVehicles)} color={COLORS.amber} />
                    <HealthBar label="Out of Service" value={stats?.outOfService ?? 0} max={Math.max(1, stats?.totalVehicles)} color={COLORS.rose} />
                    <div style={{ marginTop: '20px', padding: '14px', background: '#0d0d0d', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>Overall Availability</span>
                            <span style={{ fontSize: '18px', fontWeight: 900, color: COLORS.emerald }}>
                                {stats?.totalVehicles > 0 ? Math.round((stats.activeVehicles / stats.totalVehicles) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </Panel>
            </div>

            {/* ── RECENT TRIPS + ALERTS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>

                {/* Recent Trips */}
                <Panel>
                    <SectionHead icon={Route} title="Recent Trips" color={COLORS.cyan} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {recentTrips.length === 0
                            ? <p style={{ color: '#333', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>No trips found</p>
                            : recentTrips.map((trip, i) => (
                                <motion.div
                                    key={trip._id || i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 14px', borderRadius: '12px',
                                        background: '#0d0d0d', border: '1px solid #1a1a1a',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '10px',
                                            background: statusBg[trip.status] || 'rgba(99,102,241,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Route size={16} color={statusColor[trip.status] || '#6366f1'} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#ccc', margin: '0 0 2px' }}>
                                                {trip.origin || 'N/A'} → {trip.destination || 'N/A'}
                                            </p>
                                            <p style={{ fontSize: '11px', color: '#444', margin: 0 }}>
                                                {trip.vehicle?.registrationNumber || trip.vehicleId || '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 700, padding: '4px 10px',
                                        borderRadius: '20px',
                                        background: statusBg[trip.status] || 'rgba(99,102,241,0.1)',
                                        color: statusColor[trip.status] || '#6366f1',
                                    }}>
                                        {trip.status}
                                    </span>
                                </motion.div>
                            ))
                        }
                    </div>
                </Panel>

                {/* Alerts */}
                <Panel>
                    <SectionHead icon={AlertTriangle} title="Alerts & Notices" color={COLORS.amber} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {stats?.inMaintenance > 0 && (
                            <AlertRow icon={Wrench} color={COLORS.amber} title="Maintenance Active" desc={`${stats.inMaintenance} vehicle(s) currently in shop`} />
                        )}
                        {stats?.outOfService > 0 && (
                            <AlertRow icon={AlertTriangle} color={COLORS.rose} title="Out of Service" desc={`${stats.outOfService} vehicle(s) need attention`} />
                        )}
                        {stats?.pendingTrips > 0 && (
                            <AlertRow icon={Clock} color={COLORS.cyan} title="Pending Trips" desc={`${stats.pendingTrips} trip(s) awaiting dispatch`} />
                        )}
                        {(stats?.inMaintenance === 0 && stats?.outOfService === 0 && stats?.pendingTrips === 0) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.15)' }}>
                                <CheckCircle size={16} color={COLORS.emerald} />
                                <span style={{ fontSize: '13px', color: COLORS.emerald, fontWeight: 600 }}>All systems nominal</span>
                            </div>
                        )}

                        {/* Recent Expenses mini list */}
                        <div style={{ marginTop: '8px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px' }}>Recent Expenses</p>
                            {recentExpenses.map((exp, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #141414' }}>
                                    <span style={{ fontSize: '12px', color: '#666' }}>{exp.description || exp.type}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#ccc' }}>₹{exp.amount?.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

const AlertRow = ({ icon: Icon, color, title, desc }) => (
    <motion.div
        whileHover={{ x: 4 }}
        style={{
            display: 'flex', gap: '12px', padding: '12px 14px',
            background: `${color}08`, borderRadius: '12px',
            border: `1px solid ${color}20`,
        }}
    >
        <Icon size={16} color={color} style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color, margin: '0 0 2px' }}>{title}</p>
            <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>{desc}</p>
        </div>
    </motion.div>
);

export default Dashboard;
