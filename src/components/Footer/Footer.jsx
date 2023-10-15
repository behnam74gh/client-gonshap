import React, { useEffect, useLayoutEffect, useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import { IoIosArrowUp } from "react-icons/io";
import { HiLocationMarker } from "react-icons/hi";
import { MdOutlinePhonelinkSetup} from 'react-icons/md'
import InstagramLogo from "../../assets/images/instalogo.png";
import TelegramLogo from "../../assets/images/telegram_PNG11.png";
import WhatsappLogo from "../../assets/images/whatsapp-logo.png";
import Nemad1 from "../../assets/images/nemad-logo-1.png";
import Nemad2 from "../../assets/images/nemad-logo-2.png";
import Nemad3 from "../../assets/images/nemad-logo-3.png";
import "./Footer.css";
import { toast } from "react-toastify";

const Footer = ({ companyInfo }) => {
  const [deferredPrompt,setDeferredPrompt] = useState(null);
  const [alreadyInstalled,setAlreadyInstalled] = useState(false);

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
          <h4>تماس با ما</h4>
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
          <span className="font-sm my-2">مارادنبال کنید در :</span>
          <div className="company_social_icons">
            <a
              href={`https://instagram.com/${instagramId}`}
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
            <a
              href={`https://telegram.com/${telegramId}`}
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
            </a>
            <a
              href={`https://whatsapp.com/${whatsupId}`}
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
            </a>
          </div>
        </div>
        <div className="nemads_wrapper">
          <h4>نمادهای اعتماد الکترونیک</h4>
          <div className="nemads">
           {signENemad?.length > 0 && <a href={`https://www.${signENemad}`} target="_blank" rel="noreferrer" title="enemad"><img src={Nemad1} alt="nemad_1" className="footer_nemad_img" /></a>}
           {signUnion?.length > 0 && <a href={`https://www.${signUnion}`} target="_blank" rel="noreferrer" title="union"><img src={Nemad2} alt="nemad_2" className="footer_nemad_img" /></a>}
           {signMedia?.length > 0 && <a href={`https://www.${signMedia}`} target="_blank" rel="noreferrer" title="media"><img src={Nemad3} alt="nemad_3" className="footer_nemad_img" /></a>}
          </div>
        </div>
      </section>

      <div className="pos-rel">
        <a href="#header" className="arrow_up">
          <IoIosArrowUp />
        </a>
      </div>

      {!alreadyInstalled && <div className="pos-rel">
        <span className="install_app" onClick={installBannerHandler}>
           <MdOutlinePhonelinkSetup color="var(--firstColorPalete)" />
        </span>
      </div>}

      <div className="protection">
        <p className="font-sm">
          کلیه حقوق مادی و معنوی این سایت متعلق به
          <strong className="mx-1 text-orange">{` ${companyTitle} `}</strong> می
          باشد.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
