import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import LocalSearch from "../UI/FormElement/LocalSearch";
import Pagination from "../UI/Pagination/Pagination";

const ListOfSubcategories = ({
  subcategories,
  removeSubCategory,
  categories,
  role
}) => {
  const [currentSubs, setCurrentSubs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showPagination, setShowPagination] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);

  const searchSubsByCategoryHandler = (e) => {
    if (e === "none") {
      return;
    } else if (e === "all") {
      setCurrentSubs(subcategories);
      setShowPagination(true);
    } else {
      const newSubs = subcategories.filter((s) => s.parent === e);
      setCurrentSubs(newSubs);
      setShowPagination(false);
    }
  };

  const searched = (keyword) => (s) => s.name.toLowerCase().includes(keyword);

  useEffect(() => {
    const indexOfLastSubs = page * perPage;
    const indexOfFirstSubs = indexOfLastSubs - perPage;
    let subs = subcategories.slice(indexOfFirstSubs, indexOfLastSubs);
    setCurrentSubs(subs);
  }, [page, perPage, subcategories]);

  return (
    <div className="w-100">
      <h4 className="text-center">لیست برچسب ها </h4>
      <div className="subcategory-wrapper">
        <div className="table-wrapper">
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
                  <select
                    onChange={(e) =>
                      searchSubsByCategoryHandler(e.target.value)
                    }
                  >
                    <option value="none">جستوجو براساس دسته بندی</option>
                    <option value="all">همه برچسب ها</option>
                    {categories.length > 0 &&
                      categories.map((c, i) => (
                        <option key={i} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </th>
                <th colSpan="3">
                  <LocalSearch keyword={keyword} setKeyword={setKeyword} />
                </th>
              </tr>}
              <tr
                className="heading-table"
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th className="th-titles">نام برچسب</th>
                <th className="th-titles">دسته بندی</th>
                <th className="th-titles">ویرایش</th>
                {role === 1 && <th className="th-titles">حذف</th>}
              </tr>
            </thead>
            <tbody>
              {currentSubs.length > 0 &&
                currentSubs.filter(searched(keyword)).map((s, i) => (
                  <tr key={i}>
                    <td className="font-sm">{s.name}</td>
                    <td className="font-sm">
                      {categories.find((c) => c._id === s.parent).name}
                    </td>
                    <td className="font-sm">
                      <Link
                        to={`/${role === 2 ? 'store-admin' :"admin"}/dashboard/subcategory/${s.slug}`}
                        className="d-flex-center-center"
                      >
                        <MdEdit className="text-blue font-md" />
                      </Link>
                    </td>
                    {role === 1 && <td className="font-sm">
                      <span
                        className="d-flex-center-center"
                        onClick={() => removeSubCategory(s.slug)}
                      >
                        <MdDelete className="text-red" />
                      </span>
                    </td>}
                  </tr>
                ))}
            </tbody>
          </table>
          {showPagination && subcategories.length > perPage && (
            <Pagination
              perPage={perPage}
              productsLength={subcategories.length}
              setPage={setPage}
              page={page}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListOfSubcategories;
