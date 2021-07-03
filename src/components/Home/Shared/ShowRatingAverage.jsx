import React from "react";
import StarRating from "react-star-ratings";

export const ShowRatingAverage = (p) => {
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
            starDimension="20px"
            starSpacing="2px"
            isSelectable={false}
          />
        </span>
      </div>
    );
  }
};
