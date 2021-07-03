import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const LoadingOrderSkeleton = ({ count }) => {
  return (
    <SkeletonTheme color="#f9f9f9" highlightColor="#efefef">
      <Skeleton count={count} height={180} style={{ margin: "15px 0" }} />
    </SkeletonTheme>
  );
};

export default LoadingOrderSkeleton;
