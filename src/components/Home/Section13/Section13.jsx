import React from "react";
import SingleAd from "../../UI/Ad/SingleAd";
import FekeAd from "../Shared/FekeAd";
import LoadingAd from "../../UI/LoadingSkeleton/LoadingAd";
import { useSelector } from "react-redux";
import "./Section13.css";

const Section13 = () => {
  const {loading,adsLevelFive } = useSelector(state => state.advertise)

  return (
    <section id="sec13">
      <div className="advertise">
          {loading ? (
            <LoadingAd />
          ) :adsLevelFive[0]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelFive[0]} />
          ) : (
            <FekeAd />
          )}
      </div>
      <div className="advertise">
          {loading ? (
            <LoadingAd />
          ) :adsLevelFive[1]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelFive[1]} />
          ) : (
            <FekeAd />
          )}
      </div>
      <div className="advertise">
          {loading ? (
            <LoadingAd />
          ) :adsLevelFive[2]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelFive[2]} />
          ) : (
            <FekeAd />
          )}
      </div>
      <div className="advertise">
          {loading ? (
            <LoadingAd />
          ) :adsLevelFive[3]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelFive[3]} />
          ) : (
            <FekeAd />
          )}
      </div>
    </section>
  );
};

export default Section13;
