import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { common } from '../src/helper/Common';
import { setPageHeading, updateMyStatus, confirmPopupStatus } from '../src/redux/actions/commonAction';
import validator from 'validator';
import svg from '../src/helper/svg';
import { Tooltip } from '@mui/material';
import { AlertMsg, Loading } from '../src/helper/helper';
import Popup from '../src/components/common/popup/Popup';
import axios from 'axios';

const Contacts = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [company, setCompany] = useState('');
    const [website, setWebsite] = useState('');
    const [remarks, setRemarks] = useState('');
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [addContactPopup, setAddContactPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [qrStats, setQrStats] = useState({});
    const [loadingStats, setLoadingStats] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "Contacts",
            title: "Contacts"
        }));
        fetchContacts(1);
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

            console.log(`QR Stats for ${email}:`, stats);
            
        } catch (error) {
           
        } finally {
            setLoadingStats(prev => ({ ...prev, [email]: false }));
        }
    };

    const fetchContacts = async (page, perPageRows = perPage, isPerPage = false) => {
        setLoading(true);
        common.getAPI({
            method: 'POST',
            url: 'contact/getContacts',
            data: {
                page: page,
                listPerPage: perPageRows,
                searchTerm: searchTerm.trim()
            }
        }, async (resp) => {
            setLoading(false);
            if (resp.status === "success") {
                setContactList(resp.data);
                setTotalRows(resp.totalContacts);
                
                for (const contact of resp.data) {
                    if (contact.isUser && contact.qrId) {
                        await fetchQRStats(contact.qrId, contact.email);
                    }
                }
                
                if (isPerPage) {
                    setPerPage(perPageRows);
                }
            }
        });
    };

    const handlePageChange = (page) => {
        fetchContacts(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        fetchContacts(page, newPerPage, true);
    };

    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);
        if (e.keyCode === 13) {
            fetchContacts(1);
        }
    };

    const handleEdit = (row) => {
        setIsEdit(true);
        setEditId(row._id);
        setFirstName(row.firstName);
        setLastName(row.lastName);
        setEmail(row.email);
        setPhoneNumber(row.phoneNumber);
        setCompany(row.company || '');
        setWebsite(row.website || '');
        setRemarks(row.remarks || '');
        setAddContactPopup(true);
    };

    const handleDelete = (id) => {
        dispatch(confirmPopupStatus(true, {
            type: 'Contact',
            url: 'contact/deleteContact',
            data: { contactId: id },
            action: () => {
                dispatch(confirmPopupStatus(false, {}));
                fetchContacts(1);
            }
        }));
    };

    const deleteContact = async (id) => {
        Loading(true);
        common.getAPI({
            method: 'POST',
            url: 'contact/deleteContact',
            data: {
                contactId: id
            }
        }, (resp) => {
            Loading(false);
            if (resp.status === "success") {
                AlertMsg('success', 'Success', resp.message);
                fetchContacts(1);
            }
        });
    };

    const contactPopupCloseHandler = () => {
        setAddContactPopup(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setCompany('');
        setWebsite('');
        setRemarks('');
        setIsEdit(false);
        setEditId('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            firstName,
            lastName,
            email,
            phoneNumber,
            company,
            website,
            remarks
        };

        if (isEdit) {
            data.contactId = editId;
        }

        common.getAPI({
            method: 'POST',
            url: `contact/${isEdit ? 'updateContact' : 'addContact'}`,
            data: data
        }, (resp) => {
            if (resp.status === "success") {
                setAddContactPopup(false);
                fetchContacts(1);
                // Reset form
                contactPopupCloseHandler();
            }
        });
    };

    const handleCopyContact = (row) => {
        const contactInfo = `
Contact Information:
------------------
Name: ${row.firstName} ${row.lastName}
Email: ${row.email}
Phone: ${row.phoneNumber}
Company: ${row.company || '-'}
Website: ${row.website || '-'}
Remarks: ${row.remarks || '-'}
    `.trim();

        navigator.clipboard.writeText(contactInfo).then(() => {
            AlertMsg('success', 'Contact information copied to clipboard');
        }).catch(() => {
            AlertMsg('error', 'Failed to copy contact information');
        });
    };

    const qrStatsColumns = [
        {
            name: 'Today\'s Scans',
            width: '120px',
            cell: row => (
                <div className="pu_scan_stats">
                    {row.isUser && row.qrId ? (
                        loadingStats[row.email] ? (
                            <div className="pu_loading_indicator">Loading...</div>
                        ) : (
                            <span className="pu_scan_count">
                                {qrStats[row.email]?.day || '0'}
                                <span className="pu_scan_label">scans</span>
                            </span>
                        )
                    ) : '-'}
                </div>
            )
        },
        {
            name: 'Weekly Scans',
            width: '120px',
            cell: row => (
                <div className="pu_scan_stats">
                    {row.isUser && row.qrId ? (
                        loadingStats[row.email] ? (
                            <div className="pu_loading_indicator">Loading...</div>
                        ) : (
                            <span className="pu_scan_count">
                                {qrStats[row.email]?.week || '0'}
                                <span className="pu_scan_label">scans</span>
                            </span>
                        )
                    ) : '-'}
                </div>
            )
        },
        {
            name: 'Monthly Scans',
            width: '120px',
            cell: row => (
                <div className="pu_scan_stats">
                    {row.isUser && row.qrId ? (
                        loadingStats[row.email] ? (
                            <div className="pu_loading_indicator">Loading...</div>
                        ) : (
                            <span className="pu_scan_count">
                                {qrStats[row.email]?.month || '0'}
                                <span className="pu_scan_label">scans</span>
                            </span>
                        )
                    ) : '-'}
                </div>
            )
        }
    ];

    const columns = [
        {
            name: '#S.N.',
            width: '70px',
            center: true,
            cell: (row, index) => (<span>{'#'+(index + 1)}</span>)
        },
        {
            name: 'Name',
            selector: row => `${row.firstName} ${row.lastName}`,
            sortable: true,
            cell: row => (
                <div className="pu_avatarName_wrapper">
                    <div className="pu_avatar_icon">
                        <span className="pu_avatar_initial">{row.firstName.charAt(0) + row.lastName.charAt(0)}</span>
                    </div>
                    <div className="pu_avatar_name">{row.firstName} {row.lastName}</div>
                </div>
            )
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phoneNumber,
        },
        {
            name: 'Company',
            selector: row => row.company || '-',
        },
        {
            name: 'Website',
            selector: row => row.website || '-',
            cell: row => (
                <a href={row.website} target="_blank" rel="noopener noreferrer" className="pu_link">
                    {row.website || '-'}
                </a>
            )
        },
        {
            name: 'Remarks',
            selector: row => row.remarks || '-',
            wrap: true,
            width: '200px'
        },
        {
            name: 'User Status',
            selector: row => row.isUser ? 'Registered User' : 'Contact Only',
            sortable: true,
            cell: row => (
                <div className="pu_user_status">
                    {row.isUser ? (
                        <span className="pu_status active">
                            {svg.user_check_icon}
                            Registered User
                        </span>
                    ) : (
                        <span className="pu_status">
                            {svg.user_icon}
                            Contact Only
                        </span>
                    )}
                </div>
            )
        },
        {
            name: 'QR ID',
            selector: row => row.qrId || '-',
            sortable: true,
            cell: row => (
                <div className="pu_qr_id">
                    {row.isUser && row.qrId ? (
                        <Tooltip title="QR Code ID" placement="top" arrow>
                            <span className="pu_qr_code">
                                {svg.qr_code_icon}
                                {row.qrId}
                            </span>
                        </Tooltip>
                    ) : '-'}
                </div>
            )
        },
        ...qrStatsColumns,
        {
            name: 'Actions',
            cell: row => (
                <div className="pu_datatable_btns">
                    <Tooltip title="Edit" placement="top" arrow>
                        <a onClick={() => handleEdit(row)} className="pu_dt_btn edit">
                            {svg.dt_edit_icon}
                        </a>
                    </Tooltip>
                    <Tooltip title="Copy Contact Info" placement="top" arrow>
                        <div className="pu_btn_icon" onClick={() => handleCopyContact(row)}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.75 13.123H11.025C10.571 14.257 9.472 15 8.25 14.998H3C1.344 14.999 0 13.656 0 12V11.999V5.999C0.002 4.488 1.126 3.214 2.625 3.022V8.999C2.625 11.271 4.477 13.123 6.75 13.123ZM13.125 3.187H14.715C14.669 3.12 14.616 3.057 14.557 3L12 0.443C11.945 0.384 11.882 0.334 11.812 0.293V1.875C11.816 2.598 12.401 3.184 13.125 3.187ZM13.125 4.312C11.78 4.31 10.69 3.22 10.687 1.875V0H6.75C5.094 0 3.75 1.342 3.75 2.998C3.75 2.999 3.75 2.999 3.75 3V8.999C3.75 10.655 5.092 11.998 6.748 11.999C6.749 11.999 6.749 11.999 6.75 11.999H12C13.656 11.999 15 10.657 15 9.001C15 9 15 8.999 15 8.999V4.312H13.125Z" fill="#C7CBE1"/>
                            </svg>
                        </div>
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
                    <h3>Contacts ({totalRows})</h3>
                    <div className="pu_pagetitle_right">
                        <div className="pu_search_wrapper">
                            <input type="text" placeholder="Search" onKeyUp={handleSearchKeyupEvent}/>
                            <span className="pu_search_icon">{svg.search}</span>
                        </div>
                        <button className="pu_btn" onClick={() => setAddContactPopup(true)}>Add New Contact</button>
                    </div>
                </div>

                <div className="pu_dataTablestyle">
                    {contactList.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={contactList}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handlePerRowsChange}
                            progressPending={loading}
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
                    ) : (
                        <div className="pu_noData">
                            <span>{svg.noData}</span>
                            <h3>No Records Found.</h3>
                            <p>There are no contacts available.</p>
                        </div>
                    )}
                </div>
            </div>

            <Popup
                heading={isEdit ? 'Edit Contact' : 'Add Contact'}
                show={addContactPopup}
                onClose={contactPopupCloseHandler}
            >
                <form onSubmit={handleSubmit}>
                    <div className="pu_input_wrapper">
                        <label>First Name*</label>
                        <input type="text" className="pu_input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Last Name*</label>
                        <input type="text" className="pu_input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Email*</label>
                        <input type="email" className="pu_input" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Phone Number*</label>
                        <input type="text" className="pu_input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Company</label>
                        <input type="text" className="pu_input" value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Website</label>
                        <input type="text" className="pu_input" value={website} onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                    <div className="pu_input_wrapper">
                        <label>Remarks</label>
                        <textarea className="pu_input" value={remarks} onChange={(e) => setRemarks(e.target.value)}></textarea>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="pu_btn">{isEdit ? 'Update' : 'Add Contact'}</button>
                    </div>
                </form>
            </Popup>
        </>
    );
};

export default Contacts;