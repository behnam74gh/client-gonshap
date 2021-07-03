import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";
import "./Section11.css";

const Section11 = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios
      .get("/all-active/ads")
      .then((response) => {
        if (response.data.success) {
          const { activeAds } = response.data;
          const currentAds = activeAds.filter((ad) => ad.level === 4);
          setAds(currentAds);
        }
      })
      .catch((err) => err.response && console.log(err.response.data.message));
  }, []);

  return (
    <section id="sec11">
      {ads.length > 0 && (
        <div className="w-100">
          {ads[0].linkAddress.length > 0 ? (
            <a
              href={`https://www.${ads[0].linkAddress}`}
              target="_blank"
              rel="noreferrer"
              className="tooltip w-100"
            >
              <span className="tooltip_text">{ads[0].title}</span>
              <img
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ads[0].photos[0]}`}
                alt={ads[0].title}
                className="level_4_ads_img"
              />
            </a>
          ) : (
            <Link
              to={`/advertise-page/${ads[0].slug}`}
              className="tooltip w-100"
            >
              <span className="tooltip_text">{ads[0].title}</span>
              <img
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ads[0].photos[0]}`}
                alt={ads[0].title}
                className="level_4_ads_img"
              />
            </Link>
          )}
        </div>
      )}
    </section>
  );
};

export default Section11;
