import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import LocalSearch from "../UI/FormElement/LocalSearch";
import { useSelector } from "react-redux";
import { VscLoading } from "react-icons/vsc";

const ListOfColors = ({ colors,loading }) => {
  const [keyword, setKeyword] = useState("");

  const { userInfo : { role } } = useSelector(state => state.userSignin);

  const searched = (keyword) => (c) => c.colorName.toLowerCase().includes(keyword);

  return (
    <div className="w-100">
      <h4 className="text-center">فهرست تمام رنگ های موجود </h4>
      <div className="local-search">
        <LocalSearch keyword={keyword} setKeyword={setKeyword} />
      </div>
      <div className="colors_wrapper">
      {loading ? (
        <div className="loader_wrapper">
          <VscLoading className="loader" />
        </div>
      ) : colors.length > 0 &&
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
              to={`/${role === 1 ? "admin" : "store-admin"}/dashboard/color-update/${c._id}`}
              className="d-flex-center-center"
            >
              <MdEdit className="text-blue font-md" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOfColors;
