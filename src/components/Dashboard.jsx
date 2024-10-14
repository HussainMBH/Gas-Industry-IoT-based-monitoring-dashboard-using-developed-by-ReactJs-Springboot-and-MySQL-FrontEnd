import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all equipment data at once
      const response = await axios.get('http://localhost:8080/api/equipment/all');
      setEquipmentData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const checkSafetyCompliance = () => {
    const hasIssues = equipmentData.some(data => data.temperature > 80 || data.pressure > 150);
    if (hasIssues) {
      alert('Safety threshold crossed!');
    }
  };

  useEffect(() => {
    if (equipmentData.length > 0) {
      checkSafetyCompliance();
    }
  }, [equipmentData]);

  return (
    <div style={{ backgroundColor: '#1e1e1e', color: '#ffffff', padding: '20px', borderRadius: '8px' }}>
      <h2>Real Time Monitoring Dashboard</h2>
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
                labels: {
                  color: '#ffffff'
                }
              },
              title: {
                display: true,
                text: 'Equipment Monitoring',
                color: '#ffffff',
                font: {
                  size: 20
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#ffffff'
                },
                grid: {
                  color: '#444444'
                }
              },
              y: {
                ticks: {
                  color: '#ffffff'
                },
                grid: {
                  color: '#444444'
                }
              }
            }
          }}
        />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Dashboard;
