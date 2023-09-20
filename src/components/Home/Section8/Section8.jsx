import React from "react";
import SingleAd from "../../UI/Ad/SingleAd";
import FekeAd from "../Shared/FekeAd";
import LoadingAd from "../../UI/LoadingSkeleton/LoadingAd";
import { useSelector } from "react-redux";
import "./Section8.css";

const Section8 = () => {
  const {loading,adsLevelThree } = useSelector(state => state.advertise)

  return (
    <section id="sec8">
      <div className="advertise1">
        {loading ? (
          <LoadingAd />
        ) : adsLevelThree[0]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelThree[0]} />
        ): (
          <FekeAd />
        )}
      </div>
      <div className="advertise2">
        {loading ? (
          <LoadingAd />
        ) : adsLevelThree[1]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelThree[1]} />
        ): (
          <FekeAd />
        )}
      </div>
    </section>
  );
};

export default Section8;
