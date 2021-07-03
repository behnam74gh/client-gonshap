import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import LocalSearch from "../UI/FormElement/LocalSearch";

const ListOfCategories = ({ categories, removeCategory }) => {
  const [keyword, setKeyword] = useState("");
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);
  return (
    <div className="w-100">
      <h4 className="text-center">لیست دسته بندی ها </h4>
      <div className="local-search">
        <LocalSearch keyword={keyword} setKeyword={setKeyword} />
      </div>
      {categories.length > 0 &&
        categories.filter(searched(keyword)).map((c, i) => (
          <div className="category" key={i}>
            <span>{c.name}</span>
            <div className="icons-wrapper">
              <MdDelete
                className="text-red"
                onClick={() => removeCategory(c.slug)}
              />
              <Link to={`/admin/dashboard/category/${c.slug}`}>
                <MdEdit className="text-blue" />
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ListOfCategories;
