import React, { useEffect } from 'react';
import Skeleton from "react-loading-skeleton";
import "./LoadingStoreCard.css";

const LoadingStoreCard = ({count}) => {
  useEffect(() => {
    const singleSkeleton = document.querySelector(".store_card_skeleton");
    const wrapper = singleSkeleton?.parentElement;
    if (wrapper && !wrapper.classList.contains("store_card_wrapper")) {
      wrapper.classList.add("store_card_wrapper");
    }
  }, []);

  return <Skeleton count={count} className="store_card_skeleton" />;
}

export default LoadingStoreCard