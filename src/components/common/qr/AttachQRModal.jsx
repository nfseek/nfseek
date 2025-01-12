import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AttachQRModal.module.css';
import { common } from '../../../helper/Common';

const AttachQRModal = ({ isOpen, onClose, profileUrl }) => {
    const [qrCodes, setQRCodes] = useState([]);
    const [selectedQR, setSelectedQR] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchQRCodes();
        }
    }, [isOpen]);

    const fetchQRCodes = () => {
        setLoading(true);
        common.getAPI({
            method: 'GET',
            url: 'qr/list',
            data: {}
        }, (resp) => {
            if (resp.status === 'success') {
                setQRCodes(resp.data);
            } else {
                setError('Failed to load QR codes');
            }
            setLoading(false);
        });
    };

    const handleAttachQR = async () => {
        if (!selectedQR) return;
        
        setUpdating(true);
        setError(null);

        try {
            const response = await axios.post(
                `https://api.qrtiger.com/api/campaign/edit/${selectedQR.qrId}`,
                {
                    qrUrl: profileUrl,
                    qrType: 'qr2',
                    qrCategory: 'url'
                },
                {
                    headers: {
                        'Authorization': 'Bearer 99bb05e0-cfd1-11ef-b435-afc66f63700c',
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.data) {
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update QR code');
        } finally {
            setUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Attach QR Code</h3>
                    <button 
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {loading ? (
                        <div className={styles.loading}>Loading QR codes...</div>
                    ) : error ? (
                        <div className={styles.error}>{error}</div>
                    ) : (
                        <div className={styles.qrGrid}>
                            {qrCodes.map((qr) => (
                                <div 
                                    key={qr._id} 
                                    className={`${styles.qrCard} ${selectedQR?._id === qr._id ? styles.selected : ''}`}
                                    onClick={() => setSelectedQR(qr)}
                                >
                                    <div className={styles.qrImageWrapper}>
                                        <img
                                            src={qr.imageUrl}
                                            alt={qr.name || 'QR Code'}
                                            className={styles.qrImage}
                                        />
                                    </div>
                                    <div className={styles.qrInfo}>
                                        <h4>{qr.name || 'Untitled QR'}</h4>
                                        <p className={styles.qrUrl}>{qr.qrUrl}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="pu_btn pu_btn_secondary"
                        disabled={updating}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleAttachQR}
                        className="pu_btn pu_btn_primary"
                        disabled={!selectedQR || updating}
                    >
                        {updating ? 'Attaching...' : 'Attach QR'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttachQRModal;
