import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { common } from '../src/helper/Common';
import { setPageHeading, confirmPopupStatus } from '../src/redux/actions/commonAction';
import validator from 'validator';
import svg from '../src/helper/svg';
import { Tooltip } from '@mui/material';
import { AlertMsg, Loading } from '../src/helper/helper';
import Popup from '../src/components/common/popup/Popup';
import Select from 'react-select';
import { useRouter } from 'next/router';
import axios from 'axios';

const Teams = () => {
    const [teamName, setTeamName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [contactOptions, setContactOptions] = useState([]);
    const [teamList, setTeamList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [addTeamPopup, setAddTeamPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [qrStats, setQrStats] = useState({});
    const [loadingStats, setLoadingStats] = useState({});

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Teams",
            title: "Teams"
        }));
        fetchTeams(1);
        fetchContacts();
    }, []);

    const fetchTeams = async (page, perPageRows = perPage, isPerPage = false) => {
        setLoading(true);
        common.getAPI({
            method: 'POST',
            url: 'team/getTeams',
            data: {
                page: page,
                listPerPage: perPageRows,
                searchTerm: searchTerm.trim()
            }
        }, (resp) => {
            setLoading(false);
            if (resp.status === "success") {
                setTeamList(resp.data);
                setTotalRows(resp.totalTeams);
                if (isPerPage) {
                    setPerPage(perPageRows);
                }
            }
        });
    };

    const fetchContacts = async () => {
        common.getAPI({
            method: 'POST',
            url: 'contact/getContacts',
            data: {
                page: 1,
                listPerPage: 100,
                searchTerm: ''
            }
        }, (resp) => {
            if (resp.status === "success") {
                const options = resp.data.map(contact => ({
                    value: contact._id,
                    label: `${contact.firstName} ${contact.lastName} (${contact.email})`
                }));
                setContactOptions(options);
            }
        });
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!teamName || selectedContacts.length === 0) {
            AlertMsg('error', 'Please fill all required fields');
            return;
        }

        Loading(true);
        common.getAPI({
            method: 'POST',
            url: isEdit ? 'team/updateTeam' : 'team/addTeam',
            data: {
                teamName,
                description: description || '',
                members: selectedContacts.map(contact => contact.value),
                teamId: editId
            }
        }, (resp) => {
            Loading(false);
            if (resp.status === "success") {
                AlertMsg('success', resp.message);
                fetchTeams(1);
                teamPopupCloseHandler();
            } else {
                AlertMsg('error', resp.message || 'Something went wrong');
            }
        });
    };

    const handleEdit = (row) => {
        setIsEdit(true);
        setEditId(row._id);
        setTeamName(row.teamName);
        setDescription(row.description || '');
        setSelectedContacts(row.members.map(member => ({
            value: member.contactId._id,
            label: `${member.contactId.firstName} ${member.contactId.lastName} (${member.contactId.email})`
        })));
        setAddTeamPopup(true);
    };

    const handleDelete = (id) => {
        dispatch(confirmPopupStatus(true, {
            type: 'Team',
            url: 'team/deleteTeam',
            data: { teamId: id },
            action: () => {
                dispatch(confirmPopupStatus(false, {}));
                fetchTeams(1);
            }
        }));
    };

    const teamPopupCloseHandler = () => {
        setAddTeamPopup(false);
        setTeamName('');
        setDescription('');
        setSelectedContacts([]);
        setIsEdit(false);
        setEditId('');
    };

    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchTeams(1);
        }
    };

    const handlePageChange = (page) => {
        fetchTeams(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchTeams(page, newPerPage, true);
    };

    const memberColumns = [
        {
            name: '#S.N.',
            width: '70px',
            center: true,
            cell: (row, index) => (<span>{'#'+(index + 1)}</span>)
        },
        {
            name: 'Team Name',
            selector: row => row.teamName,
            sortable: true,
            cell: row => (
                <div className="pu_avatarName_wrapper" onClick={() => router.push(`/teams/${row._id}`)}>
                    <div className="pu_avatar_icon">
                        <span className="pu_avatar_initial">{row.teamName.charAt(0)}</span>
                    </div>
                    <div className="pu_avatar_name" style={{ cursor: 'pointer' }}>{row.teamName}</div>
                </div>
            )
        },
        {
            name: 'Members',
            selector: row => row.members?.length || 0,
            cell: row => (
                <div className="pu_team_members">
                    {row.members.map((member, index) => (
                        <Tooltip key={index} title={`${member.contactId.firstName} ${member.contactId.lastName}`} placement="top" arrow>
                            <div className="pu_member_avatar">
                                <span>{member.contactId.firstName.charAt(0)}{member.contactId.lastName.charAt(0)}</span>
                            </div>
                        </Tooltip>
                    )).slice(0, 3)}
                    {row.members.length > 3 && 
                        <div className="pu_member_count">+{row.members.length - 3}</div>
                    }
                </div>
            )
        },
        {
            name: 'Description',
            selector: row => row.description || '-',
            wrap: true,
            width: '200px'
        },
        
        
        
        {
            name: 'Actions',
            cell: row => (
                <div className="pu_datatable_btns">
                    <Tooltip title="Edit" placement="top" arrow>
                        <a onClick={() => handleEdit(row)} className="pu_dt_btn edit">
                            {svg.dt_edit_icon}
                        </a>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top" arrow>
                        <a onClick={() => handleDelete(row._id)} className="pu_dt_btn delete">
                            {svg.dt_delete_icon}
                        </a>
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <>
            <div className="pu_container">
                <div className="pu_pagetitle_wrapper">
                    <h3>Teams ({totalRows})</h3>
                    <div className="pu_pagetitle_right">
                        <div className="pu_search_wrapper">
                            <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent}/>
                            <span className="pu_search_icon">{svg.search}</span>
                        </div>
                        <button className="pu_btn" onClick={() => setAddTeamPopup(true)}>Create New Team</button>
                    </div>
                </div>

                <DataTable
                    columns={memberColumns}
                    data={teamList}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                />

                <Popup
                    heading={isEdit ? 'Edit Team' : 'Create Team'}
                    show={addTeamPopup}
                    onClose={teamPopupCloseHandler}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="pu_input_wrapper">
                            <label>Team Name*</label>
                            <input type="text" className="pu_input" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                        </div>
                        <div className="pu_input_wrapper">
                            <label>Description</label>
                            <textarea className="pu_input" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                        <div className="pu_input_wrapper">
                            <label>Team Members*</label>
                            <Select
                                isMulti
                                options={contactOptions}
                                value={selectedContacts}
                                onChange={setSelectedContacts}
                                className="pu_select"
                                placeholder="Select team members"
                            />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="pu_btn">{isEdit ? 'Update Team' : 'Create Team'}</button>
                        </div>
                    </form>
                </Popup>
            </div>
        </>
    );
};

export default Teams;