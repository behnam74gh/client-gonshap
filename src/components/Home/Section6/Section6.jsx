import React from "react";
import SingleAd from "../../UI/Ad/SingleAd";
import FekeAd from "../Shared/FekeAd";
import LoadingAd from "../../UI/LoadingSkeleton/LoadingAd";
import { useSelector } from "react-redux";
import "./Section6.css";

const Section6 = () => {
  const {loading,adsLevelTwo } = useSelector(state => state.advertise)

  return (
    <section id="sec6">
      <div className="advertise1">
        {
          loading ? (
            <LoadingAd />
          ) : adsLevelTwo[0]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelTwo[0]} />
          ) : (
            <FekeAd />
          )
        }
      </div>
      <div className="advertise2">
        {
          loading ? (
            <LoadingAd />
          ) : adsLevelTwo[1]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelTwo[1]} />
          ) : (
            <FekeAd />
          )
        }
      </div>
      <div className="advertise3">
        {
          loading ? (
            <LoadingAd />
          ) : adsLevelTwo[2]?.owner?.length > 0 ? (
            <SingleAd ad={adsLevelTwo[2]} />
          ) : (
            <FekeAd />
          )
        }
      </div>
    </section>
  );
};

export default Section6;
