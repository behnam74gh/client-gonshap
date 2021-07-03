import React from "react";

const LocalSearch = ({ keyword, setKeyword, onfocusHandler }) => {
  return (
    <input
      type="search"
      placeholder="جست و جو.."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value.toLowerCase())}
      onFocus={onfocusHandler}
    />
  );
};

export default LocalSearch;
