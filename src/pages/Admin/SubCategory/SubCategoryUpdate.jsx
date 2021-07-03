import React, { useState, useEffect } from "react";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";

import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";
import "./SubCategory.css";

const SubCategoryUpdate = ({ history, match }) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState();
  const [subcategory, setSubcategory] = useState("");
  const [categories, setCategories] = useState([]);

  const { slug } = match.params;

  const loadAllCategories = () => {
    axios
      .get("/get-all-categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    loadAllCategories();
    axios
      .get(`/subcategory/${slug}`)
      .then((response) => {
        const { success, subcategory } = response.data;
        if (success) {
          setSubcategory(subcategory.name);
          setCategory(subcategory.parent);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  }, [slug]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`/subcategory/${slug}`, {
        newSubcategoryName: subcategory,
        parent: category,
      })
      .then((response) => {
        if (response.data.success) {
          setLoading(false);
          toast.success(response.data.message);
          history.goBack();
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  return (
    <div className="admin-panel-wrapper">
      <h4>ویرایش برچسب</h4>
      <form className="auth-form" onSubmit={submitHandler}>
        <label className="auth-label" htmlFor="category">
          دسته بندی :
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>انتخاب دسته بندی</option>
          {categories.length > 0 &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
        <label className="auth-label" htmlFor="subcategoryName">
          برچسب :
        </label>
        <input
          id="subcategoryName"
          type="text"
          onChange={(e) => setSubcategory(e.target.value)}
          value={subcategory}
        />
        <Button
          type="submit"
          disabled={subcategory && subcategory.length === 0}
        >
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
    </div>
  );
};

export default SubCategoryUpdate;
