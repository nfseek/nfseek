import React, { useState } from 'react';
import axios from 'axios';
import styles from './EditQRModal.module.css';

const EditQRModal = ({ isOpen, onClose, qrData, onSuccess }) => {
    const [url, setUrl] = useState(qrData?.qrUrl || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `https://api.qrtiger.com/api/campaign/edit/${qrData.qrId}`,
                {
                    qrUrl: url,
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
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update QR code');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Edit QR Code</h3>
                    <button 
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="url">URL</label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL"
                            required
                            className={styles.input}
                        />
                    </div>
                    {error && <div className={styles.error}>{error}</div>}
                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`pu_btn pu_btn_secondary ${styles.button}`}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`pu_btn pu_btn_primary ${styles.button}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update QR'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditQRModal;
