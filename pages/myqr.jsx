import React, { useEffect, useState } from 'react';
import QRCodeList from '../src/components/common/qrcode/QRCodeList';
import { Box, Typography } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, BarElement, ArcElement);

const MyQR = () => {
    const [lineData, setLineData] = useState({
        labels: [],
        datasets: [
            {
                label: 'QR Code Scans',
                data: [],
                fill: false,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: '#f58123',
            },
        ],
    });

    const [barData, setBarData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Monthly Visitors',
                data: [],
                backgroundColor: '#f58123',
                borderColor: '#f58123',
            },
        ],
    });

    const [pieData, setPieData] = useState({
        labels: ['Total Scans', 'Total Unique Scans'],
        datasets: [
            {
                data: [],
                backgroundColor: ['#f58123', 'rgba(75,192,192,1)'],
            },
        ],
    });

    const [qrid, setQrid] = useState(null); // State to hold the QR ID

    useEffect(() => {
        console.log('useEffect triggered'); // Log when useEffect runs
        const persistedData = localStorage.getItem('persist:root');
        if (persistedData) {
            const parsedData = JSON.parse(persistedData);
            const userData = JSON.parse(parsedData.userData);
            const userId = userData.user_id;

            const fetchQRCodeData = async () => {
                try {
                     // Log user ID
                    const response = await axios.get(`/api/user/getQRData?userId=${userId}`);
                    if (response.data) {
                        const fetchedQrid = response.data.qrId; // Set the QR ID dynamically
                        setQrid(fetchedQrid);
                        console.log('Fetched QR ID:', fetchedQrid); // Log the fetched QR ID
                        console.log('Type of QR ID:', typeof fetchedQrid); // Check the type of QR ID
                    } else {
                        console.log('No QR data found for user ID:', userId); // Log if no data found
                    }
                } catch (err) {
                    console.error('Error fetching QR code data:', err);
                }
            };

            fetchQRCodeData();
        } else {
            console.log('No persisted data found in local storage.'); // Log if no persisted data
        }
    }, []);

    const fetchData = async () => {
        if (!qrid) {
            console.log('QR ID is not set yet.'); // Log if QR ID is not set
            return; // Exit if QR ID is not set
        }

        console.log('QR ID before fetching data:', qrid); // Log the QR ID before fetching data

        const period = 'week'; // Set to 'week' for weekly data
        const timezone = 'Asia/Singapore'; // Set your desired timezone
        const apiKey = '668db5e0-b812-11ef-95be-712daf5bc246'; // Replace with your actual API key

        try {
            const response = await axios.get(`https://api.qrtiger.com/api/data/${qrid}`, {
                params: { period, tz: timezone },
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: 'application/json',
                },
            });

            console.log('API Response:', response.data); // Log the API response

            const data = response.data.data;

            // Process the data for the line chart
            const lineLabels = data.graph.map(item => `${item._id.day}/${item._id.month}`); // Day/Month format
            const lineValues = data.graph.map(item => item.count); // Scan counts

            // Ensure at least 7 data points for the line chart
            while (lineValues.length < 7) {
                lineValues.unshift(0); // Add 0s at the beginning
                lineLabels.unshift(''); // Add empty labels
            }

            setLineData({
                labels: lineLabels,
                datasets: [
                    {
                        label: 'QR Code Scans',
                        data: lineValues,
                        fill: false,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: '#f58123',
                    },
                ],
            });

            // Process the data for the bar chart
            const barLabels = data.unique.map(item => `${item._id.day}/${item._id.month}`); // Day/Month format
            const barValues = data.unique.map(item => item.count); // Unique scan counts

            // Ensure at least 7 data points for the bar chart
            while (barValues.length < 7) {
                barValues.unshift(0); // Add 0s at the beginning
                barLabels.unshift(''); // Add empty labels
            }

            setBarData({
                labels: barLabels,
                datasets: [
                    {
                        label: 'Monthly Visitors',
                        data: barValues,
                        backgroundColor: '#f58123',
                        borderColor: '#f58123',
                    },
                ],
            });

            // Set data for the Pie chart
            const totalScans = data.scans; // Total scans
            const totalUniqueScans = data.totalUniqueScan; // Total unique scans
            setPieData({
                labels: ['Total Scans', 'Total Unique Scans'],
                datasets: [
                    {
                        data: [totalScans, totalUniqueScans],
                        backgroundColor: ['#f58123', 'rgba(75,192,192,1)'],
                    },
                ],
            });

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (qrid) {
            fetchData();
        }
    }, [qrid]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'QR Code Scans Over Time',
            },
        },
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Visitors',
            },
        },
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Total Scans vs Unique Scans',
            },
        },
    };

    return (
        <div className="pu_container">
            <h1>My QR Codes</h1>
            <QRCodeList /> <h1>My QR Analytics</h1>
            <Box sx={{ padding: 2 }}>
                <Box className="pu_analytics_white_box_list" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box className="pu_analytics_white_box" sx={{ flex: '1 1 50%', maxWidth: '1200px', padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
                        <Line data={lineData} options={options} />
                    </Box>
                    <Box className="pu_analytics_white_box" sx={{ flex: '1 1 50%', maxWidth: '1200px', padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
                        <Bar data={barData} options={barOptions} />
                    </Box>
                    <Box className="pu_analytics_white_box" sx={{ flex: '1 1 100%', maxWidth: '1200px', padding: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 1 }}>
                        <Pie data={pieData} options={pieOptions} />
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default MyQR;