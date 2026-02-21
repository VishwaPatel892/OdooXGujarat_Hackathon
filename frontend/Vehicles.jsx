import React, { useState, useMemo } from 'react';
import {
    Plus, Search, Trash2, ChevronDown, User, X,
    Truck, Car, BusFront, Gauge, MapPin, Weight,
    CheckCircle, AlertTriangle, XCircle, Navigation2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const INITIAL_VEHICLES = [
    { id: 1, plate: 'UP65-AH-2009', driverName: 'Ravi Sharma', type: 'Truck', maxLoad: 8000, odometer: 142300, region: 'North Delhi', status: 'Available' },
    { id: 2, plate: 'MH12-XY-4521', driverName: 'Priya Mehta', type: 'Van', maxLoad: 2000, odometer: 87650, region: 'Mumbai West', status: 'On Trip' },
    { id: 3, plate: 'KA09-AB-7731', driverName: 'Arun Kumar', type: 'SUV', maxLoad: 1200, odometer: 55200, region: 'Bangalore', status: 'In Shop' },
    { id: 4, plate: 'DL01-PQ-3302', driverName: 'Sonu Verma', type: 'Sedan', maxLoad: 600, odometer: 33900, region: 'South Delhi', status: 'Available' },
    { id: 5, plate: 'GJ05-CD-8812', driverName: 'Mohan Patel', type: 'Truck', maxLoad: 12000, odometer: 298400, region: 'Ahmedabad', status: 'Out of Service' },
    { id: 6, plate: 'TN22-EF-1190', driverName: 'Deepa Nair', type: 'Van', maxLoad: 2500, odometer: 61500, region: 'Chennai', status: 'On Trip' },
    { id: 7, plate: 'RJ14-GH-6645', driverName: 'Vikram Singh', type: 'SUV', maxLoad: 1000, odometer: 44800, region: 'Jaipur', status: 'Available' },
    { id: 8, plate: 'WB23-IJ-9021', driverName: 'Anita Das', type: 'Sedan', maxLoad: 550, odometer: 22100, region: 'Kolkata East', status: 'In Shop' },
    { id: 9, plate: 'MP07-KL-5537', driverName: 'Rahul Gupta', type: 'Truck', maxLoad: 9500, odometer: 178900, region: 'Indore', status: 'On Trip' },
    { id: 10, plate: 'PB11-MN-4423', driverName: 'Simran Kaur', type: 'Van', maxLoad: 1800, odometer: 39200, region: 'Ludhiana', status: 'Available' },
];

// ─── STATUS CONFIG ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    'Available': { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', glow: 'rgba(74,222,128,0.15)', icon: CheckCircle },
    'On Trip': { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', glow: 'rgba(96,165,250,0.15)', icon: Navigation2 },
    'In Shop': { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', glow: 'rgba(251,191,36,0.15)', icon: AlertTriangle },
    'Out of Service': { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', glow: 'rgba(248,113,113,0.15)', icon: XCircle },
};

const TYPE_ICONS = { Truck: Truck, Van: BusFront, SUV: Car, Sedan: Car };

// ─── AVATAR COLORS ──────────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
    ['#4f46e5', '#7c3aed'], ['#0891b2', '#0e7490'], ['#059669', '#047857'],
    ['#d97706', '#b45309'], ['#dc2626', '#b91c1c'], ['#7c3aed', '#6d28d9'],
    ['#0284c7', '#0369a1'], ['#16a34a', '#15803d'], ['#ea580c', '#c2410c'],
    ['#db2777', '#be185d'],
];

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────────

const DriverAvatar = ({ name, index }) => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const [g1, g2] = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.4 }}
            whileHover={{ scale: 1.1 }}
            style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `linear-gradient(135deg, ${g1}, ${g2})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0,
                boxShadow: `0 0 0 2px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.4)`,
                cursor: 'default', userSelect: 'none',
            }}
        >
            {initials}
        </motion.div>
    );
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Available'];
    const Icon = cfg.icon;
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.35 }}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 999,
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                color: cfg.color, fontSize: 11, fontWeight: 700,
                letterSpacing: '0.03em', textTransform: 'uppercase',
                boxShadow: `0 0 10px ${cfg.glow}`, whiteSpace: 'nowrap',
            }}
        >
            <Icon size={11} />
            {status}
        </motion.span>
    );
};

const DeleteModal = ({ vehicle, onConfirm, onCancel }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
        onClick={onCancel}
    >
        <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            onClick={e => e.stopPropagation()}
            style={{
                background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '36px 32px', maxWidth: 420, width: '100%',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 0 20px rgba(239,68,68,0.15)'
                }}>
                    <Trash2 size={26} color="#f87171" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
                    Delete Vehicle
                </h3>
                <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7, margin: 0 }}>
                    Are you sure you want to delete&nbsp;
                    <strong style={{ color: '#eee' }}>{vehicle?.plate}</strong>?
                    <br />This action cannot be undone.
                </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <motion.button
                    whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.08)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onCancel}
                    style={{
                        flex: 1, padding: '13px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#aaa', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    Cancel
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onConfirm}
                    style={{
                        flex: 1, padding: '13px', borderRadius: 12,
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.3)', transition: 'all 0.2s'
                    }}
                >
                    Delete
                </motion.button>
            </div>
        </motion.div>
    </motion.div>
);

// ─── SELECT DROPDOWN ────────────────────────────────────────────────────────────
const FilterSelect = ({ value, onChange, options, label }) => (
    <div style={{ position: 'relative' }}>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
                appearance: 'none', padding: '10px 36px 10px 14px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, color: value === 'All' ? '#666' : '#eee',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', outline: 'none',
                colorScheme: 'dark', transition: 'border-color 0.2s', minWidth: 140,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
            {options.map(o => <option key={o} value={o} style={{ background: '#1a1a1a' }}>{o === 'All' ? `${label}: All` : o}</option>)}
        </select>
        <ChevronDown size={14} color="#555" style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
);

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────
const Vehicles = () => {
    const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ plate: '', driverName: '', type: 'Truck', maxLoad: '', odometer: '', region: '', status: 'Available' });

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return vehicles.filter(v => {
            const matchSearch = !q ||
                v.plate.toLowerCase().includes(q) ||
                v.region.toLowerCase().includes(q) ||
                v.driverName.toLowerCase().includes(q);
            const matchType = typeFilter === 'All' || v.type === typeFilter;
            const matchStatus = statusFilter === 'All' || v.status === statusFilter;
            return matchSearch && matchType && matchStatus;
        });
    }, [vehicles, search, typeFilter, statusFilter]);

    const confirmDelete = () => {
        setVehicles(prev => prev.filter(v => v.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    const handleAdd = e => {
        e.preventDefault();
        const newV = { ...form, id: Date.now(), maxLoad: Number(form.maxLoad), odometer: Number(form.odometer) };
        setVehicles(prev => [newV, ...prev]);
        setForm({ plate: '', driverName: '', type: 'Truck', maxLoad: '', odometer: '', region: '', status: 'Available' });
        setShowAdd(false);
    };

    const inputCls = {
        width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
        color: '#eee', fontSize: 13, outline: 'none', colorScheme: 'dark',
        transition: 'border-color 0.2s', boxSizing: 'border-box',
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', gap: 28, minHeight: '100vh' }}
            >
                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                            Vehicle Registry
                        </h1>
                        <p style={{ fontSize: 14, color: '#555', margin: 0, fontWeight: 500 }}>
                            <span style={{ color: '#818cf8', fontWeight: 700 }}>{filtered.length}</span>
                            &nbsp;vehicle{filtered.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAdd(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '11px 20px', borderRadius: 12, border: 'none',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.3)', transition: 'all 0.2s'
                        }}
                    >
                        <Plus size={17} /> Add Vehicle
                    </motion.button>
                </div>

                {/* ── FILTERS ── */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
                        <Search size={16} color="#444" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            placeholder="Search plate, region, or driver..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                ...inputCls, paddingLeft: 40,
                                fontSize: 14, borderRadius: 12, width: '100%',
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                    </div>
                    <FilterSelect value={typeFilter} onChange={setTypeFilter} options={['All', 'Truck', 'Van', 'SUV', 'Sedan']} label="Type" />
                    <FilterSelect value={statusFilter} onChange={setStatusFilter} options={['All', 'Available', 'On Trip', 'In Shop', 'Out of Service']} label="Status" />
                </div>

                {/* ── TABLE ── */}
                <div style={{ overflowX: 'auto', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                {['License Plate', 'Driver', 'Type', 'Max Load', 'Odometer', 'Region', 'Status', 'Actions'].map(col => (
                                    <th key={col} style={{
                                        padding: '14px 18px', textAlign: 'left',
                                        fontSize: 11, fontWeight: 700, color: '#444',
                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                        whiteSpace: 'nowrap',
                                    }}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <motion.tbody>
                            <AnimatePresence>
                                {filtered.map((v, i) => {
                                    const TypeIcon = TYPE_ICONS[v.type] || Truck;
                                    return (
                                        <motion.tr
                                            key={v.id}
                                            initial={{ opacity: 0, y: -12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                                            transition={{ delay: i * 0.04, duration: 0.3 }}
                                            whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s', cursor: 'default' }}
                                        >
                                            {/* License Plate */}
                                            <td style={{ padding: '14px 18px' }}>
                                                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: '#c7d2fe', letterSpacing: '0.05em' }}>
                                                    {v.plate}
                                                </span>
                                            </td>

                                            {/* Driver */}
                                            <td style={{ padding: '14px 18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <DriverAvatar name={v.driverName} index={v.id} />
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#ddd', whiteSpace: 'nowrap' }}>
                                                        {v.driverName}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td style={{ padding: '14px 18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <TypeIcon size={14} color="#818cf8" />
                                                    </div>
                                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#bbb' }}>{v.type}</span>
                                                </div>
                                            </td>

                                            {/* Max Load */}
                                            <td style={{ padding: '14px 18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <Weight size={13} color="#555" />
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#aaa' }}>
                                                        {v.maxLoad.toLocaleString()} kg
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Odometer */}
                                            <td style={{ padding: '14px 18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <Gauge size={13} color="#555" />
                                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#aaa' }}>
                                                        {v.odometer.toLocaleString()} km
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Region */}
                                            <td style={{ padding: '14px 18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <MapPin size={13} color="#555" />
                                                    <span style={{ fontSize: 13, color: '#888', whiteSpace: 'nowrap' }}>{v.region}</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '14px 18px' }}>
                                                <StatusBadge status={v.status} />
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '14px 18px' }}>
                                                <motion.button
                                                    whileHover={{ scale: 1.15, background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setDeleteTarget(v)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                                        borderRadius: 8, width: 34, height: 34, display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', color: '#555', transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <Trash2 size={15} />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ padding: '56px 20px', textAlign: 'center' }}>
                                        <Search size={36} color="#2a2a2a" style={{ marginBottom: 12 }} />
                                        <p style={{ color: '#333', fontSize: 15, fontWeight: 600, margin: 0 }}>No vehicles match your filters</p>
                                        <p style={{ color: '#222', fontSize: 13, marginTop: 6 }}>Try adjusting the search or dropdowns</p>
                                    </td>
                                </tr>
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* ── FOOTER SUMMARY ── */}
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    {['Available', 'On Trip', 'In Shop', 'Out of Service'].map(s => {
                        const cfg = STATUS_CONFIG[s];
                        const count = vehicles.filter(v => v.status === s).length;
                        return (
                            <motion.div
                                key={s}
                                whileHover={{ y: -3 }}
                                style={{
                                    flex: '1 1 140px', padding: '14px 18px', borderRadius: 14,
                                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                                    boxShadow: `0 0 20px ${cfg.glow}`, transition: 'all 0.2s',
                                }}
                            >
                                <p style={{ fontSize: 10, fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{s}</p>
                                <p style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>{count}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* ── ADD VEHICLE MODAL ── */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                        onClick={() => setShowAdd(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.88, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0, y: 24 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'linear-gradient(160deg,#1a1a2e,#16213e)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px', maxWidth: 520, width: '100%', boxShadow: '0 30px 70px rgba(0,0,0,0.6)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Add New Vehicle</h3>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex' }}>
                                    <X size={20} />
                                </motion.button>
                            </div>
                            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    {[['License Plate', 'plate', 'text'], ['Driver Name', 'driverName', 'text'], ['Max Load (kg)', 'maxLoad', 'number'], ['Odometer (km)', 'odometer', 'number'], ['Region', 'region', 'text']].map(([label, field, type]) => (
                                        <div key={field} style={{ gridColumn: field === 'region' ? 'span 2' : undefined }}>
                                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                                            <input type={type} required value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                                                style={inputCls}
                                                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                                        <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ ...inputCls, colorScheme: 'dark', appearance: 'none' }}>
                                            {['Truck', 'Van', 'SUV', 'Sedan'].map(t => <option key={t} value={t} style={{ background: '#1a1a1a' }}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                                        <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputCls, colorScheme: 'dark', appearance: 'none' }}>
                                            {['Available', 'On Trip', 'In Shop', 'Out of Service'].map(s => <option key={s} value={s} style={{ background: '#1a1a1a' }}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAdd(false)}
                                        style={{ flex: 1, padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#888', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                                        Cancel
                                    </motion.button>
                                    <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.97 }}
                                        style={{ flex: 1, padding: 12, borderRadius: 10, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
                                        Add Vehicle
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── DELETE MODAL ── */}
            <AnimatePresence>
                {deleteTarget && (
                    <DeleteModal vehicle={deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default Vehicles;
