import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import { useSelector } from "react-redux";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS_2,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import { TiDelete } from "react-icons/ti";
import ListOfBrands from "../../../components/AdminDashboardComponents/ListOfBrands";
import "../Product/Product.css";
import "./Brands.css";

const Brands = () => {
  const [createBrand, setCreateBrand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [brands, setBrands] = useState([]);
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const [reRenderForm, setReRenderForm] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [parents, setParents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [showSub, setShowSub] = useState(false);

  const [formState, inputHandler] = useForm(
    {
      brandName: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const {userInfo: {role, supplierFor}} = useSelector(state => state.userSignin)
  
  const loadAllCategories = () => {
    axios
      .get("/get-all-categories")
      .then((response) => {
        setCategories(response.data.categories);
        setErrorText("");
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  const loadAllBrands = () => {
    axios
      .get("/get-all-brands")
      .then((response) => {
        if (response.data.success) {
          if(role === 2){
            const currentBrands = response.data.brands.filter((b) => b.backupFor._id === supplierFor);
            setBrands(currentBrands)
          }else{
            setBrands(response.data.brands);
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    if (!reRenderForm) {
      setReRenderForm(true);
    }
  }, [reRenderForm]);

  useEffect(() => {
    loadAllCategories();
    loadAllBrands();
  }, []);

  useEffect(() => {
    if(role === 2){
      setCategoryHandler(supplierFor)
    }
  },[role,supplierFor])

  //image-picker-codes
  const filePickerRef = useRef();

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (e) => {
    let pickedFile;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
    } else {
      return;
    }

    setFileUrl(e.target.files[0]);
  };
  const setFileUrl = (file) => {
    const turnedUrl = URL.createObjectURL(file);
    setUrl(turnedUrl);
    if (url) URL.revokeObjectURL(url);
  };
  //image-picker-codes

  const deleteNewImageHandler = () => {
    if (url.length > 0) {
      setUrl();
      setFile();
    }
  };

  const setCategoryHandler = (e) => {
    if (e === "none") {
      setParents([]);
      setShowSub(false);
      return;
    }
    setParents([]);
    setActiveCategory(e);
    axios
      .get(`/category/subs/${e}`)
      .then((response) => {
        if (response.data.success) {
          setSubcategories(response.data.subcategories);
          setShowSub(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  };

  const setParentsHandler = (e) => {
    if (e === "none") {
      return;
    }
    const oldParents = parents;
    let existingParent = oldParents.find((op) => op === e);
    if (existingParent) {
      let updatedParents = oldParents.filter((oc) => oc !== e);
      setParents(updatedParents);
    } else {
      setParents([...parents, e]);
    }
  };

  const removeParentHandler = (e) => {
    const updatedParents = parents.filter((p) => p !== e);
    setParents(updatedParents);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("brandName", formState.inputs.brandName.value);
    formData.append("parents",  parents);
    formData.append("backupFor",role === 1 ? activeCategory : supplierFor);

    formData.append("photo", file);

    setLoading(true);
    axios
      .post("/create-brand", formData)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          loadAllBrands();
          setReRenderForm(false);
          deleteNewImageHandler();
          setParents([]);
          setActiveCategory("none");
          setSubcategories([]);
          setShowSub(false);
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
      {errorText.length > 0 && <p className="warning-message">{errorText}</p>}
      <Button onClick={() => setCreateBrand(!createBrand)}>
        {createBrand ? "بستن فرم ایجاد برند" : "ایجاد برند"}
      </Button>
      {createBrand && (
        <React.Fragment>
          <h4 className="mt-3">برند موردنظر را ایجاد کنید!</h4>
          {reRenderForm && (
            <form
              className="auth-form"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <label className="auth-label">اسم برند :</label>
              <Input
                id="brandName"
                element="input"
                type="text"
                placeholder="مثال: سامسونگ"
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(30),
                  VALIDATOR_MINLENGTH(2),
                  VALIDATOR_SPECIAL_CHARACTERS_2(),
                ]}
                errorText="از علامت ها و عملگرها استفاده نکنید، میتوانید از 2 تا 30 حرف وارد کنید!"
              />
              {role === 1 && <label className="auth-label" htmlFor="category">
                دسته بندی :
              </label>}
              {role === 1 && <select
                value={activeCategory}
                id="category"
                onChange={(e) => setCategoryHandler(e.target.value)}
              >
                <option value="none">دسته بندی را انتخاب کنید</option>
                {categories.length > 0 &&
                  categories.map((c, i) => (
                    <option key={i} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>}
              {showSub && (
                <label className="auth-label" htmlFor="subcategory">
                  برچسب :
                </label>
              )}
              {showSub && (
                <select
                  id="subcategory"
                  multiple
                  onChange={(e) => setParentsHandler(e.target.value)}
                >
                  <option value="none">برچسب را انتخاب کنید</option>
                  {subcategories.length > 0 &&
                    subcategories.map((s, i) => (
                      <option key={i} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              )}
              {parents.length > 0 && (
                <div className="image-upload__preview">
                  {parents.map((p, i) => (
                    <span className="color_wrapper bg-purple" key={i}>
                      {subcategories.find((s) => s._id === p).name}
                      <span
                        className="delete_color text-dark"
                        onClick={() => removeParentHandler(p)}
                      >
                        <TiDelete />
                      </span>
                    </span>
                  ))}
                </div>
              )}
              <label className="auth-label">تصویر برند :</label>
              <div className="image-upload-wrapper">
                <input
                  ref={filePickerRef}
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  hidden
                  onChange={pickedHandler}
                />
                <div className="image-upload">
                  <Button type="button" onClick={pickImageHandler}>
                    انتخاب تصویر
                  </Button>
                </div>
              </div>
              <div className="d-flex-center-center pb-2">
                {url && (
                  <div className="w-35 pos-rel d-flex-center-center my-1">
                    <span
                      className="delete_ticket_img"
                      onClick={deleteNewImageHandler}
                    >
                      <TiDelete />
                    </span>
                    <img src={url} alt="preview" className="ticket-img" />
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={
                  !formState.inputs.brandName.isValid ||
                  file === undefined ||
                  !parents.length
                  // !activeCategory.length
                }
              >
                {!loading ? "ثبت" : <VscLoading className="loader" />}
              </Button>
            </form>
          )}
          <hr />
        </React.Fragment>
      )}
      <ListOfBrands brands={brands} categories={categories} role={role} />
    </div>
  );
};

export default Brands;
