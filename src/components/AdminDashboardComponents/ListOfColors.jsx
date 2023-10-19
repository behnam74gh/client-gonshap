import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import LocalSearch from "../UI/FormElement/LocalSearch";

const ListOfColors = ({ colors }) => {
  const [keyword, setKeyword] = useState("");
  const searched = (keyword) => (c) =>
    c.colorName.toLowerCase().includes(keyword);
  return (
    <div className="w-100">
      <h4 className="text-center">لیست دسته بندی ها </h4>
      <div className="local-search">
        <LocalSearch keyword={keyword} setKeyword={setKeyword} />
      </div>
      {colors.length > 0 &&
        colors.filter(searched(keyword)).map((c) => (
          <div
            className="single_color_wrapper"
            style={{ background: `#${c.colorHex}` }}
            key={c._id}
          >
            <span
              className="font-sm"
              style={{
                color: `#${c.colorHex}` < "#1f101f" ? "white" : "black",
              }}
            >
              {c.colorName}
            </span>
            <Link
              to={`/admin/dashboard/color-update/${c._id}`}
              className="d-flex-center-center"
            >
              <MdEdit className="text-blue font-md" />
            </Link>
          </div>
        ))}
    </div>
  );
};

export default ListOfColors;
