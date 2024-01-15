import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const LoadingAd = () => {
  const [windowInnerWidth, setWindowInnerWidth] = useState();

  useEffect(() => {
    if (window.innerWidth < 450) {
      setWindowInnerWidth(window.innerWidth);
    }
  }, []);

  return (
      <Skeleton
        count={1}
        height={windowInnerWidth < 450 ? 80 : 180}
        style={{width: "100%",borderRadius: "10px"}}
      />
  );
};

export default LoadingAd;
