import Link from "next/link";
import styles from '../help.module.css';
const editingDesigning = () => {
    return (
        <>
            <div className={styles.page_full_handle}>
                <div className="pu_container">
                    <div className={styles.pu_wr}>
                        <h3 className={styles.page_heading}>Editing And Designing</h3>
                        <div className={styles.page_handle}>
                            <Link href="/help"><a  className={styles.link___active}> Help <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_22_10)"><path d="M7.64506 5.49505L3.34522 9.79476C3.0717 10.0684 2.62823 10.0684 2.35484 9.79476C2.08143 9.52135 2.08143 9.0779 2.35484 8.80451L6.15953 4.99993L2.35495 1.19548C2.08154 0.921955 2.08154 0.478552 2.35495 0.205141C2.62836 -0.0683805 3.07181 -0.0683805 3.34533 0.205141L7.64517 4.50492C7.78188 4.64169 7.85015 4.82075 7.85015 4.99991C7.85015 5.17915 7.78174 5.35835 7.64506 5.49505Z" fill="#F9913A"/></g><defs><clipPath id="clip0_22_10"><rect width="10" height="10" fill="white"/></clipPath></defs></svg> </a></Link>
                            <a> Editing And Designing </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pu_container">
                <div className={`${styles.help_main} ${styles.pu_editing_designing}`}> 
                    <Link href="/help/editing-and-designing/change-profile"><a>How to change my profile details</a></Link>
                    <Link href="/help/editing-and-designing/add-new-element"><a>How to add new elements on a page</a></Link>
                    <Link href="/help/editing-and-designing/create-new-page"><a>How to create new page</a></Link>
                    <Link href="/help/editing-and-designing/duplicate-page"><a>How to duplicate page</a></Link>
                    <Link href="/help/editing-and-designing/delete-page"><a>How to delete page</a></Link>
                    <Link href="/help/editing-and-designing/change-order"><a>How to change order elements</a></Link>
                </div>
            </div>
         </>
        
     
    );
}
export default editingDesigning;