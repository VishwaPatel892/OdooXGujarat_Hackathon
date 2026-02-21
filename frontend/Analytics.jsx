import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Truck, Activity, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedNumber, StaggerContainer, StaggerItem } from '../components/AnimatedComponents';

const Analytics = () => {
    const [data, setData] = useState({
        tripsByDay: [],
        expensesByType: [],
        fleetUtilization: [],
        revenueVsCost: []
    });
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalExpenses: 0,
        activeVehicles: 0,
        avgMpg: 0
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            // In a real app, these would be dedicated analytics endpoints
            // For now, we'll aggregate from existing data or use mock data for visualization
            const [trips, expenses, vehicles] = await Promise.all([
                axios.get('http://localhost:5000/api/trips', { headers }),
                axios.get('http://localhost:5000/api/expenses', { headers }),
                axios.get('http://localhost:5000/api/vehicles', { headers })
            ]);

            // Simple aggregation for demonstration
            setStats({
                totalTrips: trips.data.length,
                totalExpenses: expenses.data.reduce((s, e) => s + e.amount, 0),
                activeVehicles: vehicles.data.filter(v => v.status === 'Active').length,
                avgMpg: 12.5 // Mock value
            });

            // Mocking trend data for the charts
            setData({
                tripsByDay: [
                    { name: 'Mon', trips: 4 }, { name: 'Tue', trips: 7 }, { name: 'Wed', trips: 5 },
                    { name: 'Thu', trips: 9 }, { name: 'Fri', trips: 12 }, { name: 'Sat', trips: 8 }, { name: 'Sun', trips: 3 }
                ],
                expensesByType: [
                    { name: 'Fuel', value: expenses.data.filter(e => e.type === 'Fuel').reduce((s, e) => s + e.amount, 0) },
                    { name: 'Maintenance', value: expenses.data.filter(e => e.type === 'Maintenance').reduce((s, e) => s + e.amount, 0) }
                ],
                fleetUtilization: [
                    { name: 'Week 1', rate: 65 }, { name: 'Week 2', rate: 72 }, { name: 'Week 3', rate: 85 }, { name: 'Week 4', rate: 78 }
                ],
                revenueVsCost: [
                    { name: 'Jan', cost: 4000, revenue: 6400 },
                    { name: 'Feb', cost: 3000, revenue: 5398 },
                    { name: 'Mar', cost: 2000, revenue: 9800 },
                    { name: 'Apr', cost: 2780, revenue: 3908 },
                    { name: 'May', cost: 1890, revenue: 4800 },
                    { name: 'Jun', cost: 2390, revenue: 3800 }
                ]
            });
        } catch (e) {
            console.error('Analytics load error:', e);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>Fleet Analytics</h1>
                <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>Real-time performance metrics and cost analysis.</p>
            </motion.div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {[
                    { label: 'Total Distance', value: 12450, suffix: ' km', icon: TrendingUp, color: '#4f46e5' },
                    { label: 'Total Expenses', value: stats.totalExpenses, prefix: '₹', icon: DollarSign, color: '#f87171' },
                    { label: 'Total Trips', value: stats.totalTrips, icon: Truck, color: '#fbbf24' },
                    { label: 'Active Fleet', value: stats.activeVehicles, suffix: '%', icon: Activity, color: '#4ade80' },
                ].map((s, i) => (
                    <StaggerItem key={i}>
                        <AnimatedCard style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <s.icon size={22} color={s.color} />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '4px 8px', borderRadius: '6px', height: 'fit-content' }}>
                                    +12.5%
                                </span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</p>
                            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', margin: 0 }}>
                                {s.prefix}<AnimatedNumber value={s.value} />{s.suffix}
                            </h2>
                        </AnimatedCard>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <AnimatedCard style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <PieChart size={20} color="#4f46e5" />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Operating Costs vs Revenue</h3>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.revenueVsCost}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', fontSize: '13px' }}
                                    itemStyle={{ color: '#eee' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="cost" stroke="#f87171" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </AnimatedCard>

                <AnimatedCard style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <Calendar size={20} color="#fbbf24" />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Weekly Trip Distribution</h3>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.tripsByDay}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', fontSize: '13px' }}
                                />
                                <Bar dataKey="trips" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </AnimatedCard>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <AnimatedCard style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <Activity size={20} color="#4ade80" />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>Fleet Utilization Rate</h3>
                    </div>
                    <div style={{ height: '240px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.fleetUtilization}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', fontSize: '13px' }}
                                />
                                <Line type="stepAfter" dataKey="rate" stroke="#4ade80" strokeWidth={3} dot={{ fill: '#4ade80', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </AnimatedCard>

                <AnimatedCard style={{ padding: '24px', background: 'linear-gradient(135deg, #141414 0%, #1a1a1a 100%)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>Quick Insights</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Highest Revenue Day', value: 'Friday', sub: '+18% vs avg', color: '#4f46e5' },
                            { label: 'Fuel Efficiency', value: '14.2 km/L', sub: 'Optimized', color: '#4ade80' },
                            { label: 'Maintenance Alerts', value: '2 Pending', sub: 'Next 48h', color: '#f87171' },
                            { label: 'Peak Hour', value: '09:00 AM', sub: 'High demand', color: '#fbbf24' },
                        ].map((ins, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                                <div style={{ width: '4px', height: '32px', borderRadius: '2px', background: ins.color }} />
                                <div>
                                    <p style={{ fontSize: '11px', color: '#666', fontWeight: 600, margin: 0 }}>{ins.label}</p>
                                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#eee', margin: '2px 0' }}>{ins.value}</p>
                                    <p style={{ fontSize: '10px', color: ins.color, fontWeight: 700, margin: 0 }}>{ins.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedCard>
            </div>
        </div>
    );
};

export default Analytics;
