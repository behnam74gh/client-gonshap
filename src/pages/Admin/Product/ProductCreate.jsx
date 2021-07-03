import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";

import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import {
  VALIDATOR_NUMBER,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
  VALIDATOR_SPECIAL_CHARACTERS,
  VALIDATOR_SPECIAL_CHARACTERS_2,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import "./Product.css";

const ProductCreate = () => {
  const [reRenderParent, setReRenderParent] = useState(true);
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [values, setValues] = useState({
    category: "",
    subcategory: "",
    brand: "",
    sell: null,
    discount: "none",
    finallyPrice: "",
  });
  const [showSub, setShowSub] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showFinallyPrice, setShowFinallyPrice] = useState(false);
  const [colors, setColors] = useState([]);
  const [defColors, setDefColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [brands, setBrands] = useState([]);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      countInStock: {
        value: "",
        isValid: false,
      },
      attr1: {
        value: "",
        isValid: false,
      },
      attr2: {
        value: "",
        isValid: false,
      },
      attr3: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setReRenderParent(true);
  }, [reRenderParent]);

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

  const loadAllColors = () => {
    axios
      .get("/get-all-colors")
      .then((response) => {
        if (response.data.success) {
          setDefColors(response.data.colors);
          setErrorText("");
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    loadAllCategories();
    loadAllColors();
  }, []);

  //image-picker-codes
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const pickedHandler = (e) => {
    if (e.target.files) {
      setFiles([...files, ...e.target.files]);
    }
    setFileUrls([...e.target.files]);
  };
  const setFileUrls = (files) => {
    const turnedUrls = files.map((file) => URL.createObjectURL(file));
    setUrls([...urls, ...turnedUrls]);
    if (urls.length > 0) {
      urls.forEach((url) => URL.revokeObjectURL(url));
    }
  };
  const removeImage = (index) => {
    const allUrls = [...urls];
    allUrls.splice(index, 1);
    setUrls(allUrls);

    const allFiles = [...files];
    allFiles.splice(index, 1);
    setFiles(allFiles);
  };
  //image-picker-codes

  const setColorsHandler = (e) => {
    if (e === "none") {
      return;
    }
    let oldColors = colors;
    const defaultColors = defColors;

    let existingColor = oldColors.find((oc) => oc._id === e);
    if (existingColor) {
      let newOldColors = oldColors.filter((oc) => oc._id !== e);
      setColors(newOldColors);
    } else {
      const thisColor = defaultColors.find((dc) => dc._id === e);
      setColors([...colors, thisColor]);
    }
  };

  const removeColorHandler = (e) => {
    const updatedColors = colors.filter((c) => c._id !== e);
    setColors(updatedColors);
  };

  const setCategoryHandler = (e) => {
    if (e.target.value === "none") {
      setValues({ ...values, subcategory: "" });
      setShowSub(false);
      setShowBrand(false);
      return;
    }
    setValues({ ...values, subcategory: "", category: e.target.value });
    axios
      .get(`/category/subs/${e.target.value}`)
      .then((response) => {
        if (response.data.success) {
          setSubcategories(response.data.subcategories);
          setShowBrand(false);
          setShowSub(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  };

  const setSubcategoryHandler = (e) => {
    if (e === "none") {
      setValues({ ...values, subcategory: "none", brand: "none" });
      setShowBrand(false);
      return;
    }
    axios
      .get(`/get/list-of-brands/by-parent/${e}`)
      .then((response) => {
        if (response.data.success) {
          setBrands(response.data.brands);
          setShowBrand(true);
          setValues({ ...values, subcategory: e, brand: "none" });
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  const clearFinallyPriceHandler = () => {
    setValues({ ...values, finallyPrice: "", discount: "none" });
    setShowFinallyPrice(false);
  };

  const setFinallyPrice = (e) => {
    if (e === "none") {
      setValues({ ...values, finallyPrice: "", discount: "none" });
      setShowFinallyPrice(false);
      return;
    }
    const { price } = formState.inputs;
    if (!price.value) {
      return toast.warning("ابتدا قیمت کالا را تعیین کنید!");
    }
    const rPrice = price.value;
    let finalPrice = rPrice - (rPrice * e) / 100;

    setValues({ ...values, finallyPrice: finalPrice, discount: e });
    setShowFinallyPrice(true);
  };

  //create-product-submit
  const submitHandler = (e) => {
    e.preventDefault();

    const activeColors = colors;
    const finallyColors = activeColors.map((c) => c._id);

    const formData = new FormData();

    formData.append("title", formState.inputs.title.value);
    formData.append("countInStock", formState.inputs.countInStock.value);
    formData.append("attr1", formState.inputs.attr1.value);
    formData.append("attr2", formState.inputs.attr2.value);
    formData.append("attr3", formState.inputs.attr3.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("price", formState.inputs.price.value);
    formData.append("discount", values.discount);
    formData.append("finallyPrice", values.finallyPrice);

    formData.append("category", values.category);
    formData.append("subcategory", values.subcategory);
    formData.append("sell", values.sell);
    formData.append("brand", values.brand);
    formData.append("colors", finallyColors);

    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .post("/product-create", formData)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setReRenderParent(false);
          setValues({
            category: "",
            subcategory: "",
            brand: "",
            sell: null,
            discount: "none",
            finallyPrice: "",
          });
          setUrls([]);
          setFiles([]);
          setColors([]);
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
    reRenderParent && (
      <div className="admin-panel-wrapper">
        {errorText.length > 0 && (
          <p className="warning-message my-1">{errorText}</p>
        )}
        <h4>ایجاد محصول</h4>
        <form
          className="auth-form"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <div className="image-upload-wrapper">
            <input
              ref={filePickerRef}
              type="file"
              accept=".jpg,.png,.jpeg"
              hidden
              multiple
              onChange={pickedHandler}
            />
            <div className="image-upload">
              <Button type="button" onClick={pickImageHandler}>
                انتخاب تصویر
              </Button>
            </div>
          </div>
          <div className="image-upload__preview">
            {urls &&
              urls.map((url, i) => (
                <div className="preview_img_wrapper" key={i}>
                  <span className="delete_img" onClick={() => removeImage(i)}>
                    <TiDelete />
                  </span>
                  <img src={url} alt="preview" />
                </div>
              ))}
          </div>
          <label className="auth-label" htmlFor="category">
            عنوان کالا :
          </label>
          <Input
            id="title"
            element="input"
            type="text"
            placeholder="لپتاپ ASUS"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(30),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="ازعلامتها و عملگرها استفاده نکنید,میتوانید از 3 تا 30 حرف وارد کنید!"
          />
          <label className="auth-label" htmlFor="category">
            دسته بندی :
          </label>
          <select id="category" onChange={setCategoryHandler}>
            <option value="none">دسته بندی را انتخاب کنید</option>
            {categories.length > 0 &&
              categories.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          {showSub && (
            <label className="auth-label" htmlFor="subcategory">
              برچسب :
            </label>
          )}
          {showSub && (
            <select
              id="subcategory"
              value={values.subcategory}
              onChange={(e) => setSubcategoryHandler(e.target.value)}
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
          {showBrand && (
            <label className="auth-label" htmlFor="brand">
              برند :
            </label>
          )}

          {showBrand && (
            <select
              id="brand"
              value={values.brand}
              onChange={(e) => {
                if (e.target.value === "none") {
                  setValues({ ...values, brand: "none" });
                  return;
                }
                setValues({ ...values, brand: e.target.value });
              }}
            >
              <option value="none">برند را انتخاب کنید</option>
              {brands &&
                brands.length > 0 &&
                brands.map((b, i) => (
                  <option key={i} value={b._id}>
                    {b.brandName}
                  </option>
                ))}
            </select>
          )}
          <label className="auth-label"> قیمت کالا (تومان) : </label>
          <Input
            id="price"
            element="input"
            type="number"
            placeholder="1000000 تومان"
            onInput={inputHandler}
            focusHandler={clearFinallyPriceHandler}
            validators={[
              VALIDATOR_MAXLENGTH(10),
              VALIDATOR_MINLENGTH(6),
              VALIDATOR_NUMBER(),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="فقط عدد وارد کنید. بین 6 تا 10 رقم میتوانید وارد کنید"
          />
          <label className="auth-label">میزان تخفیف :</label>
          <select
            value={values.discount}
            onChange={(e) => setFinallyPrice(e.target.value)}
          >
            <option value="none">لطفا میزان تخفیف را مشخص کنید</option>
            {[...Array(51).keys()].map((d, i) => (
              <option key={i} value={d}>
                {d}%
              </option>
            ))}
          </select>
          {showFinallyPrice && (
            <label className="auth-label"> قیمت نهایی :</label>
          )}
          {showFinallyPrice && (
            <input type="number" value={values.finallyPrice} disabled />
          )}

          <label className="auth-label">فروش :</label>
          <select
            onChange={(e) => setValues({ ...values, sell: e.target.value })}
          >
            <option>لطفا وضعیت فروش را مشخص کنید</option>
            <option value={true}>ارائه میشود</option>
            <option value={false}>ارائه نمیشود</option>
          </select>
          <label className="auth-label">تعداد کالا :</label>
          <Input
            id="countInStock"
            element="input"
            type="number"
            placeholder="25"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MIN(1),
              VALIDATOR_MAX(99),
              VALIDATOR_NUMBER(),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="تعداد کالا باید بین 1 تا 99 عدد باشد و باید به عدد وارد کنید"
          />
          <label className="auth-label">رنگ</label>
          <select
            value="none"
            onChange={(e) => setColorsHandler(e.target.value)}
          >
            <option value="none">لطفا رنگ ها را انتخاب کنید</option>
            {defColors &&
              defColors.length > 0 &&
              defColors.map((c, i) => (
                <option key={i} value={c._id}>
                  {c.colorName}
                </option>
              ))}
          </select>
          {colors && colors.length > 0 && (
            <div className="image-upload__preview">
              {colors.map((c, i) => (
                <span
                  style={{
                    color:
                      `#${c.colorHex}` < "#1f101f"
                        ? "white"
                        : "var(--firstColorPalete)",
                    background: `#${c.colorHex}`,
                  }}
                  className="color_wrapper"
                  key={i}
                >
                  <span
                    className="delete_color"
                    onClick={() => removeColorHandler(c._id)}
                  >
                    <TiDelete />
                  </span>
                  {c.colorName}
                </span>
              ))}
            </div>
          )}
          <label className="auth-label">مشخصات-1 :</label>
          <Input
            id="attr1"
            element="input"
            type="text"
            placeholder="دارای 2 سال گارانتی"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(60),
              VALIDATOR_MINLENGTH(10),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="ازعلامتها و عملگرها استفاده نکنید, میتوانید از 3 تا 60 حرف وارد کنید!"
          />
          <label className="auth-label">مشخصات-2 :</label>
          <Input
            id="attr2"
            element="input"
            type="text"
            placeholder="اندروید 10"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(60),
              VALIDATOR_MINLENGTH(10),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="ازعلامتها و عملگرها استفاده نکنید, میتوانید از 3 تا 60 حرف وارد کنید!"
          />
          <label className="auth-label">مشخصات-3 :</label>
          <Input
            id="attr3"
            element="input"
            type="text"
            placeholder="صفحه لمسی و حرارتی"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(60),
              VALIDATOR_MINLENGTH(10),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="ازعلامتها و عملگرها استفاده نکنید, میتوانید از 3 تا 60 حرف وارد کنید!"
          />
          <label className="auth-label">
            ابتدا توضیحات ؛ سپس مشخصات ( هرکدام را با (-) جدا کنید و سوال و جواب
            را با (؟) جدا کنید)
          </label>
          <Input
            id="description"
            element="textarea"
            type="text"
            placeholder="توضیحات"
            onInput={inputHandler}
            rows={16}
            validators={[
              VALIDATOR_MAXLENGTH(10000),
              VALIDATOR_MINLENGTH(50),
              VALIDATOR_SPECIAL_CHARACTERS_2(),
            ]}
            errorText="ازعلامتها و عملگرها استفاده نکنید, بین 50 تا 10000 حرف میتوانید وارد کنید"
          />
          <Button type="submit" disabled={!formState.isValid}>
            {!loading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
        </form>
      </div>
    )
  );
};

export default ProductCreate;
