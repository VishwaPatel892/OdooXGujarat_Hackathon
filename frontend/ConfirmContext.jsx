import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, AlertTriangle, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [resolveRef, setResolveRef] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

    const confirm = (options) => {
        return new Promise((resolve) => {
            setConfig({
                title: options.title || 'Confirm Action',
                message: options.message || 'Are you sure you want to proceed?',
                confirmText: options.confirmText || 'Delete',
                cancelText: options.cancelText || 'Cancel',
                type: options.type || 'danger'
            });
            setResolveRef(() => resolve);
        });
    };

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const handleConfirm = async () => {
        setLoading(true);
        if (resolveRef) {
            await resolveRef(true);
        }
        setLoading(false);
        setConfig(null);
        setResolveRef(null);
    };

    const handleCancel = () => {
        if (resolveRef) resolveRef(false);
        setConfig(null);
        setResolveRef(null);
    };

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && config) handleCancel();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [config]);

    return (
        <ConfirmContext.Provider value={{ confirm, toast: addToast }}>
            {children}

            {/* Confirmation Modal */}
            {config && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: '20px'
                }} className="animate-fade-in">
                    <div style={{
                        background: '#141414', border: '1px solid #222',
                        borderRadius: '20px', width: '100%', maxWidth: '400px',
                        padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        position: 'relative'
                    }}>
                        <button onClick={handleCancel} style={{
                            position: 'absolute', top: '20px', right: '20px',
                            background: 'none', border: 'none', cursor: 'pointer', color: '#555'
                        }}><X size={20} /></button>

                        <div style={{
                            width: '56px', height: '56px', borderRadius: '16px',
                            background: 'rgba(239,68,68,0.1)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
                            color: '#ef4444'
                        }}>
                            <AlertTriangle size={28} />
                        </div>

                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>{config.title}</h3>
                        <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.6, marginBottom: '32px' }}>{config.message}</p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleCancel} style={{
                                flex: 1, padding: '14px', borderRadius: '12px',
                                background: '#1c1c1c', color: '#eee', border: '1px solid #2a2a2a',
                                fontSize: '14px', fontWeight: 700, cursor: 'pointer'
                            }}>{config.cancelText}</button>
                            <button onClick={handleConfirm} disabled={loading} style={{
                                flex: 1, padding: '14px', borderRadius: '12px',
                                background: '#ef4444', color: '#fff', border: 'none',
                                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                            }}>
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {config.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast System */}
            <div style={{
                position: 'fixed', bottom: '32px', right: '32px',
                display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 10000
            }}>
                {toasts.map(t => (
                    <div key={t.id} style={{
                        padding: '16px 24px', borderRadius: '14px',
                        background: '#1a1a1a', border: '1px solid #2a2a2a',
                        display: 'flex', alignItems: 'center', gap: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)', minWidth: '280px'
                    }} className="animate-fade-in">
                        {t.type === 'success' ? <CheckCircle size={18} color="#4ade80" /> : <AlertCircle size={18} color="#f87171" />}
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#eee' }}>{t.message}</span>
                    </div>
                ))}
            </div>
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => useContext(ConfirmContext).confirm;
export const useToast = () => useContext(ConfirmContext).toast;
