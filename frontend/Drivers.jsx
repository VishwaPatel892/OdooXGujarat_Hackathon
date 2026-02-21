import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Plus, Phone, Calendar, X, Trash2, Edit3, AlertTriangle, Shield, Users, UserCheck, UserX } from 'lucide-react';
import { useConfirm, useToast } from '../context/ConfirmContext';
import { AnimatedNumber, AnimatedButton, StaggerContainer, StaggerItem } from '../components/AnimatedComponents';
import { motion, AnimatePresence } from 'framer-motion';

/* ── colour tokens ── */
const STATUS_STYLES = {
    'On Duty': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)' },
    'Off Duty': { bg: 'rgba(100,116,139,0.12)', color: '#64748b', border: '1px solid rgba(100,116,139,0.25)' },
    'Suspended': { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' },
};

const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#f59e0b';
    return '#ef4444';
};

const getScoreBg = (score) => {
    if (score >= 90) return 'rgba(34,197,94,0.12)';
    if (score >= 80) return 'rgba(245,158,11,0.12)';
    return 'rgba(239,68,68,0.12)';
};

const isLicenseExpired = (date) => new Date(date) < new Date();
const isLicenseExpiringSoon = (date) => {
    const expiry = new Date(date);
    const now = new Date();
    const sixMonths = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    return expiry > now && expiry <= sixMonths;
};

/* ── input style helper ── */
const inputStyle = {
    width: '100%', padding: '11px 14px', fontSize: '14px', color: '#eee',
    background: '#1c1c1c', border: '2px solid #2a2a2a', borderRadius: '10px',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
};

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [form, setForm] = useState({
        name: '', licenseNumber: '', licenseExpiryDate: '', phone: '', status: 'Off Duty',
        safetyScore: '', tripCompletionRate: ''
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const confirm = useConfirm();
    const toast = useToast();

    const fetchDrivers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/drivers', { headers });
            setDrivers(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDrivers(); }, []);

    /* ── filtered list ── */
    const filtered = useMemo(() => {
        const q = filter.toLowerCase();
        return drivers.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.phone?.toLowerCase().includes(q) ||
            d.licenseNumber?.toLowerCase().includes(q)
        );
    }, [drivers, filter]);

    /* ── stats ── */
    const stats = useMemo(() => ({
        total: drivers.length,
        onDuty: drivers.filter(d => d.status === 'On Duty').length,
        offDuty: drivers.filter(d => d.status === 'Off Duty').length,
        suspended: drivers.filter(d => d.status === 'Suspended').length,
        avgSafety: drivers.length > 0
            ? Math.round(drivers.reduce((s, d) => s + (d.safetyScore || 0), 0) / drivers.length)
            : 0,
        expiredLicenses: drivers.filter(d => isLicenseExpired(d.licenseExpiryDate)).length,
    }), [drivers]);

    /* ── form handlers ── */
    const resetForm = () => {
        setForm({ name: '', licenseNumber: '', licenseExpiryDate: '', phone: '', status: 'Off Duty', safetyScore: '', tripCompletionRate: '' });
        setEditingDriver(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (d) => {
        setEditingDriver(d);
        setForm({
            name: d.name,
            licenseNumber: d.licenseNumber,
            licenseExpiryDate: d.licenseExpiryDate ? new Date(d.licenseExpiryDate).toISOString().split('T')[0] : '',
            phone: d.phone,
            status: d.status,
            safetyScore: d.safetyScore ?? '',
            tripCompletionRate: d.tripCompletionRate ?? '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            safetyScore: form.safetyScore !== '' ? Number(form.safetyScore) : undefined,
            tripCompletionRate: form.tripCompletionRate !== '' ? Number(form.tripCompletionRate) : undefined,
        };
        try {
            if (editingDriver) {
                await axios.patch(`http://localhost:5000/api/drivers/${editingDriver._id}`, payload, { headers });
                toast('Driver updated successfully', 'success');
            } else {
                await axios.post('http://localhost:5000/api/drivers', payload, { headers });
                toast('Driver added successfully', 'success');
            }
            setShowModal(false);
            resetForm();
            fetchDrivers();
        } catch (e) { toast(editingDriver ? 'Failed to update driver' : 'Failed to add driver', 'error'); }
    };

    const handleDelete = async (d) => {
        const ok = await confirm({ title: 'Delete Driver', message: `Delete ${d.name}? This action cannot be undone.` });
        if (!ok) return;
        try {
            await axios.delete(`http://localhost:5000/api/drivers/${d._id}`, { headers });
            toast('Driver removed', 'success');
            fetchDrivers();
        } catch (e) { toast('Failed to delete', 'error'); }
    };

    /* ── loading state ── */
    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #1e1e1e', borderTop: '3px solid #6366f1' }}
            />
            <p style={{ color: '#444', fontSize: '14px', fontWeight: 600 }}>Loading drivers…</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── HEADER ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Driver Management</h1>
                    <p style={{ fontSize: '14px', color: '#555', margin: 0, fontWeight: 500 }}>
                        <span style={{ color: '#818cf8', fontWeight: 700 }}>{drivers.length}</span> operators registered
                    </p>
                </motion.div>
                <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={openAddModal}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '11px 20px', borderRadius: '12px', border: 'none',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                    }}
                >
                    <Plus size={17} /> Add Driver
                </motion.button>
            </div>

            {/* ── KPI CARDS ── */}
            <StaggerContainer>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                    {[
                        { label: 'Total Drivers', value: stats.total, icon: Users, color: '#6366f1' },
                        { label: 'On Duty', value: stats.onDuty, icon: UserCheck, color: '#22c55e' },
                        { label: 'Off Duty', value: stats.offDuty, icon: UserX, color: '#64748b' },
                        { label: 'Suspended', value: stats.suspended, icon: AlertTriangle, color: '#ef4444' },
                        { label: 'Avg Safety', value: stats.avgSafety, icon: Shield, color: '#f59e0b', suffix: '%' },
                        { label: 'Expired Licenses', value: stats.expiredLicenses, icon: Calendar, color: '#f43f5e' },
                    ].map((kpi, i) => (
                        <StaggerItem key={i}>
                            <motion.div
                                whileHover={{ y: -4, boxShadow: `0 12px 30px rgba(0,0,0,0.4)` }}
                                style={{
                                    background: `linear-gradient(135deg, #141414 0%, #1a1a1a 100%)`,
                                    border: `1px solid ${kpi.color}25`,
                                    borderRadius: '16px', padding: '18px 20px',
                                    position: 'relative', overflow: 'hidden', cursor: 'default',
                                }}
                            >
                                <div style={{
                                    position: 'absolute', top: '-20px', right: '-20px',
                                    width: '70px', height: '70px', borderRadius: '50%',
                                    background: `${kpi.color}12`, filter: 'blur(20px)', pointerEvents: 'none'
                                }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: `${kpi.color}15`, border: `1px solid ${kpi.color}25`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <kpi.icon size={18} color={kpi.color} />
                                    </div>
                                </div>
                                <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>{kpi.label}</p>
                                <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: 0 }}>
                                    <AnimatedNumber value={kpi.value} />{kpi.suffix || ''}
                                </p>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </div>
            </StaggerContainer>

            {/* ── SEARCH BAR ── */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1 1 320px', minWidth: '200px' }}>
                    <Search size={16} color="#444" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        type="text" placeholder="Search by name, phone, or license..."
                        value={filter} onChange={e => setFilter(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 14px 10px 42px', fontSize: '14px',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px', color: '#eee', outline: 'none', fontWeight: 500,
                            transition: 'border-color 0.2s', boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                </div>
            </div>

            {/* ── TABLE ── */}
            <div style={{
                overflowX: 'auto', borderRadius: '18px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(12px)',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            {['Name', 'Phone', 'License #', 'License Expiry', 'Status', 'Completion %', 'Safety Score', 'Actions'].map(col => (
                                <th key={col} style={{
                                    padding: '14px 18px', textAlign: 'left',
                                    fontSize: '11px', fontWeight: 700, color: '#444',
                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                    whiteSpace: 'nowrap',
                                }}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <motion.tbody>
                        <AnimatePresence>
                            {filtered.map((d, i) => {
                                const expired = isLicenseExpired(d.licenseExpiryDate);
                                const expiringSoon = isLicenseExpiringSoon(d.licenseExpiryDate);
                                const statusStyle = STATUS_STYLES[d.status] || STATUS_STYLES['Off Duty'];
                                const score = d.safetyScore ?? 0;
                                const scoreColor = getScoreColor(score);
                                const scoreBg = getScoreBg(score);

                                return (
                                    <motion.tr
                                        key={d._id || i}
                                        initial={{ opacity: 0, y: -12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                                        transition={{ delay: i * 0.04, duration: 0.3 }}
                                        whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s', cursor: 'default' }}
                                    >
                                        {/* Name */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{d.name}</span>
                                        </td>

                                        {/* Phone */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>{d.phone}</span>
                                            </div>
                                        </td>

                                        {/* License # */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#c7d2fe', letterSpacing: '0.03em' }}>
                                                {d.licenseNumber}
                                            </span>
                                        </td>

                                        {/* License Expiry */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: 600, color: expired ? '#ef4444' : expiringSoon ? '#f59e0b' : '#94a3b8' }}>
                                                    {new Date(d.licenseExpiryDate).toLocaleDateString('en-CA')}
                                                </span>
                                                {(expired || expiringSoon) && (
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                    >
                                                        <AlertTriangle size={14} color={expired ? '#ef4444' : '#f59e0b'} />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center',
                                                    padding: '4px 12px', borderRadius: '999px',
                                                    background: statusStyle.bg, color: statusStyle.color,
                                                    border: statusStyle.border,
                                                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.03em',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {d.status}
                                            </motion.span>
                                        </td>

                                        {/* Completion % */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>
                                                {d.tripCompletionRate != null ? `${d.tripCompletionRate}%` : '—'}
                                            </span>
                                        </td>

                                        {/* Safety Score */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                width: '38px', height: '38px', borderRadius: '50%',
                                                background: scoreBg, border: `2px solid ${scoreColor}40`,
                                                boxShadow: `0 0 12px ${scoreColor}20`,
                                            }}>
                                                <span style={{ fontSize: '12px', fontWeight: 800, color: scoreColor }}>
                                                    {score}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '14px 18px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <motion.button
                                                    whileHover={{ scale: 1.15, background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => openEditModal(d)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                                        borderRadius: '8px', width: '34px', height: '34px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', color: '#555', transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <Edit3 size={15} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.15, background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDelete(d)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                                        borderRadius: '8px', width: '34px', height: '34px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', color: '#555', transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <Trash2 size={15} />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ padding: '56px 20px', textAlign: 'center' }}>
                                    <Search size={36} color="#2a2a2a" style={{ marginBottom: '12px' }} />
                                    <p style={{ color: '#333', fontSize: '15px', fontWeight: 600, margin: 0 }}>No drivers match your search</p>
                                    <p style={{ color: '#222', fontSize: '13px', marginTop: '6px' }}>Try adjusting the search query</p>
                                </td>
                            </tr>
                        )}
                    </motion.tbody>
                </table>
            </div>

            {/* ── FOOTER SUMMARY ── */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                    { label: 'On Duty', count: stats.onDuty, ...STATUS_STYLES['On Duty'] },
                    { label: 'Off Duty', count: stats.offDuty, ...STATUS_STYLES['Off Duty'] },
                    { label: 'Suspended', count: stats.suspended, ...STATUS_STYLES['Suspended'] },
                ].map(s => (
                    <motion.div
                        key={s.label}
                        whileHover={{ y: -3 }}
                        style={{
                            flex: '1 1 140px', padding: '14px 18px', borderRadius: '14px',
                            background: s.bg, border: s.border,
                            boxShadow: `0 0 20px ${s.color}10`, transition: 'all 0.2s',
                        }}
                    >
                        <p style={{ fontSize: '10px', fontWeight: 800, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{s.label}</p>
                        <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: 0 }}>{s.count}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── ADD / EDIT MODAL ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                        }}
                        onClick={() => { setShowModal(false); resetForm(); }}
                    >
                        <motion.div
                            initial={{ scale: 0.88, opacity: 0, y: 24 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.88, opacity: 0, y: 24 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '20px', padding: '32px', maxWidth: '520px', width: '100%',
                                boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>
                                    {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                                </h3>
                                <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex' }}
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    {[
                                        ['Full Name', 'name', 'text'],
                                        ['Phone', 'phone', 'text'],
                                        ['License Number', 'licenseNumber', 'text'],
                                        ['License Expiry', 'licenseExpiryDate', 'date'],
                                        ['Safety Score', 'safetyScore', 'number'],
                                        ['Completion %', 'tripCompletionRate', 'number'],
                                    ].map(([label, field, type]) => (
                                        <div key={field}>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
                                            <input
                                                type={type}
                                                required={!['safetyScore', 'tripCompletionRate'].includes(field)}
                                                value={form[field]}
                                                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                                                style={{ ...inputStyle, ...(type === 'date' ? { colorScheme: 'dark' } : {}) }}
                                                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                                                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
                                            />
                                        </div>
                                    ))}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                                        <select
                                            value={form.status}
                                            onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                                            style={{ ...inputStyle, colorScheme: 'dark', appearance: 'auto' }}
                                        >
                                            {['On Duty', 'Off Duty', 'Suspended'].map(s => (
                                                <option key={s} value={s} style={{ background: '#1a1a1a' }}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { setShowModal(false); resetForm(); }}
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '10px',
                                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                            color: '#888', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                            border: 'none', color: '#fff', fontSize: '14px', fontWeight: 700,
                                            cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                                        }}
                                    >
                                        {editingDriver ? 'Update Driver' : 'Add Driver'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Drivers;
