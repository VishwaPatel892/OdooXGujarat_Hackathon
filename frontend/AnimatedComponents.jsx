import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Page transition wrapper
export const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
        {children}
    </motion.div>
);

// Staggered container for lists/grids
export const StaggerContainer = ({ children, delay = 0 }) => (
    <motion.div
        initial="hidden"
        animate="show"
        variants={{
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.05,
                    delayChildren: delay
                }
            }
        }}
    >
        {children}
    </motion.div>
);

// Item for staggered container
export const StaggerItem = ({ children }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 }
        }}
    >
        {children}
    </motion.div>
);

// Advanced Animated Button
export const AnimatedButton = ({ children, className, onClick, type = 'button', variant = 'primary', disabled = false }) => {
    const variants = {
        primary: { background: '#4f46e5', color: '#fff' },
        secondary: { background: '#1c1c1c', color: '#eee', border: '1px solid #2a2a2a' },
        danger: { background: '#ef4444', color: '#fff' },
        ghost: { background: 'transparent', color: '#666' }
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.03, boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.97 }}
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'background 0.2s, color 0.2s, border 0.2s',
                border: 'none',
                ...variants[variant]
            }}
        >
            {children}
        </motion.button>
    );
};
// Card with hover effect
export const AnimatedCard = ({ children, style, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.3 }}
        whileHover={{
            y: -5,
            borderColor: 'rgba(129,140,248,0.4)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}
        style={{
            background: '#141414',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #1e1e1e',
            cursor: 'default',
            ...style
        }}
    >
        {children}
    </motion.div>
);

// Smooth table row animation
export const AnimatedTableRow = ({ children, style }) => (
    <motion.tr
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
        style={{ borderBottom: '1px solid #1a1a1a', transition: 'background-color 0.2s', ...style }}
    >
        {children}
    </motion.tr>
);

// Animated Table wrapper
export const AnimatedTable = ({ columns, data, rowStyle = {} }) => (
    <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid #1e1e1e', background: 'rgba(255,255,255,0.02)' }}>
                    {columns.map((col, i) => (
                        <th key={i} style={{ padding: '16px', fontSize: '11px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <StaggerContainer component="tbody">
                <AnimatePresence mode="popLayout">
                    {data.map((row, i) => (
                        <AnimatedTableRow key={row.id || i} style={rowStyle}>
                            {columns.map((col, j) => (
                                <td key={j} style={{ padding: '16px', fontSize: '14px', color: '#ccc' }}>
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                        </AnimatedTableRow>
                    ))}
                </AnimatePresence>
            </StaggerContainer>
        </table>
    </div>
);

// Count-up number animation
export const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        let start = 0;
        const endStr = value?.toString() || "0";
        const end = parseInt(endStr.replace(/[^0-9.-]+/g, ""));

        if (isNaN(end)) {
            setDisplayValue(value);
            return;
        }

        const duration = 1000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuad = (t) => t * (2 - t);
            const current = Math.floor(easeOutQuad(progress) * end);

            setDisplayValue(current.toLocaleString());

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setDisplayValue(value);
            }
        };

        requestAnimationFrame(update);
    }, [value]);

    return <span>{displayValue}</span>;
};
