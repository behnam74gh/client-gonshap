import React, { useEffect, useState } from "react";
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
import ListOfCategories from "../../../components/AdminDashboardComponents/ListOfCategories";
import "./Category.css";

const Category = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  const [formState, inputHandler] = useForm(
    {
      categoryName: {
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
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    loadAllCategories();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/create-category", {
        categoryName: formState.inputs.categoryName.value,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          loadAllCategories();
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

  const removeCategoryHandler = (slug) => {
    if (window.confirm("برای حذف این دسته بندی مطئن هستید؟")) {
      axios
        .delete(`/category/${slug}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            loadAllCategories();
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
      {error.length > 0 && <p className="warning-message">{error}</p>}
      <h4>دسته بندی ها را با کلمات فارسی بنویسید!</h4>
      <form className="auth-form" onSubmit={submitHandler}>
        <Input
          id="categoryName"
          element="input"
          type="text"
          placeholder="مثال: لوازم خانگی"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(30),
            VALIDATOR_MINLENGTH(3),
            VALIDATOR_PERSIAN_ALPHABET(),
          ]}
          errorText="از حروف فارسی استفاده کنید،فاصله بین کلمات فقط یک مورد مجاز است؛ میتوانید از 3 تا 30 حرف وارد کنید!"
        />
        <Button type="submit" disabled={!formState.inputs.categoryName.isValid}>
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
      <hr />
      <ListOfCategories
        categories={categories}
        removeCategory={removeCategoryHandler}
      />
    </div>
  );
};

export default Category;
