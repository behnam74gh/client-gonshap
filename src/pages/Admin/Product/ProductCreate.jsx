import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";
import { useSelector } from "react-redux";
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
  VALIDATOR_PHONENUMBER,
  VALIDATOR_REQUIRE,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import { resizeFile } from "../../../util/customFunctions";
import "./Product.css";

const ProductCreate = ({history}) => {
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
    details: []
  });
  const [showSub, setShowSub] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showFinallyPrice, setShowFinallyPrice] = useState(false);
  const [colors, setColors] = useState([]);
  const [defColors, setDefColors] = useState([]);
  const [colorLoading, setColorLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [brands, setBrands] = useState([]);
  const [progressCount, setProgressCount] = useState(0);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      factorPrice: {
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
      question: {
        value: "",
        isValid: false
      },
      answer: {
        value: "",
        isValid: false
      },
      hostId: {
        value: "",
        isValid: false
      },
      storeOwnerPhoneNumber: {
        value: "",
        isValid: false
      }
    },
    false
  );

  const {userInfo : {role,supplierFor}, phoneNumber} = useSelector(state => state.userSignin)
    
  useEffect(() => {
    setReRenderParent(true);
  }, [reRenderParent]);

  const currentCategorysSubsHandler = () => {
    setValues({...values,category: supplierFor})
    axios
      .get(`/category/subs/${supplierFor}`)
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
  }

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
    setColorLoading(true);
    axios
      .get("/get-all-colors")
      .then((response) => {
        setColorLoading(false);
        if (response.data.success) {
          setDefColors(response.data.colors);
          setErrorText("");
        }
      })
      .catch((err) => {
        setColorLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    if(role === 2){
      currentCategorysSubsHandler()
      loadAllColors();
    }else{
      loadAllCategories();
      loadAllColors();
    }
  }, []);

  //image-picker-codes
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
 
  const pickedHandler = async (e) => {
    if(e.target.files.length + files.length > 5){
      toast.warning('بیشتر از 5 عکس نمی توانید انتخاب کنید')
      return;
    }

    if (e.target.files.length > 0) {
      let resizeddFiles = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const resizedImage = await resizeFile(e.target.files[i]);
        if(resizedImage.size > 500000){
          toast.warning('حجم عکس انتخاب شده بعد از تغییر اندازه توسط بازارچک، بیشتر از 500 KB است. لطفا حجم عکس را کمتر کنید');
          return;
        }else{
          resizeddFiles.push(resizedImage);
        }
      }

      setFiles([...files, ...resizeddFiles]);
      setFileUrls(resizeddFiles);
    }
  };
  
  const setFileUrls = (files) => {
    const turnedUrls = files.map((file) => URL.createObjectURL(file));
    setUrls([...urls, ...turnedUrls]);
    // if (urls.length > 0) {
    //   urls.forEach((url) => URL.revokeObjectURL(url));
    // }
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
    setSubLoading(true);
    axios
      .get(`/get/list-of-brands/by-parent/${e}`)
      .then((response) => {
        setSubLoading(false);
        if (response.data.success) {
          setBrands(response.data.brands);
          setShowBrand(true);
          setValues({ ...values, subcategory: e, brand: "none" });
        }
      })
      .catch((err) => {
        setSubLoading(false);
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

  const appendDetailHandler = () => {
    const newDetails = [...values.details, {question: formState.inputs.question.value,answer: formState.inputs.answer.value}]
    setValues({...values, details: newDetails})
  }

  const deleteDetailHandler = (index) => {
    const oldDetails = values.details
    const newDetails = oldDetails.filter((item,i) => i !== index)
    setValues({...values, details: newDetails})
  }

  //create-product-submit
  const submitHandler = (e) => {
    e.preventDefault();
    if(files.length < 1 || colors.length < 1 || values.subcategory === 'none' || values.brand === 'none' || formState.inputs.countInStock.value < 1 || formState.inputs.factorPrice.value < 10000 || formState.inputs.price.value < 10000 || values.finallyPrice < 10000){
      toast.warning(
        files.length < 1 ? "عکسی برای محصول انتخاب نکرده اید" : colors.length < 1 ? "رنگ انتخاب نشده است" : values.subcategory === 'none' ? "برچسب کالا را تعیین کنید" : values.brand === 'none' ? "برند انتخاب نشده است" :
        formState.inputs.countInStock.value < 1 ? "تعداد کالا را مشخص کنید" : formState.inputs.factorPrice.value < 10000 ? "قیمت فاکتور کالا را چک کنید" :
        formState.inputs.price.value < 10000 ? "قیمت فروش  کالا در بازار را چک کنید" : values.finallyPrice < 10000 && "قیمت نهایی کالا را چک کنید"
      )
      return;
    }
    const activeColors = colors;
    const finallyColors = activeColors.map((c) => c._id);

    const formData = new FormData();

    formData.append("storeOwnerPhoneNumber", role === 1 ? formState.inputs.storeOwnerPhoneNumber.value : phoneNumber);
    formData.append("validHostId", role === 1 ? formState.inputs.hostId.value : null);
    formData.append("title", formState.inputs.title.value);
    formData.append("countInStock", formState.inputs.countInStock.value);
    formData.append("attr1", formState.inputs.attr1.value);
    formData.append("attr2", formState.inputs.attr2.value);
    formData.append("attr3", formState.inputs.attr3.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("factorPrice", formState.inputs.factorPrice.value);
    formData.append("price", formState.inputs.price.value);
    formData.append("discount", values.discount);
    formData.append("finallyPrice", values.finallyPrice);

    formData.append("category", values.category);
    formData.append("subcategory", values.subcategory);
    formData.append("sell", values.sell);
    formData.append("brand", values.brand);
    formData.append("colors", finallyColors);
    formData.append("details", JSON.stringify(values.details))
    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .post("/product-create", formData, {
        onUploadProgress: function(progressEvent){
          setProgressCount(Math.round( (progressEvent.loaded * 100) / progressEvent.total ))
        }
      })
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

          history.push('/store-admin/dashboard/products');
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response && typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err?.response?.data?.message || "اینترنت شما ضعیف است، لطفا تعداد عکس را کم کنید و مجددا تلاش فرمایید");
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
                  <span className="number-of-order">
                    {i+1}
                  </span>
                  <img src={url} alt="preview" />
                </div>
              ))}
          </div>
          {role === 1 &&
           <Input
            id="hostId"
            element="input"
            type="text"
            placeholder="کد کاربری فروشنده"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(30),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />}
          {role === 1 &&
           <Input
            id="storeOwnerPhoneNumber"
            element="input"
            type="text"
            placeholder="شماره موبایل فروشنده"
            onInput={inputHandler}
            validators={[
              VALIDATOR_REQUIRE(),
              VALIDATOR_PHONENUMBER(),
              VALIDATOR_MAXLENGTH(11),
            ]}
          />}
          <label className="auth-label" htmlFor="category">
            عنوان کالا :
          </label>
          <Input
            id="title"
            element="input"
            type="text"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(30),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          {role === 1 && <label className="auth-label" htmlFor="category">
            دسته بندی :
          </label>}
          {role === 1 && <select id="category" onChange={setCategoryHandler}>
            <option value="none">دسته بندی را انتخاب کنید</option>
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>}
          {showSub && (
            <label className="auth-label" htmlFor="subcategory">
              برچسب :
            </label>
          )}
          {subLoading ? (
            <div className="w-100 d-flex-center-center">
              <VscLoading className="loader" />
            </div>
          ) : showSub && (
            <select
              id="subcategory"
              value={values.subcategory}
              onChange={(e) => setSubcategoryHandler(e.target.value)}
            >
              <option value="none">برچسب را انتخاب کنید</option>
              {subcategories.length > 0 &&
                subcategories.map((s) => (
                  <option key={s._id} value={s._id}>
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
                  <option key={b._id} value={b._id}>
                    {b.brandName}
                  </option>
                ))}
            </select>
          )}
          <label className="auth-label"> قیمت فاکتور کالا (تومان) : </label>
          <Input
            id="factorPrice"
            element="input"
            type="number"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(10),
              VALIDATOR_MINLENGTH(5),
              VALIDATOR_NUMBER(),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <label className="auth-label"> قیمت فروش کالا در بازار (تومان) : </label>
          <Input
            id="price"
            element="input"
            type="number"
            onInput={inputHandler}
            focusHandler={clearFinallyPriceHandler}
            validators={[
              VALIDATOR_MAXLENGTH(10),
              VALIDATOR_MINLENGTH(5),
              VALIDATOR_NUMBER(),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
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
            onInput={inputHandler}
            validators={[
              VALIDATOR_MIN(1),
              VALIDATOR_MAX(99),
              VALIDATOR_NUMBER(),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <label className="auth-label">رنگ ها</label>
          {colorLoading ? <VscLoading className="loader" /> : defColors?.length > 0 && <select
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
          </select>}
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
          <Input
            id="attr1"
            element="input"
            type="text"
            placeholder="مشخصات-1 :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(60),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Input
            id="attr2"
            element="input"
            type="text"
            placeholder="مشخصات-2 :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(60),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Input
            id="attr3"
            element="input"
            type="text"
            placeholder="مشخصات-3 :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(60),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <label className="auth-label">توضیحات :</label>
          <Input
            id="description"
            element="textarea"
            type="text"
            placeholder="توضیحات"
            onInput={inputHandler}
            rows={10}
            validators={[
              VALIDATOR_MAXLENGTH(1000),
              VALIDATOR_MINLENGTH(10),
              VALIDATOR_SPECIAL_CHARACTERS_2(),
            ]}
          />
          <label className="auth-label">ویژگی های محصول :</label>
          <Input
            id="question"
            element="input"
            type="text"
            placeholder="بخش اول"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(100),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Input
            id="answer"
            element="input"
            type="text"
            placeholder="بخش دوم"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(100),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Button type="button" 
            disabled={
              !formState.inputs.answer.isValid || !formState.inputs.question.isValid ||
              formState.inputs.answer.value.length === 0 ||
              formState.inputs.question.value.length === 0
            }
            onClick={appendDetailHandler}
          >
            افزودن
          </Button>

          {values.details?.length > 0 && <div className="details_wrapper">
            {values.details.map((detail,i) => <div className="detail" key={i}><span>{detail.question}؟ {detail.answer}</span><span className="delete_img" onClick={() => deleteDetailHandler(i)}><TiDelete /></span></div>)}
          </div>}
          <Button type="submit" disabled={loading || !formState.inputs.title.isValid || values.subcategory.length < 1 || values.brand.length < 1 ||
            !formState.inputs.description.isValid ||
            (role === 1 && !formState.inputs.hostId.isValid)
            }>
            {!loading ? "ثبت" : <span className="d-flex-center-center" style={{gap: "0 5px"}}>% {progressCount} <VscLoading className="loader" /></span>}
          </Button>
        </form>
      </div>
    )
  );
};

export default ProductCreate;
