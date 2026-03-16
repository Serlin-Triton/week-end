import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Mail } from 'lucide-react';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [locations, setLocations] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [cars, setCars] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);

    const [formData, setFormData] = useState({
        startPointId: '',
        dropPointId: '',
        routeType: 'One Way',
        bookingAmount: '',
        driverId: '',
        carId: '',
        status: 'Pending'
    });

    useEffect(() => {
        fetchDependencies();
        fetchBookings();
    }, []);

    const fetchDependencies = async () => {
        try {
            const [locsRes, driversRes, carsRes] = await Promise.all([
                api.get('/locations'),
                api.get('/drivers'),
                api.get('/cars')
            ]);
            setLocations(locsRes.data);
            setDrivers(driversRes.data);
            setCars(carsRes.data);
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingBooking) {
                await api.put(`/bookings/${editingBooking.id}`, { ...editingBooking, ...formData });
            } else {
                await api.post('/bookings', formData);
            }
            setIsModalOpen(false);
            fetchBookings();
            resetForm();
        } catch (error) {
            console.error('Error saving booking:', error);
            alert(error.response?.data?.message || 'Error saving booking');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/bookings/${id}/status`, { status });
            fetchBookings();
            if (status === 'Accepted') alert("Status updated and Email Notification sent to customer.");
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            await api.delete(`/bookings/${id}`);
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const openEditModal = (booking) => {
        setEditingBooking(booking);
        setFormData({
            startPointId: booking.startPointId,
            dropPointId: booking.dropPointId,
            routeType: booking.routeType,
            bookingAmount: booking.bookingAmount,
            driverId: booking.driverId || '',
            carId: booking.carId || '',
            status: booking.status
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingBooking(null);
        setFormData({ 
            startPointId: '', dropPointId: '', routeType: 'One Way', 
            bookingAmount: '', driverId: '', carId: '', status: 'Pending' 
        });
    };

    if (isLoading) return <div>Loading bookings...</div>;

    const getStatusVariant = (status) => {
        switch(status) {
            case 'Completed': return 'success';
            case 'Accepted': return 'info';
            case 'Payment Waiting': return 'warning';
            default: return 'danger'; // Pending
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Booking Management</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                >
                    <Plus size={18} /> Create New Booking
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Route</th>
                            <th>Amount</th>
                            <th>Driver</th>
                            <th>Car</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id}>
                                <td>#{booking.id}</td>
                                <td>
                                    {booking.startPoint?.name} → {booking.dropPoint?.name}
                                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{booking.routeType}</div>
                                </td>
                                <td>${booking.bookingAmount}</td>
                                <td>{booking.assignedDriver?.name || 'Unassigned'}</td>
                                <td>{booking.assignedCar?.name || 'Unassigned'}</td>
                                <td>
                                    <select 
                                        value={booking.status} 
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                        style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '6px',
                                            border: '1px solid #E2E8F0',
                                            backgroundColor: `var(--${getStatusVariant(booking.status)}-light, #f8fafc)`,
                                            fontSize: '0.8rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Payment Waiting">Payment Waiting</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button onClick={() => openEditModal(booking)} className="btn btn-secondary" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(booking.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div className="glass-panel" style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>{editingBooking ? 'Edit Booking' : 'Create New Booking'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                                <div>
                                    <label>Start Point</label>
                                    <select name="startPointId" value={formData.startPointId} onChange={handleInputChange} required>
                                        <option value="">Select Location</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Drop Point</label>
                                    <select name="dropPointId" value={formData.dropPointId} onChange={handleInputChange} required>
                                        <option value="">Select Location</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Route Type</label>
                                    <select name="routeType" value={formData.routeType} onChange={handleInputChange}>
                                        <option value="One Way">One Way</option>
                                        <option value="Round Trip">Round Trip</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Booking Amount</label>
                                    <input type="number" step="0.01" name="bookingAmount" value={formData.bookingAmount} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label>Assign Driver</label>
                                    <select name="driverId" value={formData.driverId} onChange={handleInputChange}>
                                        <option value="">Unassigned</option>
                                        {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Assign Car</label>
                                    <select name="carId" value={formData.carId} onChange={handleInputChange}>
                                        <option value="">Unassigned</option>
                                        {cars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    modalContent: {
        width: '100%',
        maxWidth: '700px',
        backgroundColor: 'var(--surface-color)',
    }
};

export default Bookings;
