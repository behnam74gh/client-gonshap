import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "./LoadingSuggest.css";

const LoadingSuggest = () => {
  const [windowInnerWidth, setWindowInnerWidth] = useState();

  useEffect(() => {
    if (window.innerWidth < 450) {
      setWindowInnerWidth(window.innerWidth);
    }
  }, []);

  return (
    <div className="suggest_skeleton_wrapper">
      <span className="author_skeleton">
        <Skeleton
          count={1}
          circle={true}
          width={windowInnerWidth < 450 ? 60 : 110}
          height={windowInnerWidth < 450 ? 60 : 110}
        />
      </span>
      <div className="author_name_skeleton">
        <Skeleton
          count={1}
          width={250}
          height={windowInnerWidth < 450 ? 8 : 16}
        />
      </div>

      <Skeleton
        count={3}
        height={windowInnerWidth < 450 ? 10 : 20}
        className="my-1"
      />
    </div>
  );
};

export default LoadingSuggest;
