import React, { useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const FONT = '"Roboto", sans-serif';

/* ─── MOCK DATA (In a real app, this comes from backend APIs) ─── */
const MOCK_SALES_DATA = [
    { name: 'Mar 19', amount: 12400 },
    { name: 'Mar 20', amount: 35000 },
    { name: 'Mar 21', amount: 28000 },
    { name: 'Mar 22', amount: 48000 },
    { name: 'Mar 23', amount: 31000 },
    { name: 'Mar 24', amount: 62000 },
    { name: 'Mar 25', amount: 42000 },
];

const RECENT_ORDERS = [
    { id: 'BRN-2026-4821', customer: 'Arjun Mehta',    product: 'Dominus Emperor 100ml',  total: '₹1,795', status: 'Shipped' },
    { id: 'BRN-2026-4820', customer: 'Priya Sharma',   product: 'Brunati Aqua 100ml',      total: '₹1,795', status: 'Placed' },
    { id: 'BRN-2026-4819', customer: 'Rahul Desai',    product: 'Mestia 100ml',           total: '₹1,795', status: 'Delivered' },
    { id: 'BRN-2026-4818', customer: 'Sneha Kulkarni', product: 'Citrine Dusk 100ml',     total: '₹1,795', status: 'Confirmed' },
];
const RECENT_ACTIVITY = [
    { id: 1, text: "Order #BRN-2026-4821 placed by Arjun Mehta", time: "5 mins ago", icon: '📦' },
    { id: 2, text: "Perfume 'Midnight Glammer' 100ml went out of stock", time: "1 hour ago", icon: '⚠️' },
    { id: 3, text: "New staff login from admin@brunati.com", time: "2 hours ago", icon: '🔐' },
    { id: 4, text: "Customer Priya Sharma updated her shipping address", time: "4 hours ago", icon: '👤' },
    { id: 5, text: "Payment of ₹1,795 received for Order #BRN-2026-4819", time: "6 hours ago", icon: '💰' },
];

/* ─── Component ─── */
const Summary = () => {
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'mobile' : 'desktop');

    useEffect(() => {
        const handleResize = () => setViewMode(window.innerWidth <= 768 ? 'mobile' : 'desktop');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
    };

    return (
        <div style={{ fontFamily: FONT, opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            {/* Header */}
            <div style={{ 
                marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
                <div style={{ paddingRight: 20 }}>
                    <h1 style={{ fontFamily: FONT, fontSize: '1.4rem', fontWeight: 700, color: '#000', margin: 0, textTransform: 'none', letterSpacing: 'normal' }}>Dashboard</h1>
                    <p style={{ fontSize: '0.85rem', color: '#6e6e73', marginTop: 4, fontWeight: 400 }}>Analytics Overview</p>
                </div>
                <button 
                    onClick={handleRefresh}
                    style={{
                        padding: '10px 20px', minHeight: 44, background: '#fff', border: '1px solid #eee',
                        borderRadius: 0, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                        flexShrink: 0
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}>
                        <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Metrics Cards Grid - Handled by CSS for 4/2/1 responsive split */}
            <div className="metrics-container" style={{ marginBottom: 32 }}>
                <div className="metrics-grid">
                {/* CARD 1: Today's sales */}
                <div className="metric-card">
                    <p className="card-label">Today's sales</p>
                    <p className="card-value">₹ 42,000</p>
                    <p className="card-meta">Collected from 5 orders</p>
                </div>

                {/* CARD 2: New orders */}
                <div className="metric-card">
                    <p className="card-label">New orders</p>
                    <p className="card-value">12</p>
                    <p className="card-meta">Waiting to be shipped</p>
                </div>

                {/* CARD 3: Total customers */}
                <div className="metric-card">
                    <p className="card-label">Total customers</p>
                    <p className="card-value">1,204</p>
                    <p className="card-meta">Registered user accounts</p>
                </div>

                {/* CARD 4: Low stock alert */}
                <div className="metric-card" style={{ borderColor: 'rgba(220,38,38,0.2)' }}>
                    <p className="card-label" style={{ color: '#DC2626' }}>Low stock alert</p>
                    <p className="card-value">3</p>
                    <p className="card-meta">Perfumes with &lt; 5 items left</p>
                </div>
                </div>
            </div>

            {/* Sales Chart Section */}
            <div style={{
                background: '#fff', border: '1px solid #eee', padding: viewMode === 'mobile' ? '20px' : '32px',
                marginBottom: 40, overflow: 'hidden'
            }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontFamily: FONT, fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#000', textTransform: 'none', letterSpacing: 'normal' }}>Sales trend</h2>
                    <p style={{ fontSize: '0.78rem', color: '#6e6e73', marginTop: 4 }}>Last 7 days earnings</p>
                </div>

                <div style={{ 
                    width: '100%', 
                    height: viewMode === 'mobile' ? 220 : 320,
                    maxHeight: 400
                }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_SALES_DATA}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#111" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#111" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 11, fill: '#6e6e73' }} 
                                dy={10}
                            />
                            <YAxis 
                                hide={true} 
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    background: '#111', color: '#fff', border: 'none', 
                                    borderRadius: 0, fontSize: '0.8rem', fontWeight: 700 
                                }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ stroke: '#eee', strokeWidth: 1 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#111" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorAmt)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div style={{ background: '#fff', border: '1px solid #eee', padding: '24px' }}>
                <h2 style={{ fontFamily: FONT, fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#000', textTransform: 'none', letterSpacing: 'normal' }}>Recent activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {RECENT_ACTIVITY.map((activity, i) => (
                        <div key={activity.id} style={{
                            display: 'flex', alignItems: 'center', gap: 16,
                            padding: '16px 0',
                            borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid #f5f5f7' : 'none'
                        }}>
                            <div style={{
                                width: 36, height: 36, background: '#f5f5f7', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                flexShrink: 0
                            }}>
                                {activity.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.85rem', color: '#1d1d1f', margin: 0, lineHeight: 1.4 }}>{activity.text}</p>
                                <p style={{ fontSize: '0.72rem', color: '#6e6e73', marginTop: 2 }}>{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .metrics-container {
                    width: 100%;
                }
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                }
                @media (max-width: 1024px) {
                    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 640px) {
                    .metrics-grid { grid-template-columns: repeat(1, 1fr); }
                }
                .metric-card {
                    background: #ffffff;
                    border: 1px solid #eee;
                    padding: 12px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-height: 110px;
                    justify-content: center;
                }
                .card-label {
                    font-size: 0.7rem;
                    font-weight: 500;
                    color: #6e6e73;
                    text-transform: none;
                    letter-spacing: 0.02em;
                    margin: 0;
                }
                .card-value {
                    font-size: 1.8rem;
                    font-weight: 600;
                    color: #1d1d1f;
                    margin: 0;
                    letter-spacing: -0.03em;
                }
                .card-meta {
                    font-size: 0.72rem;
                    color: #6e6e73;
                    margin: 0;
                }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Summary;
