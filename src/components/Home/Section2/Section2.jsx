import React from "react";
import { useSelector } from "react-redux";
import SingleAd from "../../UI/Ad/SingleAd";
import FekeAd from "../Shared/FekeAd";
import LoadingAd from "../../UI/LoadingSkeleton/LoadingAd";
import "../Section1/Section1.css";

const Section2 = () => {
  const {loading,adsLevelOne } = useSelector(state => state.advertise)

  return (
    <section id="sec2">
      {loading ? (
        <>
          <LoadingAd />
          <LoadingAd />
        </>
      ) : adsLevelOne?.length > 0 ? (
        <>
          {adsLevelOne[0]?.owner?.length > 0 && (
            <div className="ad1">
              <SingleAd ad={adsLevelOne[0]} />
            </div>
          )}
          {adsLevelOne[1]?.owner?.length > 0 ? (
            <div className="ad2">
              <SingleAd ad={adsLevelOne[1]} />
            </div>
          ) : (
            <FekeAd />
          )}
        </>
      ) : (
        <>
          {
            [1,2].map(item => <FekeAd key={item} loading={loading} adNumberClass='ad1' />)
          }  
        </>
      )}
    </section>
  );
};

export default Section2;
