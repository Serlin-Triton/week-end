import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Workshop = () => {
    const [workshops, setWorkshops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState(null);

    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            const { data } = await api.get('/workshops');
            setWorkshops(data);
        } catch (error) {
            console.error('Error fetching workshops:', error);
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
            if (editingWorkshop) {
                await api.put(`/workshops/${editingWorkshop.id}`, { ...editingWorkshop, ...formData });
            } else {
                await api.post('/workshops', formData);
            }
            setIsModalOpen(false);
            fetchWorkshops();
            resetForm();
        } catch (error) {
            console.error('Error saving workshop:', error);
            alert(error.response?.data?.message || 'Error saving workshop');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this workshop?')) return;
        try {
            await api.delete(`/workshops/${id}`);
            fetchWorkshops();
        } catch (error) {
            console.error('Error deleting workshop:', error);
        }
    };

    const openEditModal = (workshop) => {
        setEditingWorkshop(workshop);
        setFormData({
            name: workshop.name
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingWorkshop(null);
        setFormData({ name: '' });
    };

    if (isLoading) return <div>Loading workshops...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Workshop Management</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                >
                    <Plus size={18} /> Add New Workshop
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Workshop Name</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workshops.map(workshop => (
                            <tr key={workshop.id}>
                                <td>{workshop.name}</td>
                                <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button onClick={() => openEditModal(workshop)} className="btn btn-secondary" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(workshop.id)} className="btn btn-secondary" style={{ padding: '8px', color: '#EF4444' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div className="glass-panel" style={styles.modalContent}>
                        <h3 style={{ marginBottom: '20px' }}>{editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label>Workshop Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Workshop'}
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

export default Workshop;
