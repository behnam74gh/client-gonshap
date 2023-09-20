import React from "react";
import SingleAd from "../../UI/Ad/SingleAd";
import FekeAd from "../Shared/FekeAd";
import LoadingAd from "../../UI/LoadingSkeleton/LoadingAd";
import { useSelector } from "react-redux";
import "./Section11.css";

const Section11 = () => {
  const {loading,adsLevelFour } = useSelector(state => state.advertise)

  return (
    <section id="sec11">
      <div className="advertise1">
        {loading ? (
          <LoadingAd />
        ) : adsLevelFour[0]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelFour[0]} />
        ): (
          <FekeAd />
        )}
      </div>
      <div className="advertise2">
        {loading ? (
          <LoadingAd />
        ) : adsLevelFour[1]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelFour[1]} />
        ): (
          <FekeAd />
        )}
      </div>
    </section>
  );
};

export default Section11;
