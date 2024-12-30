import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { common } from '../../src/helper/Common';
import { setPageHeading } from '../../src/redux/actions/commonAction';
import DataTable from 'react-data-table-component';
import Link from 'next/link';
import svg from '../../src/helper/svg';
import { Tooltip } from '@mui/material';
import axios from 'axios';

const TeamDetails = () => {
    const router = useRouter();
    const { teamId } = router.query;
    const dispatch = useDispatch();
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrStats, setQrStats] = useState({});
    const [loadingStats, setLoadingStats] = useState({});

    useEffect(() => {
        if (teamId) {
            fetchTeamDetails();
        }
    }, [teamId]);

    const fetchQRStats = async (qrId, email) => {
        if (!qrId) {
            console.log('No QR ID for', email);
            return;
        }

        setLoadingStats(prev => ({ ...prev, [email]: true }));
        try {
            console.log('Fetching QR stats for', email, 'with QR ID:', qrId); // Debug log

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

            console.log(`QR Stats for ${email}:`, stats); // Debug log

            setQrStats(prev => ({
                ...prev,
                [email]: stats
            }));

        } catch (error) {
            console.error('Error fetching QR stats for', email, ':', error);
        } finally {
            setLoadingStats(prev => ({ ...prev, [email]: false }));
        }
    };

    const fetchTeamDetails = () => {
        setLoading(true);
        common.getAPI({
            method: 'POST',
            url: 'team/getTeamDetails',
            data: {
                teamId: teamId
            }
        }, async (resp) => {
            setLoading(false);
            if (resp.status === "success") {
                console.log('Team details response:', resp.data);
                setTeamData(resp.data);
                dispatch(setPageHeading({
                    pageHeading: resp.data.teamName,
                    title: `Team - ${resp.data.teamName}`
                }));

                // Fetch QR stats only for members with QR IDs
                for (const member of resp.data.members) {
                    if (member.contactId?.isUser && member.contactId?.qrDetails?.qrId) {
                        console.log('Fetching stats for member:', member.contactId.email);
                        await fetchQRStats(member.contactId.qrDetails.qrId, member.contactId.email);
                    }
                }
            } else {
                setError(resp.message || 'Failed to fetch team details');
            }
        });
    };

    const columns = [
        {
            name: 'Rank',
            width: '80px',
            cell: (row, index) => {
                const memberStats = qrStats[row.contactId?.email];
                if (!memberStats) return '-';
                
                // Get position based on monthly scans
                const position = teamData.members
                    .filter(m => qrStats[m.contactId?.email]) // Only consider members with stats
                    .sort((a, b) => {
                        const aScans = qrStats[a.contactId?.email]?.month || 0;
                        const bScans = qrStats[b.contactId?.email]?.month || 0;
                        return bScans - aScans;
                    })
                    .findIndex(m => m.contactId?.email === row.contactId?.email) + 1;

                // Return rank with medal for top 3
                return (
                    <div className="pu_rank">
                        {position === 1 && <span className="pu_medal gold">🥇</span>}
                        {position === 2 && <span className="pu_medal silver">🥈</span>}
                        {position === 3 && <span className="pu_medal bronze">🥉</span>}
                        {position > 3 && <span className="pu_rank_number">#{position}</span>}
                    </div>
                );
            },
            sortable: false
        },
        {
            name: 'Member',
            selector: row => `${row.contactId?.firstName || ''} ${row.contactId?.lastName || ''}`,
            cell: row => (
                <div className="pu_contact_info">
                    <div className="pu_member_avatar">
                        <div className="Header_header_avatar_icon__9QMxj">
                            <span className="Header_header_avatar_icon_initial__C2_y_">
                                {`${row.contactId?.firstName?.charAt(0) || ''}${row.contactId?.lastName?.charAt(0) || ''}`}
                            </span>
                        </div>
                    </div>
                    <div className="pu_contact_details">
                        <span className="pu_contact_name">
                            {row.contactId?.firstName} {row.contactId?.lastName}
                        </span>
                    </div>
                </div>
            ),
            sortable: true
        },
        {
            name: 'Monthly Scans',
            selector: row => qrStats[row.contactId?.email]?.month || 0,
            cell: row => {
                const stats = qrStats[row.contactId?.email];
                if (!stats) return '-';
                
                return (
                    <div className="pu_monthly_scans">
                        <span className="pu_scan_count">{stats.month}</span>
                        <span className="pu_scan_label">scans</span>
                    </div>
                );
            },
            sortable: true,
            sortFunction: (rowA, rowB) => {
                const aScans = qrStats[rowA.contactId?.email]?.month || 0;
                const bScans = qrStats[rowB.contactId?.email]?.month || 0;
                return bScans - aScans;
            },
            width: '150px'
        },
        {
            name: 'QR Details',
            selector: row => row.contactId?.qrDetails?.qrId || '-',
            cell: row => {
                const qrDetails = row.contactId?.qrDetails;
                if (!row.contactId?.isUser || !qrDetails) {
                    return <span className="pu_no_qr">No QR Details</span>;
                }

                return (
                    <div className="pu_qr_info">
                        <div className="pu_qr_id_wrapper">
                            <span className="pu_label">QR ID:</span>
                            <span className="pu_value">{qrDetails.qrId}</span>
                        </div>
                        <div className="pu_qr_links">
                            {qrDetails.qrUrl && (
                                <Tooltip title="Open QR URL" placement="top" arrow>
                                    <a 
                                        href={qrDetails.qrUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="pu_qr_link"
                                    >
                                        <span>{svg.link}</span>
                                    </a>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                );
            },
            sortable: true,
            width: '200px',
            hide: row => !row.contactId?.isUser
        },
        {
            name: 'QR Scans',
            cell: row => {
                const email = row.contactId?.email;
                const qrId = row.contactId?.qrDetails?.qrId;
                
                if (!qrId || !email) return '-';

                return (
                    <div className="pu_scan_stats">
                        {loadingStats[email] ? (
                            <div className="pu_loading_indicator">Loading...</div>
                        ) : (
                            <div className="pu_stats_container">
                                <div className="pu_stat_item">
                                    <span className="pu_stat_label">Today</span>
                                    <span className="pu_stat_value">{qrStats[email]?.day || 0}</span>
                                </div>
                                <div className="pu_stat_item">
                                    <span className="pu_stat_label">Week</span>
                                    <span className="pu_stat_value">{qrStats[email]?.week || 0}</span>
                                </div>
                                <div className="pu_stat_item">
                                    <span className="pu_stat_label">Month</span>
                                    <span className="pu_stat_value">{qrStats[email]?.month || 0}</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            },
            sortable: true,
            sortFunction: (rowA, rowB) => {
                const aScans = qrStats[rowA.contactId?.email]?.month || 0;
                const bScans = qrStats[rowB.contactId?.email]?.month || 0;
                return bScans - aScans;
            },
            width: '250px',
            hide: row => !row.contactId?.isUser || !row.contactId?.qrDetails?.qrId
        }
    ];

    // Sort members by monthly scans after fetching QR stats
    const sortedMembers = teamData?.members.sort((a, b) => {
        const aScans = qrStats[a.contactId?.email]?.month || 0;
        const bScans = qrStats[b.contactId?.email]?.month || 0;
        return bScans - aScans; // Sort in descending order
    }) || [];

    return (
        <div className="pu_container">
            <div className="pu_pagetitle_wrapper">
                <div className="pu_pagetitle_left">
                    <Link href="/teams">
                        <a className="pu_back_arrow">
                            <span className="pu_back_arrow_icon">{svg.back_arrow}</span>
                            Back to Teams
                        </a>
                    </Link>
                    {teamData && (
                        <>
                            <h3>{teamData.teamName}</h3>
                            {teamData.description && (
                                <p className="pu_team_description">{teamData.description}</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {error && <div className="pu_error">{error}</div>}

            <div className="pu_dataTablestyle">
                <DataTable
                    columns={columns}
                    data={sortedMembers}
                    pagination
                    progressPending={loading}
                    noDataComponent={
                        <div className="pu_noData">
                            <span>{svg.noData}</span>
                            <h3>No Records Found.</h3>
                            <p>There are no members in this team.</p>
                        </div>
                    }
                    customStyles={{
                        headRow: {
                            style: {
                                backgroundColor: '#f8f9fa',
                                borderBottom: '1px solid #dee2e6'
                            }
                        },
                        rows: {
                            style: {
                                minHeight: '72px'
                            }
                        },
                        cells: {
                            style: {
                                padding: '16px'
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default TeamDetails;