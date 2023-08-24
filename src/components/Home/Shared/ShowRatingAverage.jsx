import React from "react";
import StarRating from "react-star-ratings";
import { useSelector } from "react-redux";

export const ShowRatingAverage = (p) => {
  const {isMobile} = useSelector(state => state)
  
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings;
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.map((r) => total.push(r.star));

    let totalReduced = total.reduce((a, c) => a + c, 0);

    let highest = length * 5;

    let result = (totalReduced * 5) / highest;

    return (
      <div className="d-flex-center-center">
        <span dir="ltr" className="ml-1">
          <StarRating
            rating={result}
            starRatedColor="var(--secondColorPalete)"
            starDimension={isMobile ? "14px" : "20px"}
            starSpacing={isMobile ? "0" : "2px"}
            isSelectable={false}
          />
        </span>
      </div>
    );
  }
};
