import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { 
    LayoutDashboard, 
    Car, 
    Users, 
    Wrench, 
    BadgeCheck, 
    MapPin, 
    CalendarCheck, 
    UserCog,
    LogOut,
    CarFront
} from 'lucide-react';

const DashboardLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Overall', icon: <LayoutDashboard size={20} /> },
        { path: '/cars', label: 'Car Details', icon: <Car size={20} /> },
        { path: '/owners', label: 'Owners', icon: <Users size={20} /> },
        { path: '/workshop', label: 'Workshop', icon: <Wrench size={20} /> },
        { path: '/drivers', label: 'Drivers', icon: <BadgeCheck size={20} /> },
        { path: '/locations', label: 'Locations', icon: <MapPin size={20} /> },
        { path: '/bookings', label: 'Booking', icon: <CalendarCheck size={20} /> },
    ];

    if (user?.role === 'Admin') {
        navItems.push({ path: '/users', label: 'Users', icon: <UserCog size={20} /> });
    }

    return (
        <div className="dashboard-layout animate-fade-in">
            <aside className="sidebar">
                <div style={styles.brand}>
                    <div style={styles.logo}>
                        <CarFront size={28} color="white" />
                    </div>
                    <h2 style={styles.brandName}>ZoomTrip</h2>
                </div>

                <nav style={styles.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                ...styles.navItem,
                                ...(isActive ? styles.activeNavItem : {})
                            })}
                        >
                            <span style={styles.iconWrapper}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={styles.userSection}>
                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p style={styles.userName}>{user?.name || 'User'}</p>
                            <span className="badge badge-info">{user?.role || 'Staff'}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.pageTitle}>Dashboard overview</h1>
                        <p style={styles.pageSubtitle}>Welcome back, here's what's happening today.</p>
                    </div>
                </header>
                
                <div style={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const styles = {
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
        padding: '0 10px'
    },
    logo: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    brandName: {
        fontSize: '20px',
        fontWeight: '700',
        letterSpacing: '-0.5px'
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
        color: 'var(--text-muted)',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        textDecoration: 'none'
    },
    activeNavItem: {
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)'
    },
    iconWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    userSection: {
        marginTop: 'auto',
        paddingTop: '20px',
        borderTop: '1px solid #E2E8F0'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        padding: '0 8px'
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#E0E7FF',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: '18px'
    },
    userName: {
        fontWeight: '600',
        fontSize: '14px',
        marginBottom: '4px'
    },
    logoutBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px',
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background 0.2s'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '32px'
    },
    pageTitle: {
        fontSize: '28px'
    },
    pageSubtitle: {
        color: 'var(--text-muted)',
        marginTop: '4px'
    },
    content: {
        background: 'transparent'
    }
};

export default DashboardLayout;
