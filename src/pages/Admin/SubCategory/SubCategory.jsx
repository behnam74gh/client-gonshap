import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";

import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import {
  VALIDATOR_PERSIAN_ALPHABET,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import ListOfSubcategories from "../../../components/AdminDashboardComponents/ListOfSubcategories";
import "./SubCategory.css";

const SubCategory = () => {
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState();

  const [formState, inputHandler] = useForm(
    {
      subcategoryName: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const loadAllCategories = () => {
    axios
      .get("/get-all-categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((err) => {
        if (err.response) {
          toast.warning(err.response.data.message);
        }
      });
  };

  const loadAllSubcategories = () => {
    axios
      .get("/get-all-subcategories")
      .then((response) => {
        setSubcategories(response.data.subcategories);
      })
      .catch((err) => {
        if (err.response) {
          toast.warning(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    loadAllCategories();
    loadAllSubcategories();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/create-subcategory", {
        parent: category,
        subcategoryName: formState.inputs.subcategoryName.value,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          loadAllSubcategories();
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

  const removeSubCategoryHandler = (slug) => {
    if (window.confirm("برای حذف این برچسب مطئن هستید؟")) {
      axios
        .delete(`/subcategory/${slug}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            loadAllSubcategories();
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <h4>ایجاد برچسب</h4>
      <form className="auth-form" onSubmit={submitHandler}>
        <label className="auth-label" htmlFor="category">
          دسته بندی :
        </label>
        <select id="category" onChange={(e) => setCategory(e.target.value)}>
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
        <Input
          id="subcategoryName"
          element="input"
          type="text"
          placeholder="مثال: یخچال"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(30),
            VALIDATOR_MINLENGTH(3),
            VALIDATOR_PERSIAN_ALPHABET(),
          ]}
          errorText="از حروف فارسی استفاده کنید،فاصله بین کلمات فقط یک مورد مجاز است؛ میتوانید از 3 تا 30 حرف وارد کنید!"
        />
        <Button
          type="submit"
          disabled={!formState.inputs.subcategoryName.isValid}
        >
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
      <hr />
      <ListOfSubcategories
        subcategories={subcategories}
        removeSubCategory={removeSubCategoryHandler}
        categories={categories}
      />
    </div>
  );
};

export default SubCategory;
