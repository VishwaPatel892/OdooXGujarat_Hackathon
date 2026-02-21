import React, { useState } from 'react';
import { Fuel, DollarSign, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════
   STATIC DATA — matches screenshot exactly
═══════════════════════════════════════════ */
const EXPENSES_DATA = [
    { id: 1, vehicle: 'ABC-1234', date: '2026-02-20', liters: 120, cost: 198, perLiter: 1.65 },
    { id: 2, vehicle: 'DEF-5678', date: '2026-02-19', liters: 65, cost: 107, perLiter: 1.65 },
    { id: 3, vehicle: 'GHI-9012', date: '2026-02-18', liters: 140, cost: 231, perLiter: 1.65 },
    { id: 4, vehicle: 'MNO-7890', date: '2026-02-17', liters: 80, cost: 132, perLiter: 1.65 },
    { id: 5, vehicle: 'PQR-2345', date: '2026-02-16', liters: 160, cost: 264, perLiter: 1.65 },
    { id: 6, vehicle: 'ABC-1234', date: '2026-02-12', liters: 115, cost: 190, perLiter: 1.65 },
    { id: 7, vehicle: 'JKL-3456', date: '2026-02-14', liters: 45, cost: 74, perLiter: 1.64 },
    { id: 8, vehicle: 'DEF-5678', date: '2026-02-11', liters: 60, cost: 99, perLiter: 1.65 },
];

const totalFuelCost = EXPENSES_DATA.reduce((s, e) => s + e.cost, 0);
const totalOperationalCost = totalFuelCost * 5; // ≈ $6,445 operational factor
const totalLiters = EXPENSES_DATA.reduce((s, e) => s + e.liters, 0);

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const Expenses = () => {
    const [hoveredRow, setHoveredRow] = useState(null);

    /* ── KPI Card ── */
    const KPICard = ({ label, value, icon: Icon, iconColor, iconBg }) => (
        <motion.div
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
            style={{
                flex: '1 1 0',
                background: 'linear-gradient(135deg, #141414 0%, #1a1a2e 100%)',
                border: '1px solid #1e1e1e',
                borderRadius: '16px',
                padding: '22px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                cursor: 'default',
                transition: 'all 0.2s',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                    style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#888',
                        letterSpacing: '0.01em',
                    }}
                >
                    {label}
                </span>
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon size={18} color={iconColor} />
                </div>
            </div>
            <span
                style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    fontFeatureSettings: "'tnum'",
                }}
            >
                {value}
            </span>
        </motion.div>
    );

    /* ── Delete button ── */
    const renderDelete = () => (
        <motion.button
            whileHover={{ scale: 1.15, color: '#f87171' }}
            whileTap={{ scale: 0.9 }}
            style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#555',
                transition: 'all 0.2s',
            }}
        >
            <Trash2 size={14} />
        </motion.button>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* ── HEADER ── */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1
                        style={{
                            fontSize: '26px',
                            fontWeight: 800,
                            color: '#fff',
                            margin: '0 0 4px',
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Fuel &amp; Expenses
                    </h1>
                    <p style={{ fontSize: '14px', color: '#555', margin: 0, fontWeight: 500 }}>
                        <span style={{ color: '#818cf8', fontWeight: 700 }}>{EXPENSES_DATA.length}</span> fuel
                        entries
                    </p>
                </motion.div>
                <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '11px 20px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                    }}
                >
                    <Plus size={17} /> Add Entry
                </motion.button>
            </div>

            {/* ── KPI CARDS ── */}
            <div style={{ display: 'flex', gap: '16px' }}>
                <KPICard
                    label="Total Fuel Cost"
                    value={`$${totalFuelCost.toLocaleString()}`}
                    icon={Fuel}
                    iconColor="#fbbf24"
                    iconBg="rgba(251,191,36,0.15)"
                />
                <KPICard
                    label="Total Operational Cost"
                    value={`$${totalOperationalCost.toLocaleString()}`}
                    icon={DollarSign}
                    iconColor="#ef4444"
                    iconBg="rgba(239,68,68,0.15)"
                />
                <KPICard
                    label="Total Liters"
                    value={totalLiters.toLocaleString()}
                    icon={TrendingUp}
                    iconColor="#3b82f6"
                    iconBg="rgba(59,130,246,0.15)"
                />
            </div>

            {/* ── DATA TABLE ── */}
            <div
                style={{
                    background: '#141414',
                    borderRadius: '16px',
                    border: '1px solid #1e1e1e',
                    overflow: 'hidden',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                                {[
                                    { label: 'Vehicle', align: 'left' },
                                    { label: 'Date', align: 'left' },
                                    { label: 'Liters', align: 'right' },
                                    { label: 'Cost', align: 'right' },
                                    { label: '$/L', align: 'right' },
                                    { label: 'Actions', align: 'center' },
                                ].map((col) => (
                                    <th
                                        key={col.label}
                                        style={{
                                            padding: '14px 22px',
                                            textAlign: col.align,
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: '#555',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            whiteSpace: 'nowrap',
                                            background: '#0f0f0f',
                                        }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <AnimatePresence>
                            <motion.tbody>
                                {EXPENSES_DATA.map((exp, idx) => (
                                    <motion.tr
                                        key={exp.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                                        onMouseEnter={() => setHoveredRow(exp.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        style={{
                                            borderBottom:
                                                idx < EXPENSES_DATA.length - 1
                                                    ? '1px solid rgba(255,255,255,0.04)'
                                                    : 'none',
                                            background:
                                                hoveredRow === exp.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                                            transition: 'background 0.15s ease',
                                            cursor: 'default',
                                        }}
                                    >
                                        {/* Vehicle */}
                                        <td style={{ padding: '16px 22px' }}>
                                            <span
                                                style={{
                                                    fontSize: '13.5px',
                                                    fontWeight: 700,
                                                    color: '#e2e8f0',
                                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                                    letterSpacing: '0.02em',
                                                }}
                                            >
                                                {exp.vehicle}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td style={{ padding: '16px 22px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>
                                                {exp.date}
                                            </span>
                                        </td>

                                        {/* Liters */}
                                        <td style={{ padding: '16px 22px', textAlign: 'right' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>
                                                {exp.liters}L
                                            </span>
                                        </td>

                                        {/* Cost */}
                                        <td style={{ padding: '16px 22px', textAlign: 'right' }}>
                                            <span
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: 800,
                                                    color: '#fbbf24',
                                                    fontFeatureSettings: "'tnum'",
                                                }}
                                            >
                                                ${exp.cost}
                                            </span>
                                        </td>

                                        {/* $/L */}
                                        <td style={{ padding: '16px 22px', textAlign: 'right' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>
                                                ${exp.perLiter.toFixed(2)}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '16px 22px', textAlign: 'center' }}>
                                            {renderDelete()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </AnimatePresence>
                    </table>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 4px',
                }}
            >
                <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>
                    Showing{' '}
                    <span style={{ color: '#aaa', fontWeight: 600 }}>{EXPENSES_DATA.length}</span> fuel
                    entries
                </span>
                <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>
                    Avg cost per liter:{' '}
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                        ${(totalFuelCost / totalLiters).toFixed(2)}
                    </span>
                </span>
            </div>
        </div>
    );
};

export default Expenses;
