import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "./ProductCard.css";

const LoadingSkeletonCard = ({ count }) => {
  useEffect(() => {
    const singleSkeleton = document.querySelector(".single_skeleton");
    const wrapper = singleSkeleton.parentElement;
    if (!wrapper.classList.contains("skeleton_wrapper")) {
      wrapper.classList.add("skeleton_wrapper");
    }
  }, []);

  return <Skeleton count={count} className="single_skeleton" />;
};

export default LoadingSkeletonCard;
