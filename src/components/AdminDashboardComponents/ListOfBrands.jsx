import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import LocalSearch from "../UI/FormElement/LocalSearch";
import defPic from "../../assets/images/def.jpg";
import { VscLoading } from "react-icons/vsc";

const ListOfBrands = ({ brands, categories,role,loading }) => {
  const [keywordSearch, setKeywordSearch] = useState(true);
  const [activeCategory, setActiveCategory] = useState("none");
  const [sortedBrands, setSortedBrands] = useState([]);
  const [keyword, setKeyword] = useState("");

  const searched = (keyword) => (b) =>
    b.brandName.toLowerCase().includes(keyword);

  const sortByCategoryHandler = (e) => {
    if (e === "none") {
      setKeywordSearch(true);
      return;
    }
    setKeywordSearch(false);
    setKeyword("");
    setActiveCategory(e);
    const thisSortedBrands = brands.filter((b) => b.backupFor._id === e);

    setSortedBrands(thisSortedBrands);
  };

  const changingSearchingMethodHandler = () => {
    setKeywordSearch(true);
    setActiveCategory("");
    setSortedBrands([]);
  };

  return (
    <div className="w-100 mt-3">
      <div className="table-wrapper mt-3">
        <table>
          <thead>
            {role === 1 && <tr
              className="heading-table"
              style={{
                backgroundColor: "var(--firstColorPalete)",
                color: "white",
              }}
            >
              <th>
                <span className="font-sm">لیست دسته بندی ها</span>
              </th>
              <th colSpan="2">
                <LocalSearch
                  keyword={keyword}
                  setKeyword={setKeyword}
                  onfocusHandler={changingSearchingMethodHandler}
                />
              </th>
              <th colSpan="2">
                <select
                  value={activeCategory}
                  id="category"
                  onChange={(e) => sortByCategoryHandler(e.target.value)}
                >
                  <option value="none">
                    مرتب سازیِ برند ها براساس دسته بندی
                  </option>
                  {categories.length > 0 &&
                    categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </th>
            </tr>}
            <tr
              className="heading-table"
              style={{
                backgroundColor: "var(--firstColorPalete)",
                color: "white",
              }}
            >
              <th className="th-titles">آرمِ برند</th>
              <th className="th-titles">نام</th>
              <th className="th-titles">پشتیبانی از</th>
              <th className="th-titles">برچسب ها</th>
              <th className="th-titles">ویرایش</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
              <td colSpan="5">
                <div className="loader_wrapper">
                  <VscLoading className="loader" />
                </div>
              </td>
            </tr>
            ) 
            : brands.length > 0 && keywordSearch ? (
              brands.filter(searched(keyword)).map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="d-flex-center-center">
                      <img
                        className="table-img"
                        src={
                          b.image.length > 0
                            ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${b.image}`
                            : `${defPic}`
                        }
                        alt={b.brandName}
                      />
                    </div>
                  </td>
                  <td className="font-sm">{b.brandName}</td>
                  <td className="font-sm">{b.backupFor.name}</td>
                  <td>
                    <div className="image-upload__preview">
                      {b.parents.map((p) => (
                        <span key={p._id} className="color_wrapper bg-purple">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Link
                      to={`/${role === 2 ? "store-admin" : "admin"}/dashboard/brand-update/${b._id}`}
                      className="d-flex-center-center"
                    >
                      <MdEdit className="text-blue" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : !keywordSearch && sortedBrands.length > 0 ? (
              sortedBrands.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="d-flex-center-center">
                      <img
                        className="table-img"
                        src={
                          b.image.length > 0
                            ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${b.image}`
                            : `${defPic}`
                        }
                        alt={b.brandName}
                      />
                    </div>
                  </td>
                  <td className="font-sm">{b.brandName}</td>
                  <td className="font-sm">{b.backupFor.name}</td>
                  <td>
                    <div className="image-upload__preview">
                      {b.parents.map((p) => (
                        <span key={p._id} className="color_wrapper bg-purple">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Link
                      to={`/admin/dashboard/brand-update/${b._id}`}
                      className="d-flex-center-center"
                    >
                      <MdEdit className="text-blue" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <p className="warning-message">
                    فهرست برند خالی است
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListOfBrands;
