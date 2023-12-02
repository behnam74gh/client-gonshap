import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import { useSelector } from "react-redux";
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
  const [subsLoading, setSubsLoading] = useState(false);
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
  
  const {userInfo : {role, supplierFor}} = useSelector(state => state.userSignin)

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
    setSubsLoading(true)
    axios
      .get("/get-all-subcategories")
      .then((response) => {
        setSubsLoading(false)
        if(role === 2 && supplierFor){
          const newSubs = response.data.subcategories.filter((s) => s.parent === supplierFor);
          setSubcategories(newSubs);
        }else{
          setSubcategories(response.data.subcategories);
        }
      })
      .catch((err) => {
        setSubsLoading(false)
        if (err.response) {
          toast.warning(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    if(role === 1){
      loadAllCategories();
    }
    loadAllSubcategories();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/create-subcategory", {
        parent: role === 1 ? category : supplierFor,
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


  return (
    <div className="admin-panel-wrapper">
      <h4>ایجاد برچسب</h4>
      <form className="auth-form" onSubmit={submitHandler}>
        {role === 1 && <label className="auth-label" htmlFor="category">
          دسته بندی :
        </label>}
        {role === 1 && <select id="category" onChange={(e) => setCategory(e.target.value)}>
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
          validators={[
            VALIDATOR_MAXLENGTH(30),
            VALIDATOR_MINLENGTH(3),
            VALIDATOR_PERSIAN_ALPHABET(),
          ]}
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
        categories={categories}
        role={role}
        loading={subsLoading}
      />
    </div>
  );
};

export default SubCategory;
