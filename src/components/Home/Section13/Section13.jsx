import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import { db } from "../../../util/indexedDB";
import SingleAd from "../../UI/Ad/SingleAd";
import "./Section13.css";

const Section13 = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if(navigator.onLine){

      axios
      .get("/all-active/ads")
      .then((response) => {
        if (response.data.success) {
          const { activeAds } = response.data;
          const currentAds = activeAds.filter((ad) => ad.level === 5);
          setAds(currentAds);
        }
      })
      .catch((err) => err.response && console.log(err.response.data.message));
    }else{
      db.ads.toArray().then(items => {
        if(items.length > 0){
          const currentAds = items.filter((ad) => ad.level === 5);
          setAds(currentAds);
        }
      })
    }
  }, []);

  return (
    <section id="sec13">
      {ads && ads.length > 0 && (
        <React.Fragment>
          {ads[0]?.owner?.length > 0 && (
            <div
              className="advertise1"
              style={{
                flex: !ads[1] ? "100%" : !ads[2] ? "50%" : !ads[3] && "33%",
              }}
            >
              <SingleAd ad={ads[0]} />
            </div>
          )}
          {ads[1]?.owner?.length > 0 && (
            <div
              className="advertise2"
              style={{
                flex: !ads[2] ? "50%" : !ads[3] && "33%",
              }}
            >
              <SingleAd ad={ads[1]} />
            </div>
          )}
          {ads[2]?.owner?.length > 0 && (
            <div
              className="advertise3"
              style={{
                flex: !ads[3] && "33%",
              }}
            >
              <SingleAd ad={ads[2]} />
            </div>
          )}
          {ads[3]?.owner?.length > 0 && (
            <div className="advertise4">
              <SingleAd ad={ads[3]} />
            </div>
          )}
        </React.Fragment>
      )}
    </section>
  );
};

export default Section13;
