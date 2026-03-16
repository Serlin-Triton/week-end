import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    Car, 
    Key, 
    MapPin, 
    Calendar,
    CalendarCheck, 
    DollarSign 
} from 'lucide-react';

const OverallDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get('/dashboard/summary');
                setSummary(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard summary.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (isLoading) return <div className="animate-fade-in">Loading dashboard data...</div>;
    if (error) return <div className="badge badge-danger">{error}</div>;

    const cards = [
        {
            title: 'Total Cars',
            value: summary?.totalCars || 0,
            icon: <Car size={24} color="#FFF" />,
            color: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
        },
        {
            title: 'Available Cars',
            value: summary?.availableCars || 0,
            icon: <Key size={24} color="#FFF" />,
            color: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
        },
        {
            title: 'Cars Outside',
            value: summary?.carsOutside || 0,
            icon: <MapPin size={24} color="#FFF" />,
            color: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
        },
        {
            title: 'Monthly Bookings',
            value: summary?.monthlyBookingCount || 0,
            icon: <Calendar size={24} color="#FFF" />,
            color: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
        },
        {
            title: 'Weekly Bookings',
            value: summary?.weeklyBookingCount || 0,
            icon: <CalendarCheck size={24} color="#FFF" />,
            color: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
        },
        {
            title: 'Total Revenue',
            value: `$${(summary?.totalRevenue || 0).toLocaleString()}`,
            icon: <DollarSign size={24} color="#FFF" />,
            color: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)'
        }
    ];

    return (
        <div className="animate-fade-in">
            <div style={styles.grid}>
                {cards.map((card, idx) => (
                    <div key={idx} className="glass-panel" style={{...styles.card, background: 'var(--surface-color)'}}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>{card.title}</h3>
                            <div style={{...styles.iconWrapper, background: card.color}}>
                                {card.icon}
                            </div>
                        </div>
                        <div style={styles.cardValue}>{card.value}</div>
                        <div style={styles.cardFooter}>
                            Updated just now
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for future charts or lists */}
            <div style={styles.sectionsGrid}>
                <div className="glass-panel" style={{flex: 2}}>
                    <h3 style={{marginBottom: '16px'}}>Recent Activity Overview</h3>
                    <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: '8px'}}>
                        <p style={{color: 'var(--text-muted)'}}>Activity chart will appear here</p>
                    </div>
                </div>
                <div className="glass-panel" style={{flex: 1}}>
                    <h3 style={{marginBottom: '16px'}}>Quick Actions</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                        <button className="btn btn-primary" style={{width: '100%'}}>New Booking</button>
                        <button className="btn btn-secondary" style={{width: '100%'}}>Add Car</button>
                        <button className="btn btn-secondary" style={{width: '100%'}}>Add Driver</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
    },
    card: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    cardTitle: {
        fontSize: '15px',
        color: 'var(--text-muted)',
        fontWeight: '600'
    },
    iconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    cardValue: {
        fontSize: '36px',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginBottom: '8px'
    },
    cardFooter: {
        fontSize: '13px',
        color: 'var(--text-muted)'
    },
    sectionsGrid: {
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap'
    }
};

export default OverallDashboard;
