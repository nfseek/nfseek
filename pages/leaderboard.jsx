import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPageHeading } from '../src/redux/actions/commonAction';
import DataTable from 'react-data-table-component';

const Leaderboard = () => {
    const [loading, setLoading] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [qrStats, setQrStats] = useState({});
    const [loadingStats, setLoadingStats] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Leaderboard",
            title: "User Leaderboard"
        }));
        fetchLeaderboardData();
    }, []);

    const fetchQRStats = async (qrId, email) => {
        setLoadingStats(prev => ({ ...prev, [email]: true }));
        try {
            const response = await axios.get(`https://api.qrtiger.com/api/data/${qrId}`, {
                params: {
                    period: 'month',
                    tz: 'Asia/Singapore'
                },
                headers: {
                    Authorization: 'Bearer 668db5e0-b812-11ef-95be-712daf5bc246',
                    Accept: 'application/json'
                }
            });

            const data = response.data.data;

            if (!data || !data.graph || data.graph.length === 0) {
                
                setQrStats(prev => ({
                    ...prev,
                    [email]: {
                        day: 0,
                        week: 0,
                        month: data.totalScanByDate || 0
                    }
                }));
                return;
            }

            const stats = {
                day: data.graph.filter(item => {
                    const date = new Date(item._id.year, item._id.month - 1, item._id.day);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                }).reduce((sum, item) => sum + item.count, 0),

                week: data.graph.filter(item => {
                    const date = new Date(item._id.year, item._id.month - 1, item._id.day);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date >= weekAgo;
                }).reduce((sum, item) => sum + item.count, 0),

                month: data.totalScanByDate || 0
            };

            setQrStats(prev => {
                const newStats = {
                    ...prev,
                    [email]: stats
                };
                
                // Update leaderboard data with new stats
                updateLeaderboardWithStats(newStats);
                return newStats;
            });

            
        } catch (error) {
            
        } finally {
            setLoadingStats(prev => ({ ...prev, [email]: false }));
        }
    };

    const updateLeaderboardWithStats = (newStats) => {
        setLeaderboardData(prevData => {
            const updatedData = prevData.map(user => ({
                ...user,
                todayScans: newStats[user.email]?.day || 0,
                weeklyScans: newStats[user.email]?.week || 0,
                monthScans: newStats[user.email]?.month || 0
            }));

            // Sort by monthly scans
            const sortedData = [...updatedData].sort((a, b) => 
                (b.monthScans || 0) - (a.monthScans || 0)
            );

            // Add ranks
            return sortedData.map((user, index) => ({
                ...user,
                rank: index + 1
            }));
        });
    };

    const fetchLeaderboardData = async () => {
        setLoading(true);
        try {
            const persistedData = localStorage.getItem('persist:root');
            if (persistedData) {
                const parsedData = JSON.parse(persistedData);
                const userData = JSON.parse(parsedData.userData);
                const token = userData.token;

                const response = await axios.get('/api/user/getAllActiveUsers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.status === "success") {
                    const users = response.data.data;
                    
                    // Set initial data
                    const initialData = users.map(user => ({
                        ...user,
                        profilePicture: user.profilePicture?.file || '',
                        fullName: user.name || 'Unknown User',
                        todayScans: 0,
                        weeklyScans: 0,
                        monthScans: 0,
                        rank: 0
                    }));
                    
                    setLeaderboardData(initialData);

                    // Fetch QR stats for each user
                    for (const user of users) {
                        if (user.qrId) {
                            await fetchQRStats(user.qrId, user.email);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setLeaderboardData([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            name: 'Rank',
            selector: row => row.rank,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Profile Picture',
            selector: row => row.profilePicture || '',
            cell: row => {
                if (row.profilePicture) {
                    return <img src={row.profilePicture} alt="Profile" style={{ width: '50px', borderRadius: '50%' }} />;
                } else {
                    const initial = row.fullName ? row.fullName.charAt(0).toUpperCase() : '?';
                    return (
                        <div className="Header_header_avatar_icon__9QMxj" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                            <span className="Header_header_avatar_icon_initial__C2_y_">{initial}</span>
                        </div>
                    );
                }
            },
            sortable: false,
            width: '100px'
        },
        {
            name: 'Full Name',
            selector: row => row.fullName,
            sortable: true,
        },
        {
            name: 'Today\'s Scans',
            selector: row => row.todayScans,
            sortable: true,
            right: true,
        },
        {
            name: 'Weekly Scans',
            selector: row => row.weeklyScans,
            sortable: true,
            right: true,
        },
        {
            name: 'Monthly Scans',
            selector: row => row.monthScans,
            sortable: true,
            right: true,
        }
    ];

    return (
        <div className="pu_container">
            <div className="pu_pagetitle_wrapper">
                <h3>Leaderboard</h3>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="pu_dataTablestyle">
                    <DataTable
                        columns={columns}
                        data={leaderboardData}
                        pagination
                        customStyles={{
                            headRow: {
                                style: {
                                    backgroundColor: '#f8f9fa',
                                    borderBottom: '1px solid #dee2e6'
                                }
                            },
                            cells: {
                                style: {
                                    padding: '15px'
                                }
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
