import React from "react";
import { useSelector } from "react-redux";
import SingleAd from "../../UI/Ad/SingleAd";
import FekeAd from "../Shared/FekeAd";
import "../Section1/Section1.css";

const Section2 = () => {
  const {loading,adsLevelOne } = useSelector(state => state.advertise)

  return (
    <section id="sec2">
      {adsLevelOne?.length > 0 ? (
        <React.Fragment>
          {adsLevelOne[0]?.owner?.length > 0 && (
            <div className="advertise1">
              <SingleAd ad={adsLevelOne[0]} />
            </div>
          )}
          {adsLevelOne[1]?.owner?.length > 0 ? (
            <div className="advertise2">
              <SingleAd ad={adsLevelOne[1]} />
            </div>
          ) : (
            <FekeAd />
          )}
        </React.Fragment>
      ) : (
        <>
          {
            [1,2].map(item => <FekeAd key={item} loading={loading} />)
          }  
        </>
      )}
    </section>
  );
};

export default Section2;
