import React, { useEffect, useLayoutEffect, useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import { IoIosArrowUp,IoMdAppstore } from "react-icons/io";
import { HiLocationMarker } from "react-icons/hi";
import { MdOutlinePhonelinkSetup} from 'react-icons/md'
import { useHistory } from 'react-router-dom';
import InstagramLogo from "../../assets/images/instalogo.png";
import TelegramLogo from "../../assets/images/telegram_PNG11.png";
// import WhatsappLogo from "../../assets/images/whatsapp-logo.png";
import Nemad1 from "../../assets/images/nemad-logo-1.png";
import Nemad2 from "../../assets/images/nemad-logo-2.png";
import Nemad3 from "../../assets/images/nemad-logo-3.png";
import { toast } from "react-toastify";
import "./Footer.css";

const Footer = ({ companyInfo }) => {
  const [deferredPrompt,setDeferredPrompt] = useState(null);
  const [alreadyInstalled,setAlreadyInstalled] = useState(true);
  const history = useHistory();
  
  const {
    companyTitle,
    aboutUs,
    address,
    storePhoneNumber1,
    storePhoneNumber2,
    instagramId,
    telegramId,
    whatsupId,
    signENemad,
    signMedia,
    signUnion
  } = companyInfo;
  
  useLayoutEffect(() => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      setDeferredPrompt(e)
      setAlreadyInstalled(false)
    })
  }, [])
  
  useEffect(() => {
    if(window.matchMedia('(display-mode: standalone)').matches){
      setAlreadyInstalled(true)
    }
  }, [])

  const installBannerHandler = () => {
    if(deferredPrompt !== null){
      deferredPrompt.prompt().then(result => {
        if(result.outcome === "accepted"){
          setDeferredPrompt(null)
        }
      })
    }else{
      setAlreadyInstalled(true)
      toast.info('قبلا اپلیکیشن را نصب کرده اید')
      return;
    }
  }

  return (
    <footer>
      <section id="sec_footer">
        {aboutUs?.length > 0 && <div className="about_us">
          <h4>درباره ما</h4>
          <p className="about_us_description">{aboutUs}</p>
        </div>}
        <div className="call_us">
          {window.innerWidth > 780 && <h4>تماس با ما</h4>}
          <div className="call_us_info_wrapper">
            {storePhoneNumber1 && <div className="call_us_info_box">
              <FiPhoneCall className="text-red font-md" />
              <span>{storePhoneNumber1}</span>
            </div>}
           {storePhoneNumber2 && <div className="call_us_info_box">
              <FiPhoneCall className="text-red font-md" />
              <span>{storePhoneNumber2}</span>
            </div>}
            {address?.length > 0 && <div className="call_us_info_box">
              <HiLocationMarker className="text-blue font-md" />
              <span className="font-sm">{address}</span>
            </div>}
          </div>
          {(instagramId || telegramId || whatsupId) && <span className="font-sm my-2">اطلاعیه های ما را دنبال کنید در :</span>}
          {(instagramId || telegramId || whatsupId) && <div className="company_social_icons">
          <a
            href='https://www.instagram.com/bazarchak.ir?igsh=MzNlNGNkZWQ4Mg=='
            target="_blank"
            rel="noreferrer"
            className="tooltip"
          >
            <span className="tooltip_text">{`اینستاگرامِ ${companyTitle}`}</span>
            <img
              src={InstagramLogo}
              alt="instagram_id"
              className="footer_social_icon"
            />
          </a>
            {telegramId?.length > 0 && <a
              href={`https://t.me/${telegramId}`}
              target="_blank"
              rel="noreferrer"
              className="tooltip"
            >
              <span className="tooltip_text">{`تلگرامِ ${companyTitle}`}</span>
              <img
                src={TelegramLogo}
                alt="telegram_id"
                className="footer_social_icon"
              />
            </a>}
            {/* {whatsupId?.length > 0 && <a
              href={`https://web.whatsapp.com/${whatsupId}`}
              target="_blank"
              rel="noreferrer"
              className="tooltip"
            >
              <span className="tooltip_text">{`واتساپِ ${companyTitle}`}</span>
              <img
                src={WhatsappLogo}
                alt="whatsapp_id"
                className="footer_social_icon"
              />
            </a>} */}
          </div>}

          <div className="nemads_wrapper">
            <h4>نمادهای اعتماد الکترونیک</h4>
            <div className="nemads">
            {/* <a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=434070&Code=4LUbtktlssz1gwxm3ZFUt22D8YKzRDne'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=434070&Code=4LUbtktlssz1gwxm3ZFUt22D8YKzRDne' alt='' style={{cursor: "pointer"}} Code='4LUbtktlssz1gwxm3ZFUt22D8YKzRDne' /></a> */}
            <a referrerpolicy='origin' rel="noreferrer" target='_blank' href='https://trustseal.enamad.ir/?id=434070&Code=4LUbtktlssz1gwxm3ZFUt22D8YKzRDne'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=434070&Code=4LUbtktlssz1gwxm3ZFUt22D8YKzRDne' alt='' style={{cursor: "pointer"}} Code='4LUbtktlssz1gwxm3ZFUt22D8YKzRDne' /></a>
            {/* {signENemad?.length > 0 && <a href={`https://trustseal.enamad.ir/${signENemad}`} target="_blank" rel="noreferrer" title="enemad"><img src={Nemad1} alt="nemad_1" className="footer_nemad_img" /></a>} */}
            {signUnion?.length > 0 && <a href={`https://www.ecunion.ir/${signUnion}`} target="_blank" rel="noreferrer" title="union"><img src={Nemad2} alt="nemad_2" className="footer_nemad_img" /></a>}
            {signMedia?.length > 0 && <a href={`https://logo.samandehi.ir/${signMedia}`} target="_blank" rel="noreferrer" title="media"><img src={Nemad3} alt="nemad_3" className="footer_nemad_img" /></a>}
            </div>
          </div>
          
        </div>
        
      </section>

      <div className="pos-rel">
        <a href="#header" className="arrow_up">
          <IoIosArrowUp />
        </a>
      </div>
      
      {window.innerWidth < 781 && !history.location.pathname.includes('/stores')
       && !history.location.pathname.includes('/dashboard/') && <div className="pos-rel">
        <span className="store_section" style={{bottom: alreadyInstalled && "20px"}} onClick={() => history.push('/stores')}>
          <IoMdAppstore  color="var(--firstColorPalete)" />
        </span>
      </div>}

      {!alreadyInstalled && !history.location.pathname.includes('/dashboard/') && <div className="pos-rel">
        <span className="install_app" onClick={installBannerHandler}>
           <MdOutlinePhonelinkSetup color="var(--firstColorPalete)" />
        </span>
      </div>}

      <div className="protection">
        <p className="font-sm">
          کلیه حقوق مادی و معنوی این سایت متعلق به
          <strong className="mx-1 text-orange">{` ${companyTitle || "بازارچک"} `}</strong> می
          باشد.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
