import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";

import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";
import "./Category.css";

const CategoryUpdate = ({ history, match }) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");

  const { slug } = match.params;

  useEffect(() => {
    axios
      .get(`/category/${slug}`)
      .then((response) => {
        if (response.data.success) {
          setCategory(response.data.category.name);
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
    let str = category.match(/^[\u0600-\u06FF\s]+$/);
    if (!str) {
      toast.warning("لطفا از حروف فارسی استفاده کنید!");
      setLoading(false);
      return;
    }
    axios
      .put(`/category/${slug}`, { newCategoryName: category })
      .then((response) => {
        if (response.data.success) {
          setLoading(false);
          toast.success(response.data.message);
          setCategory("");
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
      <h4>ویرایش دسته بندی</h4>
      <form className="auth-form" onSubmit={submitHandler}>
        <input
          type="text"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        />
        <Button type="submit" disabled={category.length === 0}>
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
    </div>
  );
};

export default CategoryUpdate;
