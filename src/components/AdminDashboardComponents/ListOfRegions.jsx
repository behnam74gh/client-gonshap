import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import LocalSearch from "../UI/FormElement/LocalSearch";

const ListOfRegions = ({ regions }) => {
  const [keyword, setKeyword] = useState("");
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);
  return (
    <div className="w-100">
      <h4 className="text-center">فهرست دسته بندی ها </h4>
      <div className="local-search">
        <LocalSearch keyword={keyword} setKeyword={setKeyword} />
      </div>
      {regions.length > 0 &&
        regions.filter(searched(keyword)).map((r) => (
          <div className="category" key={r._id}>
            <span>{r.name}</span>
            <div className="icons-wrapper">
              <Link to={`/admin/dashboard/regions/${r._id}`}>
                <MdEdit className="text-blue" />
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ListOfRegions;
