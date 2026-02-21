import React, { useState, useEffect, useRef } from 'react';
import {
    Zap, Gauge, Leaf, TrendingUp, TrendingDown, Sparkles,
    Truck, Battery, Atom, Fuel, Wrench, Wind, DollarSign,
    BarChart3, Shield, Globe, RefreshCw, ChevronRight,
    Sun, Moon, Activity, Target, Award, TreePine, Droplets, Factory
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard, AnimatedNumber, StaggerContainer, StaggerItem, AnimatedButton } from '../components/AnimatedComponents';

/* ─── CONSTANTS ──────────────────────────────────────────────────────────────── */
const ENERGY_RATES = { road: 8.5, electric: 3.2, antigravity: 1.8 };
const GRAVITY_FACTORS = { road: 1.0, electric: 0.85, antigravity: 0.25 };
const SPEEDS = { road: 60, electric: 75, antigravity: 140 };
const MAINTENANCE_COST_PER_KM = { road: 2.5, electric: 1.5, antigravity: 0.4 };
const CO2_PER_KM = { road: 0.21, electric: 0.05, antigravity: 0 };
const ROAD_WEAR_COST_PER_KM = { road: 1.2, electric: 0.8, antigravity: 0 };

/* ─── FORMULAS ───────────────────────────────────────────────────────────────── */
const calcEnergyCost = (distance, type) => distance * ENERGY_RATES[type] * GRAVITY_FACTORS[type];
const calcTotalCost = (distance, type) => calcEnergyCost(distance, type) + (distance * MAINTENANCE_COST_PER_KM[type]) + (distance * ROAD_WEAR_COST_PER_KM[type]);
const calcTime = (distance, type) => (distance / SPEEDS[type]).toFixed(1);
const calcCO2 = (distance, type) => (distance * CO2_PER_KM[type]).toFixed(1);

/* ─── VISION STATEMENTS ──────────────────────────────────────────────────────── */
const visionStatements = [
    "By integrating anti-gravity transport systems, fleet operational costs could decrease by 65% while increasing delivery efficiency by 2.3x. This positions the company as a pioneer in sustainable logistics.",
    "Anti-gravity fleet deployment enables 140 km/h cargo transit with zero road infrastructure dependency, reducing last-mile delivery time by 58% and eliminating road maintenance overhead entirely.",
    "Our simulations project that a 50-vehicle anti-gravity fleet would save ₹4.2 crore annually, reduce carbon emissions by 94%, and improve delivery reliability to 99.7% — setting a new industry benchmark.",
    "The transition from diesel to anti-gravity propulsion represents a paradigm shift: zero friction, zero emissions, 2.3x speed increase. Early adopters will capture a projected 340% ROI within 18 months.",
    "Combining AI route optimization with anti-gravity vehicles creates a logistics network that is 73% more efficient, 100% carbon-neutral, and capable of serving previously inaccessible terrain at full speed."
];

/* ─── RADAR DATA ──────────────────────────────────────────────────────────────── */
const radarData = [
    { metric: 'Speed', road: 40, electric: 55, antigravity: 95 },
    { metric: 'Efficiency', road: 35, electric: 65, antigravity: 92 },
    { metric: 'Sustainability', road: 20, electric: 60, antigravity: 98 },
    { metric: 'Cost Savings', road: 30, electric: 55, antigravity: 88 },
    { metric: 'Reliability', road: 65, electric: 70, antigravity: 90 },
    { metric: 'Innovation', road: 15, electric: 45, antigravity: 99 },
];

/* ─── TRANSPORT TYPES CONFIG ──────────────────────────────────────────────────── */
const TRANSPORT_TYPES = [
    { key: 'road', label: 'Road (Diesel)', icon: Truck, color: '#f87171', bgGlow: 'rgba(248,113,113,0.1)', borderGlow: 'rgba(248,113,113,0.3)', description: 'Traditional internal combustion' },
    { key: 'electric', label: 'Electric', icon: Battery, color: '#818cf8', bgGlow: 'rgba(129,140,248,0.1)', borderGlow: 'rgba(129,140,248,0.3)', description: 'Battery-powered EV platform' },
    { key: 'antigravity', label: 'Anti-Gravity (Experimental)', icon: Atom, color: '#00ffc8', bgGlow: 'rgba(0,255,200,0.1)', borderGlow: 'rgba(0,255,200,0.3)', description: 'Quantum propulsion system' },
];

/* ─── STYLES ──────────────────────────────────────────────────────────────────── */
const neonCard = (quantum) => ({
    background: quantum
        ? 'linear-gradient(135deg, rgba(0,255,200,0.06), rgba(0,229,255,0.04), rgba(124,58,237,0.06))'
        : 'linear-gradient(135deg, rgba(0,255,200,0.03), rgba(0,229,255,0.02), rgba(124,58,237,0.03))',
    borderRadius: '16px', padding: '24px',
    border: quantum ? '1px solid rgba(0,255,200,0.25)' : '1px solid rgba(0,255,200,0.15)',
    position: 'relative', overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    boxShadow: quantum ? '0 0 30px rgba(0,255,200,0.08)' : 'none'
});

const sectionTitle = { fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' };
const sectionSub = { fontSize: '12px', color: '#555', marginTop: '4px', fontWeight: 600 };

/* ─── ANIMATED RING COMPONENT ─────────────────────────────────────────────────── */
const ProgressRing = ({ value, max, color, size = 100, label, icon: Icon }) => {
    const radius = (size - 12) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(value / max, 1);

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1a1a1a" strokeWidth="6" fill="transparent" />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke={color} strokeWidth="6" fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - progress) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />
            </svg>
            <div style={{ marginTop: '-70px', position: 'relative' }}>
                {Icon && <Icon size={20} color={color} style={{ marginBottom: '4px' }} />}
                <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '2px 0' }}>{value}</p>
            </div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', marginTop: '18px' }}>{label}</p>
        </div>
    );
};

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────────── */
const AntiGravity = () => {
    const [distance, setDistance] = useState(500);
    const [fleetSize, setFleetSize] = useState(10);
    const [selectedType, setSelectedType] = useState('antigravity');
    const [vision, setVision] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [quantumMode, setQuantumMode] = useState(true);
    const [typedVision, setTypedVision] = useState('');
    const typingRef = useRef(null);

    /* ── Vision Typewriter ── */
    const generateVision = () => {
        setIsGenerating(true);
        setVision('');
        setTypedVision('');
        if (typingRef.current) clearInterval(typingRef.current);

        setTimeout(() => {
            const stmt = visionStatements[Math.floor(Math.random() * visionStatements.length)];
            setVision(stmt);
            setIsGenerating(false);
            let idx = 0;
            setTypedVision('');
            typingRef.current = setInterval(() => {
                idx++;
                setTypedVision(stmt.slice(0, idx));
                if (idx >= stmt.length) clearInterval(typingRef.current);
            }, 18);
        }, 1200);
    };

    useEffect(() => () => { if (typingRef.current) clearInterval(typingRef.current); }, []);

    /* ── Calculation values ── */
    const roadCost = calcTotalCost(distance, 'road');
    const elecCost = calcTotalCost(distance, 'electric');
    const agCost = calcTotalCost(distance, 'antigravity');
    const savings = ((1 - agCost / roadCost) * 100).toFixed(0);
    const annualSavings = (roadCost - agCost) * 365 * fleetSize;
    const carbonSaved = (distance * CO2_PER_KM.road * 365 * fleetSize / 1000).toFixed(1);
    const esgScore = Math.min(98, 45 + Math.round(fleetSize * 2.5 + (distance / 100) * 3));
    const sustainIndex = Math.min(99, 30 + Math.round(fleetSize * 3 + (distance / 50)));

    /* ── Comparison Table Data ── */
    const comparisonRows = [
        { metric: 'Fuel / Energy Cost', road: `₹${Math.round(calcEnergyCost(distance, 'road'))}`, electric: `₹${Math.round(calcEnergyCost(distance, 'electric'))}`, antigravity: `₹${Math.round(calcEnergyCost(distance, 'antigravity'))}`, highlight: true },
        { metric: 'Avg Speed', road: `${SPEEDS.road} km/h`, electric: `${SPEEDS.electric} km/h`, antigravity: `${SPEEDS.antigravity} km/h` },
        { metric: 'Transit Time', road: `${calcTime(distance, 'road')} hrs`, electric: `${calcTime(distance, 'electric')} hrs`, antigravity: `${calcTime(distance, 'antigravity')} hrs` },
        { metric: 'Maintenance', road: 'High', electric: 'Medium', antigravity: 'Low' },
        { metric: 'CO₂ Emission', road: `${calcCO2(distance, 'road')} kg`, electric: `${calcCO2(distance, 'electric')} kg`, antigravity: 'Zero' },
        { metric: 'Road Wear Cost', road: `₹${Math.round(distance * ROAD_WEAR_COST_PER_KM.road)}`, electric: `₹${Math.round(distance * ROAD_WEAR_COST_PER_KM.electric)}`, antigravity: '₹0 (Zero)' },
    ];

    /* ── Bar Chart Data ── */
    const barChartData = [
        { metric: 'Energy Cost', road: Math.round(calcEnergyCost(distance, 'road')), electric: Math.round(calcEnergyCost(distance, 'electric')), antigravity: Math.round(calcEnergyCost(distance, 'antigravity')) },
        { metric: 'Maint. Cost', road: Math.round(distance * MAINTENANCE_COST_PER_KM.road), electric: Math.round(distance * MAINTENANCE_COST_PER_KM.electric), antigravity: Math.round(distance * MAINTENANCE_COST_PER_KM.antigravity) },
        { metric: 'Time (min)', road: Math.round(distance / SPEEDS.road * 60), electric: Math.round(distance / SPEEDS.electric * 60), antigravity: Math.round(distance / SPEEDS.antigravity * 60) },
    ];

    const nc = neonCard(quantumMode);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className={quantumMode ? 'quantum-mode' : ''}>

            {/* ═══════ HEADER ═══════ */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    ...nc, padding: '32px',
                    background: quantumMode
                        ? 'linear-gradient(135deg, rgba(0,255,200,0.12) 0%, rgba(0,0,0,0) 40%, rgba(124,58,237,0.12) 100%)'
                        : 'linear-gradient(135deg, rgba(0,255,200,0.06) 0%, rgba(0,0,0,0) 40%, rgba(124,58,237,0.06) 100%)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <motion.div
                            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className={quantumMode ? 'neon-glow' : ''}
                            style={{
                                width: '56px', height: '56px', borderRadius: '18px',
                                background: 'rgba(0,255,200,0.15)', border: '1px solid rgba(0,255,200,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(0,255,200,0.2)'
                            }}
                        >
                            <Atom size={28} color="#00ffc8" />
                        </motion.div>
                        <div>
                            <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-0.5px' }}>
                                EcoFlux <span className={quantumMode ? 'shimmer-text' : ''} style={{ color: '#00ffc8' }}>Quantum</span>
                            </h1>
                            <p style={{ fontSize: '14px', color: '#666', fontWeight: 600, margin: '4px 0 0' }}>Propulsion & Logistics Simulator v4.0</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Futuristic Theme Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setQuantumMode(!quantumMode)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px', borderRadius: '14px',
                                background: quantumMode
                                    ? 'linear-gradient(135deg, rgba(0,255,200,0.15), rgba(124,58,237,0.15))'
                                    : 'rgba(255,255,255,0.05)',
                                border: quantumMode ? '1px solid rgba(0,255,200,0.3)' : '1px solid #333',
                                color: quantumMode ? '#00ffc8' : '#888',
                                fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                                letterSpacing: '0.5px', transition: 'all 0.3s'
                            }}
                        >
                            {quantumMode ? <Zap size={14} /> : <Sun size={14} />}
                            {quantumMode ? 'QUANTUM MODE' : 'STANDARD MODE'}
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={quantumMode ? 'neon-glow' : ''}
                            style={{
                                fontSize: '11px', fontWeight: 800, padding: '8px 16px',
                                borderRadius: '20px', color: '#00ffc8',
                                background: 'rgba(0,255,200,0.1)', border: '1px solid rgba(0,255,200,0.3)',
                                letterSpacing: '1px'
                            }}
                        >
                            ⚡ EXPERIMENTAL ENGINE
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* ═══════ 1. TRANSPORT TYPE SELECTOR ═══════ */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Truck size={18} color="#00ffc8" />
                    <h2 style={sectionTitle}>Select Transport Type</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {TRANSPORT_TYPES.map((t) => {
                        const isActive = selectedType === t.key;
                        return (
                            <motion.div
                                key={t.key}
                                whileHover={{ y: -6, boxShadow: `0 8px 30px ${t.bgGlow}` }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedType(t.key)}
                                className={isActive && t.key === 'antigravity' && quantumMode ? 'neon-glow' : ''}
                                style={{
                                    padding: '24px', borderRadius: '16px', cursor: 'pointer',
                                    background: isActive ? t.bgGlow : '#141414',
                                    border: isActive ? `2px solid ${t.borderGlow}` : '1px solid #1e1e1e',
                                    transition: 'all 0.3s', position: 'relative', overflow: 'hidden'
                                }}
                            >
                                {isActive && t.key === 'antigravity' && (
                                    <motion.div
                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            background: `radial-gradient(circle at 50% 0%, ${t.bgGlow}, transparent 70%)`,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', position: 'relative' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '14px',
                                        background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: isActive ? `1px solid ${t.color}40` : 'none'
                                    }}>
                                        <t.icon size={22} color={t.color} />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: isActive ? '#fff' : '#aaa', margin: 0 }}>{t.label}</h4>
                                        <p style={{ fontSize: '11px', color: '#555', margin: '2px 0 0', fontWeight: 600 }}>{t.description}</p>
                                    </div>
                                </div>
                                {isActive && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        style={{ height: '3px', background: t.color, borderRadius: '2px', marginTop: '8px' }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ═══════ 2. SIMULATION PARAMETERS + QUICK STATS ═══════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Simulation Controls */}
                <AnimatedCard style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <Gauge size={20} color="#00ffc8" />
                        <h3 style={sectionTitle}>Simulation Parameters</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 700, color: '#aaa' }}>Distance (KM)</label>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: '#00ffc8' }}>{distance} km</span>
                            </div>
                            <input type="range" min="50" max="2000" step="50" value={distance}
                                onChange={e => setDistance(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#00ffc8', cursor: 'pointer' }} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 700, color: '#aaa' }}>Fleet Scale</label>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: '#00ffc8' }}>{fleetSize} units</span>
                            </div>
                            <input type="range" min="1" max="100" step="1" value={fleetSize}
                                onChange={e => setFleetSize(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#00ffc8', cursor: 'pointer' }} />
                        </div>
                    </div>

                    {/* Formula Display */}
                    <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #222' }}>
                        <p style={{ fontSize: '11px', fontWeight: 800, color: '#444', textTransform: 'uppercase', marginBottom: '8px' }}>Energy Cost Formula</p>
                        <code style={{ fontSize: '13px', color: '#00ffc8', fontFamily: 'monospace', fontWeight: 700 }}>
                            Energy Cost = Distance × Rate × Gᶠ
                        </code>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Gᶠ Road', value: '1.00', color: '#f87171' },
                                { label: 'Gᶠ Electric', value: '0.85', color: '#818cf8' },
                                { label: 'Gᶠ Anti-Gravity', value: '0.25', color: '#00ffc8' },
                            ].map((g, i) => (
                                <span key={i} style={{
                                    fontSize: '11px', fontWeight: 700, padding: '4px 10px',
                                    borderRadius: '8px', background: `${g.color}10`, color: g.color,
                                    border: `1px solid ${g.color}25`
                                }}>
                                    {g.label}: {g.value}
                                </span>
                            ))}
                        </div>
                    </div>
                </AnimatedCard>

                {/* Quick Stats */}
                <StaggerContainer style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {[
                        { label: 'Energy Savings', value: parseInt(savings), suffix: '%', icon: TrendingDown, color: '#00ffc8' },
                        { label: 'Quantum Velocity', value: SPEEDS[selectedType], suffix: ' km/h', icon: Zap, color: '#00e5ff' },
                        { label: 'CO₂ Footprint', value: parseFloat(calcCO2(distance, selectedType)), suffix: ' kg', icon: Leaf, color: '#4ade80' },
                        { label: 'Total Cost', value: Math.round(calcTotalCost(distance, selectedType)), prefix: '₹', icon: DollarSign, color: '#fbbf24' },
                    ].map((s, i) => (
                        <StaggerItem key={i}>
                            <AnimatedCard style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <s.icon size={18} color={s.color} />
                                </div>
                                <p style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', margin: '0 0 4px' }}>{s.label}</p>
                                <h3 style={{ fontSize: '24px', fontWeight: 800, color: s.color, margin: 0 }}>
                                    {s.prefix}<AnimatedNumber value={s.value} />{s.suffix}
                                </h3>
                            </AnimatedCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>

            {/* ═══════ 3. COMPARISON DASHBOARD ═══════ */}
            <div style={nc}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <BarChart3 size={20} color="#00ffc8" />
                    <h3 style={sectionTitle}>Side-by-Side Comparison</h3>
                    <span style={{ ...sectionSub, marginTop: 0, marginLeft: '8px' }}>for {distance} km trip</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #222' }}>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Metric</th>
                                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>🛢 Road Transport</th>
                                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase' }}>⚡ Electric</th>
                                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#00ffc8', textTransform: 'uppercase' }}>
                                    <span className={quantumMode ? 'neon-text' : ''}>🚀 Anti-Gravity</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonRows.map((row, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                                    style={{ borderBottom: '1px solid #1a1a1a' }}
                                >
                                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#bbb' }}>{row.metric}</td>
                                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', color: '#f87171', fontWeight: 600 }}>{row.road}</td>
                                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', color: '#818cf8', fontWeight: 600 }}>{row.electric}</td>
                                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '14px', color: '#00ffc8', fontWeight: 700 }}>{row.antigravity}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ═══════ CHARTS: Bar + Radar ═══════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Grouped Bar Chart */}
                <AnimatedCard style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <BarChart3 size={18} color="#818cf8" />
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>Cost & Time Breakdown</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={barChartData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                            <XAxis dataKey="metric" tick={{ fill: '#666', fontSize: 12, fontWeight: 600 }} />
                            <YAxis tick={{ fill: '#666', fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1a1a1a', border: '1px solid #333',
                                    borderRadius: '10px', fontSize: '12px', color: '#fff'
                                }}
                            />
                            <Bar dataKey="road" fill="#f87171" name="Road (Diesel)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="electric" fill="#818cf8" name="Electric" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="antigravity" fill="#00ffc8" name="Anti-Gravity" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </AnimatedCard>

                {/* Radar Chart */}
                <AnimatedCard style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Target size={18} color="#c084fc" />
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>Performance Radar</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                            <PolarGrid stroke="#222" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: '#888', fontSize: 11, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#555', fontSize: 10 }} />
                            <Radar name="Road" dataKey="road" stroke="#f87171" fill="#f87171" fillOpacity={0.15} />
                            <Radar name="Electric" dataKey="electric" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} />
                            <Radar name="Anti-Gravity" dataKey="antigravity" stroke="#00ffc8" fill="#00ffc8" fillOpacity={0.25} />
                            <Legend
                                wrapperStyle={{ fontSize: '11px', fontWeight: 700 }}
                                iconType="circle"
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </AnimatedCard>
            </div>

            {/* ═══════ 4. ENVIRONMENTAL IMPACT PANEL ═══════ */}
            <div style={nc}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <TreePine size={20} color="#4ade80" />
                    <div>
                        <h3 style={sectionTitle}>Environmental Impact Panel</h3>
                        <p style={sectionSub}>Sustainability metrics for {fleetSize}-vehicle fleet over {distance} km/day</p>
                    </div>
                </div>

                {/* Top row: Ring gauges */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '28px' }}>
                    <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid #1a1a1a' }}>
                        <ProgressRing value={parseFloat(carbonSaved)} max={parseFloat(carbonSaved) + 10} color="#4ade80" label="Carbon Saved (tonnes/yr)" icon={Wind} />
                    </div>
                    <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid #1a1a1a' }}>
                        <ProgressRing value={esgScore} max={100} color="#818cf8" label="ESG Score" icon={Shield} />
                    </div>
                    <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid #1a1a1a' }}>
                        <ProgressRing value={sustainIndex} max={100} color="#00ffc8" label="Sustainability Index" icon={Globe} />
                    </div>
                </div>

                {/* Bottom row: Key metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {[
                        { label: 'Carbon Reduction', value: `${savings}%`, desc: 'vs Road Transport', icon: Factory, color: '#4ade80' },
                        { label: 'ESG Improvement', value: `+${Math.round(esgScore * 0.6)}`, desc: 'Points over baseline', icon: Award, color: '#818cf8' },
                        { label: 'Water Saved', value: `${Math.round(fleetSize * distance * 0.003)} L`, desc: 'Per day (zero coolant)', icon: Droplets, color: '#38bdf8' },
                        { label: 'Annual Savings', value: `₹${(annualSavings / 100000).toFixed(1)}L`, desc: 'Projected fleet savings', icon: TrendingUp, color: '#fbbf24' },
                    ].map((m, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4, borderColor: `${m.color}40` }}
                            style={{
                                padding: '20px', borderRadius: '14px', background: '#111',
                                border: '1px solid #1a1a1a', transition: 'all 0.3s'
                            }}
                        >
                            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                <m.icon size={16} color={m.color} />
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', margin: '0 0 4px' }}>{m.label}</p>
                            <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', margin: '0 0 2px' }}>{m.value}</h4>
                            <p style={{ fontSize: '11px', color: '#444', margin: 0, fontWeight: 600 }}>{m.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ═══════ 5. AI VISION STATEMENT GENERATOR ═══════ */}
            <div style={nc}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>
                            <span className={quantumMode ? 'shimmer-text' : ''}>Future Logistics AI Vision</span>
                        </h3>
                        <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Synthesized from {fleetSize} quantum-linked units</p>
                    </div>
                    <AnimatedButton onClick={generateVision} disabled={isGenerating} variant="primary"
                        style={{ background: 'linear-gradient(135deg, #00ffc8, #00e5ff)', color: '#000', fontWeight: 800 }}>
                        {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        {isGenerating ? 'Synthesizing...' : 'Generate Future Logistics Vision'}
                    </AnimatedButton>
                </div>

                <AnimatePresence mode="wait">
                    {vision ? (
                        <motion.div
                            key="vision"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            style={{
                                padding: '28px 32px', borderRadius: '14px',
                                background: quantumMode ? 'rgba(0,255,200,0.05)' : 'rgba(0,255,200,0.03)',
                                border: '1px solid rgba(0,255,200,0.15)',
                                position: 'relative'
                            }}
                        >
                            <p style={{
                                fontSize: '17px', lineHeight: 1.8, color: '#eee',
                                fontWeight: 500, fontStyle: 'italic', margin: 0
                            }}>
                                "{typedVision}"
                                {typedVision.length < vision.length && (
                                    <span style={{
                                        display: 'inline-block', width: '2px', height: '20px',
                                        background: '#00ffc8', marginLeft: '2px',
                                        animation: 'blink 0.7s infinite'
                                    }} />
                                )}
                            </p>
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffc8' }}
                                />
                                <span style={{ fontSize: '12px', color: '#555', fontWeight: 700 }}>ECOFLUX QUANTUM AI</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                padding: '50px', textAlign: 'center', borderRadius: '14px',
                                border: '1px dashed #222', background: 'rgba(255,255,255,0.01)'
                            }}
                        >
                            <Sparkles size={28} color="#333" style={{ marginBottom: '12px' }} />
                            <p style={{ fontSize: '14px', color: '#444', fontWeight: 600 }}>Click "Generate Future Logistics Vision" to initiate quantum vision synthesis</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ═══════ VEHICLE TYPE EFFICIENCY CARDS ═══════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {[
                    { type: 'Internal Combustion', icon: Truck, color: '#f87171', efficiency: 15, features: ['High Maintenance', 'Road Dependent', 'CO₂ Emitting'] },
                    { type: 'Electric Platform', icon: Battery, color: '#818cf8', efficiency: 45, features: ['Moderate Maint.', 'Charging Infra', 'Low Emission'] },
                    { type: 'Quantum Anti-Gravity', icon: Atom, color: '#00ffc8', efficiency: 98, features: ['Zero Road Wear', 'Frictionless', 'AI Linked'] },
                ].map((t, i) => (
                    <AnimatedCard key={i} style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <motion.div
                                className={t.color === '#00ffc8' && quantumMode ? 'float-anim' : ''}
                                style={{
                                    width: '44px', height: '44px', borderRadius: '14px',
                                    background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `1px solid ${t.color}25`
                                }}
                            >
                                <t.icon size={22} color={t.color} />
                            </motion.div>
                            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0 }}>{t.type}</h4>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#555' }}>Efficiency Index</span>
                                <span style={{ fontSize: '11px', fontWeight: 800, color: t.color }}>{t.efficiency}%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${t.efficiency}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                                    style={{ height: '100%', background: t.color, boxShadow: `0 0 8px ${t.color}80` }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {t.features.map((feat, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ChevronRight size={12} color={t.color} />
                                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </AnimatedCard>
                ))}
            </div>
        </div>
    );
};

export default AntiGravity;
