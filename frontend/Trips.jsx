import React, { useState } from 'react';
import {
    Plus, Check, X, Play, ChevronDown, MapPin, Truck,
    Package, Navigation, DollarSign, MoreHorizontal
} from 'lucide-react';

/* ═══════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════ */
const TRIPS_DATA = [
    {
        id: 1,
        origin: 'Los Angeles, CA',
        destination: 'San Francisco, CA',
        vehicle: 'FL-2048-CA',
        driver: 'James Rodriguez',
        cargo: '2,800 kg',
        distance: '615 km',
        status: 'Dispatched',
        revenue: '$4,500',
        actions: ['complete', 'cancel'],
    },
    {
        id: 2,
        origin: 'Chicago, IL',
        destination: 'Detroit, MI',
        vehicle: 'FL-5120-IL',
        driver: 'Michael Torres',
        cargo: '28,000 kg',
        distance: '450 km',
        status: 'Dispatched',
        revenue: '$8,200',
        actions: ['complete', 'cancel'],
    },
    {
        id: 3,
        origin: 'Dallas, TX',
        destination: 'Houston, TX',
        vehicle: 'FL-1024-TX',
        driver: 'Sarah Chen',
        cargo: '18,000 kg',
        distance: '385 km',
        status: 'Completed',
        revenue: '$3,800',
        actions: [],
    },
    {
        id: 4,
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        vehicle: 'FL-4096-FL',
        driver: 'David Kim',
        cargo: '15,000 kg',
        distance: '1,060 km',
        status: 'Completed',
        revenue: '$7,600',
        actions: [],
    },
    {
        id: 5,
        origin: 'Seattle, WA',
        destination: 'Portland, OR',
        vehicle: 'FL-6144-WA',
        driver: 'Sarah Chen',
        cargo: '12,000 kg',
        distance: '280 km',
        status: 'Completed',
        revenue: '$2,900',
        actions: [],
    },
    {
        id: 6,
        origin: 'Columbus, OH',
        destination: 'Pittsburgh, PA',
        vehicle: 'FL-8192-OH',
        driver: 'David Kim',
        cargo: '20,000 kg',
        distance: '260 km',
        status: 'Draft',
        revenue: '$3,200',
        actions: ['dispatch'],
    },
    {
        id: 7,
        origin: 'Denver, CO',
        destination: 'Kansas City, MO',
        vehicle: 'FL-1024-TX',
        driver: 'Emily Watson',
        cargo: '22,000 kg',
        distance: '900 km',
        status: 'Cancelled',
        revenue: '$0',
        actions: [],
    },
    {
        id: 8,
        origin: 'Phoenix, AZ',
        destination: 'Las Vegas, NV',
        vehicle: 'FL-6144-WA',
        driver: 'James Rodriguez',
        cargo: '16,000 kg',
        distance: '470 km',
        status: 'Completed',
        revenue: '$4,100',
        actions: [],
    },
];

/* ═══════════════════════════════════════════
   STATUS BADGE CONFIG
═══════════════════════════════════════════ */
const STATUS_CONFIG = {
    Dispatched: { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: 'rgba(59,130,246,0.25)' },
    Completed: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', border: 'rgba(34,197,94,0.25)' },
    Draft: { bg: 'rgba(100,116,139,0.12)', color: '#94A3B8', border: 'rgba(100,116,139,0.25)' },
    Cancelled: { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
};

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const Trips = () => {
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [hoveredRow, setHoveredRow] = useState(null);

    const statuses = ['All Statuses', 'Dispatched', 'Completed', 'Draft', 'Cancelled'];

    const filteredTrips =
        statusFilter === 'All Statuses'
            ? TRIPS_DATA
            : TRIPS_DATA.filter((t) => t.status === statusFilter);

    /* ── Action button renderer ── */
    const renderActions = (actions) => {
        if (!actions || actions.length === 0) return <span style={{ color: '#444' }}>—</span>;
        return (
            <div style={{ display: 'flex', gap: '6px' }}>
                {actions.map((action) => {
                    if (action === 'complete')
                        return (
                            <button
                                key={action}
                                title="Complete"
                                style={{
                                    width: '30px', height: '30px', borderRadius: '8px',
                                    border: '1px solid rgba(34,197,94,0.25)', background: 'rgba(34,197,94,0.1)',
                                    color: '#4ade80', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.2)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <Check size={14} strokeWidth={2.5} />
                            </button>
                        );
                    if (action === 'cancel')
                        return (
                            <button
                                key={action}
                                title="Cancel"
                                style={{
                                    width: '30px', height: '30px', borderRadius: '8px',
                                    border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.1)',
                                    color: '#f87171', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <X size={14} strokeWidth={2.5} />
                            </button>
                        );
                    if (action === 'dispatch')
                        return (
                            <button
                                key={action}
                                title="Dispatch"
                                style={{
                                    width: '30px', height: '30px', borderRadius: '8px',
                                    border: '1px solid rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.1)',
                                    color: '#60A5FA', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <Play size={13} strokeWidth={2.5} />
                            </button>
                        );
                    return null;
                })}
            </div>
        );
    };

    /* ── Status badge ── */
    const renderBadge = (status) => {
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Draft;
        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    background: cfg.bg,
                    color: cfg.color,
                    border: `1px solid ${cfg.border}`,
                    whiteSpace: 'nowrap',
                }}
            >
                {status}
            </span>
        );
    };

    /* ═══════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════ */
    return (
        <div
            style={{
                minHeight: '100vh',
                padding: '36px 40px',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                color: '#e2e8f0',
                margin: '-40px',
            }}
        >
            {/* ── HEADER ── */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '26px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            margin: '0 0 16px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Trips
                    </h1>

                    {/* Status filter dropdown */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                appearance: 'none',
                                padding: '8px 36px 8px 14px',
                                borderRadius: '8px',
                                border: '1px solid #2a2a2a',
                                background: '#141414',
                                color: '#94A3B8',
                                fontSize: '13px',
                                fontWeight: 500,
                                fontFamily: 'inherit',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'border-color 0.15s',
                                colorScheme: 'dark',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                            onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
                        >
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={14}
                            color="#555"
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                </div>

                {/* New Trip button */}
                <button
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#3B82F6',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 1px 3px rgba(59,130,246,0.3), 0 4px 12px rgba(59,130,246,0.15)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2563EB';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(59,130,246,0.4), 0 8px 20px rgba(59,130,246,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#3B82F6';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(59,130,246,0.3), 0 4px 12px rgba(59,130,246,0.15)';
                    }}
                >
                    <Plus size={16} strokeWidth={2.5} />
                    New Trip
                </button>
            </div>

            {/* ── TABLE CARD ── */}
            <div
                style={{
                    background: '#141414',
                    borderRadius: '14px',
                    border: '1px solid #1e1e1e',
                    overflow: 'hidden',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '960px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                                {[
                                    { label: 'Route', align: 'left' },
                                    { label: 'Vehicle', align: 'left' },
                                    { label: 'Driver', align: 'left' },
                                    { label: 'Cargo', align: 'left' },
                                    { label: 'Distance', align: 'left' },
                                    { label: 'Status', align: 'left' },
                                    { label: 'Revenue', align: 'right' },
                                    { label: 'Actions', align: 'center' },
                                ].map((col) => (
                                    <th
                                        key={col.label}
                                        style={{
                                            padding: '14px 20px',
                                            textAlign: col.align,
                                            fontSize: '11px',
                                            fontWeight: 600,
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
                        <tbody>
                            {filteredTrips.map((trip, idx) => (
                                <tr
                                    key={trip.id}
                                    onMouseEnter={() => setHoveredRow(trip.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        borderBottom:
                                            idx < filteredTrips.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                        background: hoveredRow === trip.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                                        transition: 'background 0.15s ease',
                                        cursor: 'default',
                                    }}
                                >
                                    {/* Route */}
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <span
                                                style={{
                                                    fontSize: '13.5px',
                                                    fontWeight: 600,
                                                    color: '#e2e8f0',
                                                    lineHeight: '1.4',
                                                }}
                                            >
                                                {trip.origin}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Navigation
                                                    size={10}
                                                    color="#555"
                                                    style={{ transform: 'rotate(135deg)', flexShrink: 0 }}
                                                />
                                                <span style={{ fontSize: '12.5px', color: '#888', fontWeight: 500 }}>
                                                    {trip.destination}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Vehicle */}
                                    <td style={{ padding: '16px 20px' }}>
                                        <span
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#c7d2fe',
                                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                                letterSpacing: '0.02em',
                                                background: 'rgba(99,102,241,0.1)',
                                                padding: '3px 8px',
                                                borderRadius: '5px',
                                            }}
                                        >
                                            {trip.vehicle}
                                        </span>
                                    </td>

                                    {/* Driver */}
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#cbd5e1' }}>
                                            {trip.driver}
                                        </span>
                                    </td>

                                    {/* Cargo */}
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>
                                            {trip.cargo}
                                        </span>
                                    </td>

                                    {/* Distance */}
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>
                                            {trip.distance}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td style={{ padding: '16px 20px' }}>{renderBadge(trip.status)}</td>

                                    {/* Revenue */}
                                    <td
                                        style={{
                                            padding: '16px 20px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                color: trip.revenue === '$0' ? '#444' : '#fff',
                                                fontFeatureSettings: "'tnum'",
                                            }}
                                        >
                                            {trip.revenue}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                        {renderActions(trip.actions)}
                                    </td>
                                </tr>
                            ))}

                            {/* Empty state */}
                            {filteredTrips.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        style={{
                                            padding: '60px 20px',
                                            textAlign: 'center',
                                            color: '#555',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                        }}
                                    >
                                        No trips match the selected filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── FOOTER SUMMARY ── */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px',
                    padding: '0 4px',
                }}
            >
                <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>
                    Showing{' '}
                    <span style={{ color: '#aaa', fontWeight: 600 }}>{filteredTrips.length}</span> of{' '}
                    <span style={{ color: '#aaa', fontWeight: 600 }}>{TRIPS_DATA.length}</span> trips
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['Dispatched', 'Completed', 'Draft', 'Cancelled'].map((st) => {
                        const count = TRIPS_DATA.filter((t) => t.status === st).length;
                        const cfg = STATUS_CONFIG[st];
                        return (
                            <span
                                key={st}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '12px',
                                    color: cfg.color,
                                    fontWeight: 600,
                                }}
                            >
                                <span
                                    style={{
                                        width: '7px',
                                        height: '7px',
                                        borderRadius: '50%',
                                        background: cfg.color,
                                        display: 'inline-block',
                                    }}
                                />
                                {count} {st}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Trips;
