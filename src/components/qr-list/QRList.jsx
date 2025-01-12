import React, { useEffect, useState } from 'react';
import { common } from '../../helper/Common';
import Link from 'next/link';
import styles from './QRList.module.css';
import EditQRModal from './EditQRModal';

const QRList = ({ setQRCount }) => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQR, setSelectedQR] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchQRCodes();
    }, []);

    const fetchQRCodes = () => {
        setLoading(true);
        common.getAPI({
            method: 'GET',
            url: 'qr/list',
            data: {}
        }, (resp) => {
            if (resp.status === 'success') {
                setQRCodes(resp.data);
                setQRCount(resp.data.length);
            } else {
                setError('Failed to load QR codes. Please try again later.');
            }
            setLoading(false);
        });
    };

    if (loading) {
        return <div className="pu_loading">Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.qrGrid}>
            {qrCodes.map((qr) => (
                <div key={qr._id} className={styles.qrCard}>
                    <div className={styles.qrImageWrapper}>
                        <img
                            src={qr.imageUrl}
                            alt={qr.name || 'QR Code'}
                            className={styles.qrImage}
                            style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                        />
                    </div>
                    <div className={styles.qrInfo}>
                        <h4>{qr.name || 'Untitled QR'}</h4>
                        <p className={styles.qrUrl}>{qr.qrUrl}</p>
                        <div className={styles.qrActions}>
                            <button 
                                onClick={() => {
                                    setSelectedQR(qr);
                                    setIsEditModalOpen(true);
                                }}
                                className="pu_btn pu_btn_secondary"
                            >
                                Edit QR Url
                            </button>
                            <a 
                                href={qr.imageUrl}
                                download
                                className="pu_btn pu_btn_primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            ))}
            {qrCodes.length === 0 && (
                <div className={styles.noQR}>
                    <p>No QR codes found. Create your first QR code!</p>
                    <Link href="/qr-generator" className="pu_btn pu_btn_primary">
                        Create QR Code
                    </Link>
                </div>
            )}
            
            <EditQRModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedQR(null);
                }}
                qrData={selectedQR}
                onSuccess={fetchQRCodes}
            />
        </div>
    );
};

export default QRList;
