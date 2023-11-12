import React from "react";
import Skeleton from "react-loading-skeleton";
import "./LoadingSkeleton.css";

const LoadingSkeleton = ({NumHeight}) => {
  return (
    <div className="cart_skeleton_wrapper">
      <div className="skeleton_header_wrapper">
        <span className="cart_skeleton">
          <Skeleton count={1} height={NumHeight ? NumHeight : window.innerWidth < 450 ? 80 : 240} />
        </span>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
