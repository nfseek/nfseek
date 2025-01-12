import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageHeading } from "../src/redux/actions/commonAction";
import { common } from "../src/helper/Common";
import PlanAlert from "../src/components/common/PlanAlert";
import Link from "next/link";
import QRList from "../src/components/qr-list/QRList";
import styles from '../src/components/qr-list/QRList.module.css';

const QRCodes = () => {
    const dispatch = useDispatch();
    const [qrCount, setQRCount] = useState('0');
    const [showAlertBar, setShowAlertBar] = useState(false);

    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "NFSEEK - QR Codes",
            title: "NFSEEK - QR Codes",
        }));
    }, [dispatch]);

    const alertBarCloseHandler = () => {
        setShowAlertBar(false);
    }

    const getCurrentPlan = () => {
        common.getAPI({
            method: 'POST',
            url: 'user/getCurrentPlan',
            data: {}
        }, (resp) => {
            if (resp.status === "success") {
                if (resp.data?.adminPlanStatus) {
                    if (resp.data.isPlan && resp.data.isExpired) {
                        setShowAlertBar(true);
                    }
                }
            }
        })
    }

    useEffect(() => {
        getCurrentPlan();
    }, []);

    return (
        <div className="pu_container">
            <PlanAlert show={showAlertBar} onClose={alertBarCloseHandler} />
            <div className="pu_pagetitle_wrapper">
                <h3>My QR Codes ({qrCount})</h3>
                <div className="pu_pagetitle_right">
                    <Link 
                        href="/qr-generator" 
                        className="pu_btn pu_btn_secondary"
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Create New QR
                        </span>
                    </Link>
                </div>
            </div>
            <QRList setQRCount={setQRCount} />
        </div>
    );
};

export default QRCodes;
