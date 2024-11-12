import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Modal, Button, Form } from 'react-bootstrap';

const Dashboard = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [formData, setFormData] = useState({
    temperature: '',
    pressure: '',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/equipment/all');
      setEquipmentData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddData = async () => {
    try {
      await axios.post('http://localhost:8080/api/equipment/adddata', formData);
      fetchData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const handleEditData = async () => {
    try {
      await axios.put(`http://localhost:8080/api/equipment/update/${selectedData.id}`, formData);
      fetchData();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDeleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/equipment/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const openEditModal = (data) => {
    setSelectedData(data);
    setFormData({
      temperature: data.temperature,
      pressure: data.pressure,
      timestamp: data.timestamp,
    });
    setShowEditModal(true);
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', color: '#ffffff', padding: '20px', borderRadius: '8px' }}>
      <h2>Real Time Monitoring Dashboard</h2>
      <Button onClick={() => setShowAddModal(true)}>Add Data</Button>
      {equipmentData.length > 0 ? (
        <Bar
          data={{
            labels: equipmentData.map(data => new Date(data.timestamp).toLocaleString()),
            datasets: [
              {
                label: 'Temperature',
                data: equipmentData.map(data => data.temperature),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
              {
                label: 'Pressure',
                data: equipmentData.map(data => data.pressure),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              }
            ]
          }}
          options={{
            plugins: {
              legend: {
                labels: { color: '#ffffff' }
              },
              title: {
                display: true,
                text: 'Equipment Monitoring',
                color: '#ffffff',
                font: { size: 20 }
              }
            },
            scales: {
              x: {
                ticks: { color: '#ffffff' },
                grid: { color: '#444444' }
              },
              y: {
                ticks: { color: '#ffffff' },
                grid: { color: '#444444' }
              }
            }
          }}
        />
      ) : (
        <p>No data available</p>
      )}

      <div style={{ marginTop: '20px' }}>
        {equipmentData.map((data) => (
          <div key={data.id} style={{ marginBottom: '10px' }}>
            <p>Temperature: {data.temperature}, Pressure: {data.pressure}</p>
            <Button variant="primary" onClick={() => openEditModal(data)}>Edit</Button>
            <Button variant="danger" onClick={() => handleDeleteData(data.id)}>Delete</Button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Equipment Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Temperature</Form.Label>
              <Form.Control
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Pressure</Form.Label>
              <Form.Control
                type="number"
                value={formData.pressure}
                onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddData}>Add Data</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Equipment Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Temperature:-</Form.Label>
              <Form.Control
                type="number"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Pressure</Form.Label>
              <Form.Control
                type="number"
                value={formData.pressure}
                onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditData}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
