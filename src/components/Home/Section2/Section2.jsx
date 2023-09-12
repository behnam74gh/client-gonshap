import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import { db } from "../../../util/indexedDB";
import SingleAd from "../../UI/Ad/SingleAd";
import "./Section2.css";

const Section2 = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if(navigator.onLine){
      axios
      .get("/all-active/ads")
      .then((response) => {
        if (response.data.success) {
          const { activeAds } = response.data;
          const currentAds = activeAds.filter((ad) => ad.level === 1);
          setAds(currentAds);

          db.ads.clear()
          db.ads.bulkPut(activeAds)
        }
      })
      .catch((err) => err.response && console.log(err.response.data.message));
    }else{
      db.ads.toArray().then(items => {
        if(items.length > 0){
          const currentAds = items.filter((ad) => ad.level === 1);
          setAds(currentAds);
        }
      })
    }
    
  }, []);

  return (
    <section id="sec2">
      {ads && ads.length > 0 && (
        <React.Fragment>
          {ads[0]?.owner?.length > 0 && (
            <div
            className={
                ads?.length > 1
                    ? "advertise1"
                    : "w-100 mt-3 mb-3"
                }
            >
            <SingleAd ad={ads[0]} />
            </div>
          )}
          {ads[1]?.owner?.length > 0 && (
            <div className="advertise2">
              <SingleAd ad={ads[1]} />
            </div>
          )}
        </React.Fragment>
      )}
    </section>
  );
};

export default Section2;
