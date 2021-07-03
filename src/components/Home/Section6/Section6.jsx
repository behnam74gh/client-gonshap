import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";
import "./Section6.css";

const Section6 = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios
      .get("/all-active/ads")
      .then((response) => {
        if (response.data.success) {
          const { activeAds } = response.data;
          const currentAds = activeAds.filter((ad) => ad.level === 2);
          setAds(currentAds);
        }
      })
      .catch((err) => err.response && console.log(err.response.data.message));
  }, []);

  return (
    <section id="sec6">
      {ads && ads.length > 0 && (
        <React.Fragment>
          {ads[0] && ads[0].owner && ads[0].owner.length > 0 && (
            <div
              className={
                ads[2] && ads[2].owner && ads[2].owner.length > 0
                  ? "advertise1"
                  : "w-100 mt-3 mb-3"
              }
            >
              {ads[0].linkAddress.length > 0 ? (
                <a
                  href={`https://www.${ads[0].linkAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tooltip"
                >
                  <span className="tooltip_text">{ads[0].title}</span>
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ads[0].photos[0]}`}
                    alt={ads[0].title}
                  />
                </a>
              ) : (
                <Link to={`/advertise-page/${ads[0].slug}`} className="tooltip">
                  <span className="tooltip_text">{ads[0].title}</span>
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ads[0].photos[0]}`}
                    alt={ads[0].title}
                  />
                </Link>
              )}
            </div>
          )}
          {ads[1] && ads[1].owner && ads[1].owner.length > 0 && (
            <div className="advertise2">
              {ads[1].linkAddress.length > 0 ? (
                <a
                  href={`https://www.${ads[1].linkAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tooltip"
                >
                  <span className="tooltip_text">{ads[1].title}</span>
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ads[1].photos[0]}`}
                    alt={ads[1].title}
                  />
                </a>
              ) : (
                <Link to={`/advertise-page/${ads[1].slug}`} className="tooltip">
                  <span className="tooltip_text">{ads[1].title}</span>
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ads[1].photos[0]}`}
                    alt={ads[1].title}
                  />
                </Link>
              )}
            </div>
          )}
          {ads[2] && ads[2].owner && ads[2].owner.length > 0 && (
            <div className="advertise3">
              {ads[2].linkAddress.length > 0 ? (
                <a
                  href={`www.${ads[2].linkAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tooltip"
                >
                  <span className="tooltip_text">{ads[2].title}</span>
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ads[2].photos[0]}`}
                    alt={ads[2].title}
                  />
                </a>
              ) : (
                <Link to={`/advertise-page/${ads[2].slug}`} className="tooltip">
                  <span className="tooltip_text">{ads[2].title}</span>
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ads[2].photos[0]}`}
                    alt={ads[2].title}
                  />
                </Link>
              )}
            </div>
          )}
        </React.Fragment>
      )}
    </section>
  );
};

export default Section6;
