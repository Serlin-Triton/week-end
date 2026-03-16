import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [owners, setOwners] = useState([]);
    const [locations, setLocations] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);

    const [formData, setFormData] = useState({
        name: '', carNumber: '', carType: '', ownerId: '', locationId: '', availabilityStatus: 'Available'
    });

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchDependencies();
        fetchCars();
    }, []);

    const fetchDependencies = async () => {
        try {
            const [ownersRes, locsRes] = await Promise.all([
                api.get('/owners'),
                api.get('/locations')
            ]);
            setOwners(ownersRes.data);
            setLocations(locsRes.data);
            if (ownersRes.data.length > 0) formData.ownerId = ownersRes.data[0].id;
            if (locsRes.data.length > 0) formData.locationId = locsRes.data[0].id;
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const fetchCars = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/cars');
            setCars(data);
        } catch (error) {
            console.error('Error fetching cars:', error);
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
            let savedCarId = null;
            if (editingCar) {
                await api.put(`/cars/${editingCar.id}`, { ...editingCar, ...formData });
                savedCarId = editingCar.id;
            } else {
                const res = await api.post('/cars', formData);
                savedCarId = res.data.id;
            }

            // Handle image upload
            if (selectedImage && savedCarId) {
                const imgData = new FormData();
                imgData.append('file', selectedImage);
                await api.post(`/cars/${savedCarId}/image`, imgData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setIsModalOpen(false);
            fetchCars();
            resetForm();
        } catch (error) {
            console.error('Error saving car:', error);
            alert(error.response?.data?.message || 'Error saving car');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;
        try {
            await api.delete(`/cars/${id}`);
            fetchCars();
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    const openEditModal = (car) => {
        setEditingCar(car);
        setFormData({
            name: car.name,
            carNumber: car.carNumber,
            carType: car.carType,
            ownerId: car.ownerId,
            locationId: car.locationId,
            availabilityStatus: car.availabilityStatus
        });
        setSelectedImage(null);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingCar(null);
        setFormData({ 
            name: '', carNumber: '', carType: '', 
            ownerId: owners[0]?.id || '', locationId: locations[0]?.id || '', 
            availabilityStatus: 'Available' 
        });
        setSelectedImage(null);
    };

    if (isLoading) return <div>Loading cars...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Cars Inventory</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                >
                    <Plus size={18} /> Add New Car
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Car</th>
                            <th>Number</th>
                            <th>Type</th>
                            <th>Owner</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map(car => (
                            <tr key={car.id}>
                                <td>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <div style={{width: 40, height: 40, background: '#F1F5F9', borderRadius: 8, overflow: 'hidden'}}>
                                            {car.imageUrl ? <img src={`https://localhost:7119${car.imageUrl}`} alt={car.name} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <ImageIcon size={20} style={{margin:'10px', color:'#94A3B8'}}/>}
                                        </div>
                                        <span style={{fontWeight: 500}}>{car.name}</span>
                                    </div>
                                </td>
                                <td>{car.carNumber}</td>
                                <td>{car.carType}</td>
                                <td>{car.owner?.name || 'N/A'}</td>
                                <td>{car.location?.name || 'N/A'}</td>
                                <td>
                                    <span className={`badge ${
                                        car.availabilityStatus === 'Available' ? 'badge-success' : 
                                        car.availabilityStatus === 'Booked' ? 'badge-warning' : 'badge-danger'
                                    }`}>
                                        {car.availabilityStatus}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button onClick={() => openEditModal(car)} className="btn btn-secondary" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(car.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div className="glass-panel" style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                                <div>
                                    <label>Car Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label>Car Number</label>
                                    <input type="text" name="carNumber" value={formData.carNumber} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label>Car Type (e.g., Sedan, SUV)</label>
                                    <input type="text" name="carType" value={formData.carType} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label>Status</label>
                                    <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleInputChange}>
                                        <option value="Available">Available</option>
                                        <option value="Cars Outside">Cars Outside</option>
                                        <option value="Booked">Booked</option>
                                        <option value="OutOfService">Out of Service</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Owner</label>
                                    <select name="ownerId" value={formData.ownerId} onChange={handleInputChange} required>
                                        <option value="">Select Owner</option>
                                        {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Location</label>
                                    <select name="locationId" value={formData.locationId} onChange={handleInputChange} required>
                                        <option value="">Select Location</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label>Car Image (optional)</label>
                                <input type="file" onChange={handleImageChange} accept="image/*" />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Car'}
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
        maxHeight: '90vh',
        overflowY: 'auto'
    }
};

export default Cars;
