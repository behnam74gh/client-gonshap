import React, { useState, useEffect } from "react";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";
import Input from "../../../components/UI/FormElement/Input";
import { 
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PERSIAN_ALPHABET
} from "../../../util/validators";
import { useForm } from "../../../util/hooks/formHook";
import "./SubCategory.css";

const SubCategoryUpdate = ({ history, match }) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState();
  const [subcategory, setSubcategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [formState, inputHandler] = useForm(
    {
      subcategoryName: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const {userInfo : {role, supplierFor}} = useSelector(state => state.userSignin)

  const { slug } = match.params;

  const loadAllCategories = () => {
    axios
      .get("/get-all-categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((err) => {
        if (err.response) {
          toast.warn(err.response.data.message);
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
        newSubcategoryName: formState.inputs.subcategoryName.value,
        parent: role === 1 ? category : supplierFor,
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
        {role === 1 && <label className="auth-label" htmlFor="category">
          دسته بندی :
        </label>}
       {role === 1 && <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>انتخاب دسته بندی</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>}
        <label className="auth-label" htmlFor="subcategoryName">
          برچسب :
        </label>
        <Input
          id="subcategoryName"
          element="input"
          type="text"
          placeholder="مثال: یخچال"
          onInput={inputHandler}
          defaultValue={subcategory}
          validators={[
            VALIDATOR_MAXLENGTH(30),
            VALIDATOR_MINLENGTH(3),
            VALIDATOR_PERSIAN_ALPHABET(),
          ]}
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
