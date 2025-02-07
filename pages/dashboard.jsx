import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LinkList from "../src/components/common/linklist/LinkList";
import { common } from "../src/helper/Common";
import svg from "../src/helper/svg";
import { setPageHeading } from "../src/redux/actions/commonAction";
import PlanAlert from "../src/components/common/PlanAlert";
import UserTutorial from '../src/components/UserTutorial';

import styles from '../styles/pages/Dashboard.module.css';

const Dashboard = () => {

    const [data, setData] = useState(null)
    const [monthlyVisitor, setMonthlyVisitor] = useState(0)
    const [weeklyClicks, setWeeklyClicks] = useState(0)
    const [weeklyVisitor, setWeeklyVisitor] = useState(0)
    const [showAlertBar, setShowAlertBar] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    let dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageHeading({
            pageHeading: "NFSEEK - Dashboard",
            title: "NFSEEK - Dashboard",
        }));
    }, [dispatch]);
    const [linkCount, setLinkCount] = useState('0');

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
            if(resp.data?.adminPlanStatus) {
              if(resp.data.isPlan && resp.data.isExpired) {
                setShowAlertBar(true);
              }
            }
          }
        })
    }

    useEffect(() => {
        common.getAPI(
            {
                method: "POST",
                url: 'user/getDashboardAnalytics ',
            },
            (resp) => {
                if(resp.status === "success"){
                    setMonthlyVisitor(resp.data.totalMonthlyVisitor)
                    setWeeklyClicks(resp.data.totalWeeklyClicks)
                    setWeeklyVisitor(resp.data.totalWeeklyVisitor)
                }
            }
        );
        getCurrentPlan();
    }, [])

    useEffect(() => {
        const tutorialCompleted = localStorage.getItem('tutorialCompleted');
        if (!tutorialCompleted) {
            setShowTutorial(true);
        }
    }, []);

    const handleTutorialClose = () => {
        localStorage.setItem('tutorialCompleted', 'true');
        setShowTutorial(false);
    };

    return (
        <div className="pu_container">
            <PlanAlert show={showAlertBar} onClose={alertBarCloseHandler} />
            {showTutorial && <UserTutorial onClose={handleTutorialClose} />}
            <div className="pu_analytics_white_box_list">
                <div className="pu_analytics_white_box">
                    <div className="pu_awb_icon">
                        {svg.analysis_click}
                    </div>
                    <div className="pu_awb_details">
         
                        <h3>{weeklyClicks}</h3>
                        <p>Weekly Clicks</p>
                    </div>
                </div>
                <div className="pu_analytics_white_box">
                    <div className="pu_awb_icon">
                        {svg.analysis_weekly_visitor}
                    </div>
                    <div className="pu_awb_details">
                        <h3>{weeklyVisitor}</h3>
                        <p>Weekly Visitor</p>
                    </div>
                </div>
                <div className="pu_analytics_white_box">
                    <div className="pu_awb_icon">
                        {svg.analysis_monthly_visitor}
                    </div>
                    <div className="pu_awb_details">
                        <h3>{monthlyVisitor}</h3>
                        <p>Monthly Visitor</p>
                    </div>
                </div>
                {/* <div className="pu_analytics_white_box">
                    <div className="pu_awb_icon">
                        {svg.analysis_links}
                    </div>
                    <div className="pu_awb_details">
                        <h3>{linkCount}</h3>
                        <p>Created Links</p>
                    </div>
                </div> */}
            </div>

            <div className={styles.create_link_header}>
                <h3>My Profile List</h3>
                <Link href="/templates"><a className="pu_btn pu_btn_add">{svg.btn_add_icon} Create New Profile</a></Link>
                {/* <CreateLink>
                    
                </CreateLink> */}
            </div>
            <LinkList setLinkCount={setLinkCount} />
        </div>
    );
}
export default Dashboard;
