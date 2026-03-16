import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);

    const [formData, setFormData] = useState({
        name: '', isStartLocation: false, isDropLocation: false
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const { data } = await api.get('/locations');
            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingLocation) {
                await api.put(`/locations/${editingLocation.id}`, { ...editingLocation, ...formData });
            } else {
                await api.post('/locations', formData);
            }
            setIsModalOpen(false);
            fetchLocations();
            resetForm();
        } catch (error) {
            console.error('Error saving location:', error);
            alert(error.response?.data?.message || 'Error saving location');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return;
        try {
            await api.delete(`/locations/${id}`);
            fetchLocations();
        } catch (error) {
            console.error('Error deleting location:', error);
        }
    };

    const openEditModal = (location) => {
        setEditingLocation(location);
        setFormData({
            name: location.name,
            isStartLocation: location.isStartLocation,
            isDropLocation: location.isDropLocation
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingLocation(null);
        setFormData({ name: '', isStartLocation: false, isDropLocation: false });
    };

    if (isLoading) return <div>Loading locations...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Location Management</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                >
                    <Plus size={18} /> Add New Location
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Location Name</th>
                            <th>Starting Point</th>
                            <th>Drop Point</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map(location => (
                            <tr key={location.id}>
                                <td>{location.name}</td>
                                <td>{location.isStartLocation ? 'Yes' : 'No'}</td>
                                <td>{location.isDropLocation ? 'Yes' : 'No'}</td>
                                <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button onClick={() => openEditModal(location)} className="btn btn-secondary" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(location.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div className="glass-panel" style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>{editingLocation ? 'Edit Location' : 'Add New Location'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label>Location Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    name="isStartLocation" 
                                    checked={formData.isStartLocation} 
                                    onChange={handleInputChange} 
                                    style={{ width: '16px' }}
                                />
                                <span>Can be used as a Start Point</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    name="isDropLocation" 
                                    checked={formData.isDropLocation} 
                                    onChange={handleInputChange} 
                                    style={{ width: '16px' }}
                                />
                                <span>Can be used as a Drop Point</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Location'}
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
        maxWidth: '500px',
        backgroundColor: 'var(--surface-color)',
    }
};

export default Locations;
