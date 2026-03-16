import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);

    const [formData, setFormData] = useState({
        name: '', mobileNumber: '', licenseNumber: ''
    });

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const { data } = await api.get('/drivers');
            setDrivers(data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let savedDriverId = null;
            if (editingDriver) {
                await api.put(`/drivers/${editingDriver.id}`, { ...editingDriver, ...formData });
                savedDriverId = editingDriver.id;
            } else {
                const res = await api.post('/drivers', formData);
                savedDriverId = res.data.id;
            }

            // Handle image upload
            if (selectedImage && savedDriverId) {
                const imgData = new FormData();
                imgData.append('file', selectedImage);
                await api.post(`/drivers/${savedDriverId}/photo`, imgData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setIsModalOpen(false);
            fetchDrivers();
            resetForm();
        } catch (error) {
            console.error('Error saving driver:', error);
            alert(error.response?.data?.message || 'Error saving driver');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this driver?')) return;
        try {
            await api.delete(`/drivers/${id}`);
            fetchDrivers();
        } catch (error) {
            console.error('Error deleting driver:', error);
        }
    };

    const openEditModal = (driver) => {
        setEditingDriver(driver);
        setFormData({
            name: driver.name,
            mobileNumber: driver.mobileNumber,
            licenseNumber: driver.licenseNumber
        });
        setSelectedImage(null);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingDriver(null);
        setFormData({ name: '', mobileNumber: '', licenseNumber: '' });
        setSelectedImage(null);
    };

    if (isLoading) return <div>Loading drivers...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Driver Management</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                >
                    <Plus size={18} /> Add New Driver
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Driver</th>
                            <th>Mobile Number</th>
                            <th>License Number</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.id}>
                                <td>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <div style={{width: 40, height: 40, borderRadius: '50%', background: '#F1F5F9', overflow: 'hidden'}}>
                                            {driver.photoUrl ? <img src={`https://localhost:7119${driver.photoUrl}`} alt={driver.name} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <ImageIcon size={20} style={{margin:'10px', color:'#94A3B8'}}/>}
                                        </div>
                                        <span style={{fontWeight: 500}}>{driver.name}</span>
                                    </div>
                                </td>
                                <td>{driver.mobileNumber}</td>
                                <td>{driver.licenseNumber}</td>
                                <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button onClick={() => openEditModal(driver)} className="btn btn-secondary" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(driver.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div className="glass-panel" style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
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
                                <label>License Number</label>
                                <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label>Driver Photo (optional)</label>
                                <input type="file" onChange={handleImageChange} accept="image/*" />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Driver'}
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

export default Drivers;
