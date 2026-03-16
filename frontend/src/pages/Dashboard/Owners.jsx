import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

const Owners = () => {
    const [owners, setOwners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingOwner, setEditingOwner] = useState(null);
    const [viewingOwner, setViewingOwner] = useState(null);

    const [formData, setFormData] = useState({
        name: '', mobileNumber: '', address: ''
    });

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const { data } = await api.get('/owners');
            setOwners(data);
        } catch (error) {
            console.error('Error fetching owners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOwnerDetails = async (id) => {
        try {
            const { data } = await api.get(`/owners/${id}`);
            setViewingOwner(data);
            setIsViewModalOpen(true);
        } catch(err) {
            console.error(err);
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingOwner) {
                await api.put(`/owners/${editingOwner.id}`, { ...editingOwner, ...formData });
            } else {
                await api.post('/owners', formData);
            }
            setIsModalOpen(false);
            fetchOwners();
            resetForm();
        } catch (error) {
            console.error('Error saving owner:', error);
            alert(error.response?.data?.message || 'Error saving owner');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this owner?')) return;
        try {
            await api.delete(`/owners/${id}`);
            fetchOwners();
        } catch (error) {
            console.error('Error deleting owner:', error);
            alert("Could not delete owner, they may have cars attached.");
        }
    };

    const openEditModal = (owner) => {
        setEditingOwner(owner);
        setFormData({
            name: owner.name,
            mobileNumber: owner.mobileNumber,
            address: owner.address
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingOwner(null);
        setFormData({ name: '', mobileNumber: '', address: '' });
    };

    if (isLoading) return <div>Loading owners...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Owner Management</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                >
                    <Plus size={18} /> Add New Owner
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Mobile Number</th>
                            <th>Address</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {owners.map(owner => (
                            <tr key={owner.id}>
                                <td>{owner.name}</td>
                                <td>{owner.mobileNumber}</td>
                                <td>{owner.address}</td>
                                <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button onClick={() => fetchOwnerDetails(owner.id)} className="btn btn-secondary" style={{ padding: '8px' }} title="View Cars"><Eye size={16} /></button>
                                    <button onClick={() => openEditModal(owner)} className="btn btn-secondary" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(owner.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div className="glass-panel" style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>{editingOwner ? 'Edit Owner' : 'Add New Owner'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label>Mobile Number</label>
                                <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label>Address</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} required rows="3"></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Owner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isViewModalOpen && viewingOwner && (
                <div style={styles.modalOverlay}>
                    <div className="glass-panel" style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>Owner Details: {viewingOwner.name}</h3>
                        <div style={{marginBottom: '20px'}}>
                            <p><strong>Mobile:</strong> {viewingOwner.mobileNumber}</p>
                            <p><strong>Address:</strong> {viewingOwner.address}</p>
                        </div>
                        
                        <h4>Cars Owned ({viewingOwner.carsOwned?.length || 0})</h4>
                        {viewingOwner.carsOwned && viewingOwner.carsOwned.length > 0 ? (
                            <ul style={{marginTop: '10px', paddingLeft: '20px'}}>
                                {viewingOwner.carsOwned.map(car => (
                                    <li key={car.id} style={{marginBottom: '6px'}}>{car.name} ({car.carNumber}) - {car.carType}</li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>No cars attached to this owner.</p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>Close</button>
                        </div>
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
        maxWidth: '500px',
        backgroundColor: 'var(--surface-color)',
    }
};

export default Owners;
