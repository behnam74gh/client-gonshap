import React, { useEffect, useState } from "react";
import { FiPhoneCall } from "react-icons/fi";
import axios from "../../../util/axios";
import { db } from "../../../util/indexedDB";
import "./Section4.css";

const Section4 = () => {
  const [companyInfo, setCompanyInfo] = useState({});

  useEffect(() => {
    db.companyInformation.toArray().then(items => {
      if(items.length > 0){
        setCompanyInfo(items[0])
      }else{
        axios.get("/read/company-info").then((response) => {
          if (response.data.success) {
            setCompanyInfo(response.data.companyInfo);
          }
        })
      }
    })
  }, []);

  return (
    <section id="call_us">
      <div className="call_us_icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="102.01"
          height="109.233"
          viewBox="0 0 102.01 109.233"
        >
          <path
            id="poshtibani24-7"
            d="M93,45.232H89.845V42.009A43.771,43.771,0,0,0,78.48,12.374a36.692,36.692,0,0,0-54.975.026A43.743,43.743,0,0,0,12.141,42.035v3.171H8.984C4.031,45.206,0,49.5,0,54.773V73.957c0,5.3,4.031,9.618,8.984,9.618h3.642a9.015,9.015,0,0,0,8.45,6.395c4.929,0,8.984-4.315,8.984-9.618V48.378c0-5.277-4.055-9.618-8.984-9.618a9.069,9.069,0,0,0-2.914.52C19.5,20.952,33.7,6.421,50.993,6.421S82.487,20.978,83.774,39.357a8.415,8.415,0,0,0-2.914-.52c-4.929,0-8.984,4.315-8.984,9.618V80.43a9.635,9.635,0,0,0,6,9.046v3.769a3.1,3.1,0,0,1-2.987,3.2H59.443a9.038,9.038,0,0,0-8.45-6.395c-4.954,0-8.984,4.289-8.984,9.618,0,5.251,4.031,9.566,8.984,9.566a9.061,9.061,0,0,0,8.45-6.395H74.887c4.954,0,8.984-4.315,8.984-9.618V89.5A9.345,9.345,0,0,0,89.31,83.68h3.715c4.954,0,8.984-4.315,8.984-9.618V54.877c0-5.277-4.031-9.618-8.984-9.618ZM12.141,77.207H8.984a3.107,3.107,0,0,1-3.011-3.223V54.8A3.1,3.1,0,0,1,8.96,51.6h3.181V77.207Zm8.984-31.974A3.088,3.088,0,0,1,24.112,48.4V80.378A3.135,3.135,0,0,1,21.126,83.6a3.132,3.132,0,0,1-3.011-3.2V48.43a3.105,3.105,0,0,1,3.011-3.223ZM50.993,102.76a3.2,3.2,0,1,1,0,.052ZM83.871,80.4a3,3,0,1,1-6-.026V48.4a3.005,3.005,0,1,1,6-.052V80.326Zm12.141-6.447a3.119,3.119,0,0,1-2.987,3.223H89.845V51.575H93a3.084,3.084,0,0,1,3.011,3.2V73.957Z"
            fill="#ffd200"
          />
        </svg>
      </div>
      <div className="call_us_desc">
        <p>اگر هنگام کارکردن با سایت سوالی برای شما پیش آمده، با ما تماس بگیرید</p>
        <p>
          برای ارتباط با مدیریت از تیکت پشتیبانی در حساب کاربری خود استفاده
          کنید
        </p>
      </div>
      <div className="call_us_phone_numbers_wrapper">
        <div className="call_us_phone_numbers">
          <strong>{companyInfo.storePhoneNumber1}</strong>
          <FiPhoneCall className="phone_icon" />
        </div>
        <div className="call_us_phone_numbers">
          <strong>{companyInfo.storePhoneNumber2}</strong>
          <FiPhoneCall className="phone_icon" />
        </div>
      </div>
    </section>
  );
};

export default Section4;
