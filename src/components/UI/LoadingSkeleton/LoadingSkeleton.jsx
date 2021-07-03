import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "./LoadingSkeleton.css";

const LoadingSkeleton = () => {
  const [windowInnerWidth, setWindowInnerWidth] = useState();

  useEffect(() => {
    if (window.innerWidth < 450) {
      setWindowInnerWidth(window.innerWidth);
    }
  }, []);

  return (
    <div className="cart_skeleton_wrapper">
      <div className="skeleton_header_wrapper">
        <span className="circle_skeleton">
          <Skeleton
            count={1}
            circle={true}
            width={windowInnerWidth < 450 ? 35 : 70}
            height={windowInnerWidth < 450 ? 35 : 70}
          />
        </span>
        <span className="row_skeleton">
          <Skeleton count={2} height={windowInnerWidth < 450 ? 14 : 20} />
        </span>
        <span className="cart_skeleton">
          <Skeleton count={1} height={windowInnerWidth < 450 ? 90 : 120} />
        </span>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
