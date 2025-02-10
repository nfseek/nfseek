import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/pages/LandingPage.module.css';
import { useRouter } from 'next/router';
import svg from '../src/helper/svg';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setPageHeading } from '../src/redux/actions/commonAction';
import Head from 'next/head';
import { common } from '../src/helper/Common';
import Cookies from 'js-cookie';

const Home = () => {
  const router = useRouter();
  const headerContainer = useRef();
  const headerNav = useRef();
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTest, setActiveTest] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();

  const [landTemp, setLandTemp] = useState([
    {id:1,img:'./images/html_template_preview/theme1.jpg'},
    {id:2,img:'./images/html_template_preview/theme2.jpg'},
    {id:3,img:'./images/html_template_preview/theme3.jpg'},
    {id:4,img:'./images/html_template_preview/theme4.jpg'},
    {id:5,img:'./images/html_template_preview/theme5.jpg'},
    {id:6,img:'./images/html_template_preview/theme6.jpg'},
    {id:7,img:'./images/html_template_preview/theme7.jpg'},
    {id:8,img:'./images/html_template_preview/theme8.jpg'},
    {id:9,img:'./images/html_template_preview/theme9.jpg'},
    {id:10,img:'./images/html_template_preview/theme10.jpg'},
    {id:11,img:'./images/html_template_preview/theme11.jpg'},
    {id:12,img:'./images/html_template_preview/theme12.jpg'},
    {id:13,img:'./images/html_template_preview/theme13.jpg'},
    {id:14,img:'./images/html_template_preview/theme14.jpg'},
    {id:15,img:'./images/html_template_preview/theme15.jpg'},
    {id:16,img:'./images/html_template_preview/theme16.jpg'},
    {id:17,img:'./images/html_template_preview/theme17.jpg'},
    {id:18,img:'./images/html_template_preview/theme18.jpg'},
    {id:19,img:'./images/html_template_preview/theme19.jpg'},
    {id:20,img:'./images/html_template_preview/theme20.jpg'},
  ]);

  const [testimonial, setTestimonial] = useState([
    {
      id:1,
      img:'./images/landing/client01.png',
      name : 'Richard Butler',
      title : 'UI/UX Designer',
      description : 'Etiam venenatis ultricies elit, nec posuere leo tempus nec. Cras vitae velit accumsan lectus dictum bibendum. Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit amet. Praesent porttitor erat tellus, eu iaculis dolor venenatis ut. Nulla ullamcorper mattis egestas. Vestibulum vulputate pulvinar mi vitae placerat.'
    },
    {
      id:2,
      img:'./images/landing/client02.png',
      name : 'Richard Butler',
      title : 'UI/UX Designer',
      description : 'Etiam venenatis ultricies elit, nec posuere leo tempus nec. Cras vitae velit accumsan lectus dictum bibendum. Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit'
    },
    {
      id:3,
      img:'./images/landing/client03.png',
      name : 'Richard Butler',
      title : 'UI/UX Designer',
      description : 'Cras vitae velit accumsan lectus dictum bibendum. Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit amet. Praesent porttitor erat tellus, eu iaculis dolor venenatis ut.'
    },
    {
      id:4,
      img:'./images/landing/client04.png',
      name : 'Richard Butler',
      title : 'UI/UX Designer',
      description : 'Etiam venenatis ultricies elit, nec posuere leo tempus nec. Cras vitae velit accumsan lectus dictum bibendum. Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit amet. '
    },
    {
      id:5,
      img:'./images/landing/client05.png',
      name : 'Richard Butler',
      title : 'UI/UX Designer',
      description : ' eu iaculis dolor venenatis ut. Nulla ullamcorper mattis egestas. Vestibulum vulputate pulvinar mi vitae placerat.'
    },
    {
      id:6,
      img:'./images/landing/client06.png',
      name : 'Richard Butler',
      title : 'UI/UX Designer',
      description : 'Nunc scelerisque molestie massa, eu pellentesque urna malesuada sit amet. Praesent porttitor erat tellus, eu iaculis dolor venenatis ut. Nulla ullamcorper mattis egestas. Vestibulum vulputate pulvinar mi vitae placerat.'
    }
  ]);

  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const templatesPerPage = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemplateIndex((prevIndex) => 
        prevIndex + templatesPerPage >= landTemp.length ? 0 : prevIndex + templatesPerPage
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [landTemp.length]);

  const handlePrevTemplates = () => {
    setCurrentTemplateIndex((prevIndex) => 
      prevIndex - templatesPerPage < 0 ? landTemp.length - templatesPerPage : prevIndex - templatesPerPage
    );
  };

  const handleNextTemplates = () => {
    setCurrentTemplateIndex((prevIndex) => 
      prevIndex + templatesPerPage >= landTemp.length ? 0 : prevIndex + templatesPerPage
    );
  };

  useEffect(() => {
    dispatch(setPageHeading({
      title: "NFSEEK - Connect And Manage All Your Social Links At One Place",
      keywords: "NFSEEK, NFSEEK, NFSEEK url, biolink, bio link, miniwebsite, mini website, social link, personal link, portfolio link, bio link generator",
      description: "Connect and manage all your social links in one place. Organize your social handles into a single tap. Get a link and work smart.",
      pageHeading: "NFSEEK - Connect And Manage All Your Social Links At One Place",
    }));
  }, [router]);

  useEffect(() => {
    let tokenCookie = Cookies.get('accessToken') ? Cookies.get('accessToken') : false;
    setIsUserLogin(!!tokenCookie);
  }, [router.query]);

  useEffect(() => {
    // Auto slide functionality
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 4);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerNav.current && !headerNav.current.contains(event.target)) {
        headerContainer.current.classList.remove(styles.openNav);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headerNav]);

  const navToggle = () => {
    headerContainer.current.classList.add(styles.openNav);
  };

  const checkPlanFeature = () => {
    common.getAPI(
      {
        method: "POST",
        url: 'auth/checkPlanFeature',
        data: {}
      },
      (resp) => {
        if (resp.status === 'success') {
          setIsEnabled(resp.data.isEnabled);
        }
      }
    );
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    el.scrollIntoView();
  };

  useEffect(() => {
    checkPlanFeature();
  }, []);

  // Desktop images (1920x600)
  const desktopImages = [
    './images/landing/slide1.jpg',
    './images/landing/slide2.jpg',
    './images/landing/slide3.jpg',
    './images/landing/slide4.jpg'
  ];

  // Mobile images (768x800)
  const mobileImages = [
    './images/landing/mobile/slide1.jpg',
    './images/landing/mobile/slide2.jpg',
    './images/landing/mobile/slide3.jpg',
    './images/landing/mobile/slide4.jpg'
  ];

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use appropriate images based on screen size
  const images = isMobile ? mobileImages : desktopImages;

  return (
    <>
      <Head>
        <title>NFSEEK - Connect And Manage All Your Social Links At One Place</title>
      </Head>
      <div className={styles.wrapper}>
        {/* header start */}
        <div className={styles.header}>
          <div className="pu_container" ref={headerContainer}>
            <div className={styles.header_inner}>
            <div className={styles.logo}>
                <Link href="/"><a>{svg.logo}</a></Link>
              </div>
              <div className={styles.nav_toggle} onClick={navToggle}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.833403 8.33236C0.612371 8.33236 0.400392 8.24456 0.244098 8.08826C0.0878049 7.93197 0 7.71999 0 7.49896V0.833403C0 0.612371 0.0878049 0.400392 0.244098 0.244098C0.400392 0.0878048 0.612371 0 0.833403 0H7.50063C7.72166 0 7.93364 0.0878048 8.08993 0.244098C8.24622 0.400392 8.33403 0.612371 8.33403 0.833403V7.49896C8.33403 7.71999 8.24622 7.93197 8.08993 8.08826C7.93364 8.24456 7.72166 8.33236 7.50063 8.33236H0.833403ZM12.501 8.33236C12.28 8.33236 12.068 8.24456 11.9117 8.08826C11.7554 7.93197 11.6676 7.71999 11.6676 7.49896V0.833403C11.6676 0.612371 11.7554 0.400392 11.9117 0.244098C12.068 0.0878048 12.28 0 12.501 0H19.1666C19.3876 0 19.5996 0.0878048 19.7559 0.244098C19.9122 0.400392 20 0.612371 20 0.833403V7.49896C20 7.71999 19.9122 7.93197 19.7559 8.08826C19.5996 8.24456 19.3876 8.33236 19.1666 8.33236H12.501ZM0.833403 20C0.612371 20 0.400392 19.9122 0.244098 19.7559C0.0878049 19.5996 0 19.3876 0 19.1666V12.4994C0 12.2783 0.0878049 12.0664 0.244098 11.9101C0.400392 11.7538 0.612371 11.666 0.833403 11.666H7.50063C7.72166 11.666 7.93364 11.7538 8.08993 11.9101C8.24622 12.0664 8.33403 12.2783 8.33403 12.4994V19.1666C8.33403 19.3876 8.24622 19.5996 8.08993 19.7559C7.93364 19.9122 7.72166 20 7.50063 20H0.833403ZM12.501 20C12.28 20 12.068 19.9122 11.9117 19.7559C11.7554 19.5996 11.6676 19.3876 11.6676 19.1666V12.4994C11.6676 12.2783 11.7554 12.0664 11.9117 11.9101C12.068 11.7538 12.28 11.666 12.501 11.666H19.1666C19.3876 11.666 19.5996 11.7538 19.7559 11.9101C19.9122 12.0664 20 12.2783 20 12.4994V19.1666C20 19.3876 19.9122 19.5996 19.7559 19.7559C19.5996 19.9122 19.3876 20 19.1666 20H12.501Z" fill="#B24838"/>
                </svg>
                <span>Menu</span>
              </div>
              <div className={styles.nav} ref={headerNav}>
                <ul>
                  <li><a onClick={() => scrollToSection("stab_home")}>Home</a></li>
                  <li><a onClick={() => scrollToSection("stab_template")}>Create Your Safety Profile</a></li>
                  <li><a onClick={() => scrollToSection("stab_howitwork")}>How It Works</a></li>
                  <li><a onClick={() => scrollToSection("stab_features")}>Features</a></li>
                  {/* {isEnabled && (
                    isUserLogin ? 
                      <li><Link href="/checkout">Pricing</Link></li>
                      :
                      <li><Link href="/pricing">Pricing</Link></li>
                  )} */}
                </ul>
              </div>
              <div className={styles.header_action}>
                {isUserLogin ? 
                  <Link href="/dashboard"><a className="pu_btn">Dashboard</a></Link>
                  : 
                  <>
                    <Link href="/auth/login"><a className={"pu_btn pu_btn_link " + styles.pu_btn_link}>Sign In</a></Link>
                    <Link href="/auth/registration"><a className="pu_btn">Sign Up</a></Link>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        {/* header end */}
        
        {/* banner start */}
        <div className={styles.banner}>
          <div className={styles.banner_container}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`${styles.banner_slide} ${isMobile ? styles.mobile_slide : ''}`}
                style={{
                  opacity: currentSlide === index ? 1 : 0,
                  zIndex: currentSlide === index ? 1 : 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                <img 
                  src={image} 
                  alt={`Banner ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* banner end */}
        
        {/* core_feature start */}
        <div className={styles.core_feature}>
          <div className="pu_container">
            <div className={styles.core_feature_content}>
              <div className={styles.core_feature_left}>
                <div className={styles.core_feature_box}>
                  <img src="./images/landing/Fe-01.png" alt="feature" />
                  <h3>Dynamic Insight</h3>
                  <p>Experience the vast access to various platforms fosters an enormous engagement.</p>
                  
                </div>
                <div className={styles.core_feature_box}>
                  <img src="./images/landing/Fe-02.png" alt="feature" />
                  <h3>Efficient approach</h3>
                  <p>Create a single link and save a bunch of hours for you and your subscribers.</p> 
                  
                </div>
              </div>
              <div className={styles.core_feature_right}>
                <div className={styles.main_heading}>
                  <h3>What are Safety Tags?</h3>
                </div>
                <p>From adrenaline junkies and rescue workers to construction professionals, cyclists of all ages, and more, our wearable Safety Tags provide peace of mind. Designed for multiple access points—on helmets, clothing, or gear—they allow first responders to quickly retrieve essential health and emergency information when every second matters.</p>
                <Link href="/auth/login"><a className="pu_btn">Order Now</a></Link>
              </div>
            </div>
          </div>
        </div>
        {/* core_feature end */}
        
        {/* templates start */}
        <div className={styles.templates} id="stab_template" style={{backgroundImage: "url('./images/landing/template-bg.jpg')"}}>
          <div className="pu_landing_templates">
            <div className="pu_container">
              <div className={styles.main_heading}>
                <h2>Choose Your Template</h2>
                <p>Choose from our collection of stunning templates.</p>
              </div>
              <div className={styles.templates_slider}>
                <button 
                  className={styles.slider_button_prev} 
                  onClick={handlePrevTemplates}
                  aria-label="Previous templates"
                >
                  ‹
                </button>
                <div className={styles.templates_container}>
                  {landTemp.slice(currentTemplateIndex, currentTemplateIndex + 4).map((template, index) => (
                    <div key={template.id} className={styles.template_item}>
                      <img src={template.img} alt={`Template ${template.id}`} />
                    </div>
                  ))}
                </div>
                <button 
                  className={styles.slider_button_next} 
                  onClick={handleNextTemplates}
                  aria-label="Next templates"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* templates end */}
        
        {/* works start */}
        <div className={styles.works} id="stab_howitwork">
          <div className="pu_container">
            <div className={styles.main_heading}>
              <h3>How it Works</h3>
              <strong>Get one link to make your followers step into your digital province.</strong>
            </div>
            <div className={styles.works_content}>
              <div className={styles.works_left}>
                <div className={styles.works_box}>
                  <div className={styles.works_box_icon}>
                    {svg.landing_temp_icon}
                  </div>
                  <div className={styles.works_box_data}>
                    <h3>Start With A Template</h3>
                    <p>Choose a template from the available 10+ designs, we provide.</p>
                  </div>
                </div>
                <div className={styles.works_box}>
                  <div className={styles.works_box_icon}>
                    {svg.landing_edit_icon}
                  </div>
                  <div className={styles.works_box_data}>
                    <h3>Customize</h3>
                    <p>Customize the template with added text and add links.</p>
                  </div>
                </div>
                <div className={styles.works_box}>
                  <div className={styles.works_box_icon}>
                    {svg.landing_share_icon}
                  </div>
                  <div className={styles.works_box_data}>
                    <h3>Copy & Program Device</h3>
                    <p>Tadda!!!!! You are ready to share the single link with your visitors and get more engagement. </p>
                  </div>
                </div>
              </div>
              <div className={styles.works_right} >
                <div className={styles.works_video}>
                    <div className={styles.video_container}>
                      
                        <iframe width="560" height="315" src="" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* works end */}
        
        {/* testimonial start */}
        <div className={styles.testimonial} style={{backgroundImage : "url('./images/landing/banner_bg.jpg')", display : "none"}}>
          <div className="pu_container">
            <div className={styles.main_heading}>
              <h3>What Our Users Say</h3>
              <strong>Pellentesque sem nunc, consequat non ullamcorper eu</strong>
            </div>
          <div className={styles.testimonial_main} style={{backgroundImage : "url('./images/landing/shapesbg.png')"}}>
            <div className={styles.testimonial_list_main}>
              <ul>
                {testimonial.map(item =>
                  <li key={item.id} onClick={() => setActiveTest(item)} className={(item.id === activeTest.id ? styles.active : '')}><img src={item.img} alt=""/></li>
                )}
              </ul>
              <div className={styles.testimonial_box_contant}>
                  <div className={styles.testimonial__box}>
                      <span className={styles.icon_testimonial}> <img src="./images/landing/Shapetestimonial.png" alt="testimonial" /></span>
                      <p className={styles.content_box_tes}>{activeTest.description}</p>
                        <img src={activeTest.img} alt="" />
                        <h3 className={styles.client_name}>{activeTest.name}</h3>
                        <p className={styles.client_info}>{activeTest.title}</p>
                  </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        {/* testimonial end */}
        
        {/* exclusive features section start */}
        
        <div className={styles.exclusive_features_wr} id="stab_features" style={{backgroundImage : "url('./images/landing/features-bg.jpg')"}}>
          <div className="pu_container">
            <div className={styles.main_heading}>
              <h3>Features</h3>
              {/* <strong>Pellentesque sem nunc, consequat non ullamcorper eu</strong> */}
            </div>
            <div className={styles.exclusive_features_main}>
              <div className={styles.features_box}>
                  <div className={styles.features_box_item}>
                      <img src="./images/landing/features_1.png" alt="icons" />
                      <h3>Log any incidents</h3>
                      <p>Share your emergency contacts and medical information with ease!</p>
                    </div>
                </div>
                <div className={styles.features_box}>
                    <div className={styles.features_box_item}>
                      <img src="./images/landing/features_2.png" alt="icons" />
                      <h3>Multiple Contacts</h3>
                      <p>Update Your Safety Profile Anytime.</p>
                    </div>
                </div>
                <div className={styles.features_box}>
                  <div className={styles.features_box_item}>
                      <img src="./images/landing/features_3.png" alt="icons" />
                      <h3>App Coming Soon</h3>
                      <p>Customize Your Own Groups Safety Tags!</p>
                    </div>
                </div>
                <div className={styles.features_box}>
                    <div className={styles.features_box_item}>
                      <img src="./images/landing/features_4.png" alt="icons" />
                      <h3>Alert Your Group</h3>
                      <p>GPS pindrop where the incident occured upon scan.</p>
                    </div>
                </div>
                <div className={styles.features_box}>
                    <div className={styles.features_box_item}>
                      <img src="./images/landing/features_5.png" alt="icons" />
                      <h3>Edit anytime</h3>
                      <p>Update your profile at any time in just seconds!</p>
                    </div>
                </div>
                <div className={styles.features_box}>
                  <div className={styles.features_box_item}>
                      <img src="./images/landing/features_6.png" alt="icons" />
                      <h3>Works anywhere a cell phone will</h3>
                      <p>Create a activity group and alert upon any incident.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        {/* exclusive features section end */}
        {/* footer section start */} 
          <div className={styles.footer__wr}>
            <div className="pu_container">
            <div className={styles.footer_main_box}>
              <div className={`${styles.footer_item} ${styles.footer_list_1}`}>
                  <div className={styles.logo_footer}>
                    {svg.logo}
                  </div>
                  <p>NFSEEK allows you to create a custom, personalized page that stores all the prominent links you wish to share with your viewers.</p>
              </div>
              <div className={`${styles.footer_item} ${styles.footer_list_2}`}>
                  <div className={styles.footer_icon}>
                  <img src='./images/landing/Shape 603.png' alt='shape'/>
                  </div>
                  <div className={styles.footer_info}>
                    <h3>Email Address</h3>
                    <p>Help@NFSeek.com</p>
                  </div>
                
              </div>
              <div className={`${styles.footer_item} ${styles.footer_list_3}`}>
              <div className={styles.footer_icon}>
                  <img src='./images/landing/Shape 600.png' alt='shape'/>
                  </div>
                  <div className={styles.footer_info}>
                    <h3>Contact No.</h3>
                    <p>-----</p>
                  </div>

              </div>
              <div className={`${styles.footer_item} ${styles.footer_list_4}`}>
              <div className={styles.footer_icon}>
                  <img src='./images/landing/Shape 602.png' alt='shape'/>
                  </div>
                  <div className={styles.footer_info}>
                    <h3>Whatsapp Chat</h3>
                    <p><span>Click Here to Chat</span></p>
                  </div>
              </div>
            </div>
            
            </div>

            <div className={styles.footer_copy__right}>
              <p>Copyright  2025 NFSEEK. All rights reserved. </p>
            </div>
          </div>
      
        {/* footer section end */} 
        
      </div>
    </>
  );
};

export default Home;
