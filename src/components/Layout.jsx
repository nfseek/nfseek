import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import $ from "jquery";

import Cookies from 'js-cookie';
import Head from 'next/head';
import Alert from './common/Alert';

import { logout} from '../redux/actions/authAction';
import Header from './common/header/Header';
import RemovePopup from './common/removePopup';
import { jwtDecode } from 'jwt-decode'

let Layout = function({children}){

    useEffect(() => {
        /* dropdown start */
        $(document).on('click', '.pu_dropdown_toggle', function(){
            $(this).parent().addClass('open');
        });
        $(document).on('click', '.pu_dropdown_link', function(){
            $('.pu_dropdown_wrapper').removeClass('open');
        });

        $(document).mouseup(function(e){
            var container = $(".pu_dropdown_dd");
            if (!container.is(e.target) && container.has(e.target).length === 0){
                $('.pu_dropdown_wrapper').removeClass('open');
            }
        });
        /* dropdown end */

        /* color picker start */
        $(document).on('click', '.pu_color_picker_toggle', function(){
            $(this).parent().addClass('open');
        });
        $(document).mouseup(function(e){
            var container = $(".pu_color_picker_dropdown");
            if (!container.is(e.target) && container.has(e.target).length === 0){
                $('.pu_color_picker_wrapper').removeClass('open');
            }
        });
        /* color picker end */
    }, [])

    let dispatch = useDispatch();
    const store = useSelector(store => store);
    const router = useRouter();
    let adminUrl = router.pathname.split('/admin/').length >= 2 ? 1 : 0;
    let userUrl = router.pathname.split('/user/').length >= 2 ? 1 : 0;
    let adminDashboard = "/admin/dashboard";
    let userDashboard = "/dashboard";
    let isAuthPage = ['/' ,'/pricing', '/auth/[auth]', '/verify/[id]', '/reset-password/[token]'].includes(router.pathname);
    let tokenCookie = Cookies.get('accessToken') ? Cookies.get('accessToken') : false;
    let tokenData
    if(tokenCookie){
        tokenData = jwtDecode(tokenCookie)
    }
    if (router.pathname.split('/preview/[template_id]/[id]').length > 1 || router.pathname === '/[link_preview]' || router.pathname === '/[link_preview]/[id]') { //preview page
        return ( 
            <> 
                <Head>
                    <title>{store.common.title}</title>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                    <meta name="description" content={store.common.description}/>
                    <meta name="keywords" content={store.common.keywords}/>
                    <meta name="author" content="PixelNX Pvt. Ltd."/>
                    <meta name="MobileOptimized" content="320"/>
                    {/* <link rel="shortcut icon" type="image/ico" href="/images/favicon.png" /> */}
                </Head>
                <div className="pu_preloader">
                    <div className="pu_preloader_inner">
                    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_41_8)"><path className="pu_preloader_box" fillRule="evenodd" clipRule="evenodd" d="M21.593 1.003H32.399C40.467 1.003 47.007 7.538 47.007 15.6C47.007 15.6 47.007 17.981 47.007 20.507C47.007 23.36 47.007 26.397 47.007 26.397C47.007 34.459 40.467 40.994 32.399 40.994H21.593C13.525 40.994 6.985 34.459 6.985 26.397V15.6C6.985 7.538 13.525 1.003 21.593 1.003Z" fill="white"/></g><path className="pu_preloader_box" d="M21.593 1.003H32.399C40.467 1.003 47.007 7.538 47.007 15.6C47.007 15.6 47.007 17.981 47.007 20.507C47.007 23.36 47.007 26.397 47.007 26.397C47.007 34.459 40.467 40.994 32.399 40.994H21.593C13.525 40.994 6.985 34.459 6.985 26.397V15.6C6.985 7.538 13.525 1.003 21.593 1.003Z" fill="url(#paint0_linear_41_8)"/><defs><filter id="filter0_d_41_8" x="0.661001" y="0.679" width="52.67" height="52.639" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="6"/><feGaussianBlur stdDeviation="3.162"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.568627 0 0 0 0 0.392157 0 0 0 0.3 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_41_8"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_41_8" result="shape"/></filter><filter id="filter1_d_41_8" x="16.007" y="12.011" width="21.99" height="22.991" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="2"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_41_8"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_41_8" result="shape"/></filter><linearGradient id="paint0_linear_41_8" x1="34.7867" y1="29.7701" x2="7.00729" y2="0.981489" gradientUnits="userSpaceOnUse"><stop stopColor="#FF5874"/><stop offset="1" stopColor="#FFAD5D"/></linearGradient></defs></svg>
                    <p className="pu_preloader_text hide">Loading...</p>
                    </div>
                </div>
                {children}
            </> 
        )
    }else{
        if((!tokenCookie || !store.userData.token) && !isAuthPage){//member page withoud token
            dispatch(logout())
        }else if(store.userData.token && tokenCookie && store.userData.token != tokenCookie ){
            dispatch(logout())
        }else{
            if(tokenCookie && store.userData.token && isAuthPage){//check user login and access any auth pages
                //Router.push(store.userData.role == true?adminDashboard : userDashboard);
                if(tokenData?.role == 1){
                    Router.push(adminDashboard);
                }else if(tokenData?.role == 2){
                    if(router.pathname !== '/'){
                        Router.push(adminDashboard);
                    }
                }
            }else{
                if(tokenData?.role == 2 && adminUrl) { //restriction user for admin page access
                    Router.push(userDashboard);
                } else if (tokenData?.role == 1 && userUrl) { //restriction admin for user page access
                    Router.push(adminDashboard);
                }
            }
        }

        return (
            <>
                <Head>
                    <title>{store.common.title}</title>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                    <meta name="description" content={store.common.description}/>
                    <meta name="keywords" content={store.common.keywords}/>
                    <meta name="author" content="PixelNX Pvt. Ltd."/>
                    <meta name="MobileOptimized" content="320"/>
                    {/* <link rel="shortcut icon" type="image/ico" href="/images/favicon.png" /> */}
                </Head>
                <div className="pu_preloader">
                    <div className="pu_preloader_inner">
                        <p className="pu_preloader_text hide">Loading...</p>
                    </div>
                </div>
    
                <Alert />
                <div className="pu_main_wrapper">
                    {isAuthPage ?'': 
                        <>
                            <Header />
                        </>
                    }
                    
                    <div className={!isAuthPage ? 'pu_content_wrapper' : ''}>
                        {children}
                    </div>
                </div>
                <RemovePopup />
            </>
        )

    }

}
export default Layout
