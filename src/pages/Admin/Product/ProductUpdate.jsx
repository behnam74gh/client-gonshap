import React, { useEffect, useRef, useState } from "react";
import { IoArrowUndoCircle } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import { VscLoading } from "react-icons/vsc";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";
import { useForm } from "../../../util/hooks/formHook";
import Input from "../../../components/UI/FormElement/Input";
import { VALIDATOR_MAXLENGTH, VALIDATOR_MINLENGTH, VALIDATOR_SPECIAL_CHARACTERS, VALIDATOR_SPECIAL_CHARACTERS_2 } from "../../../util/validators";
import { resizeFile } from "../../../util/customFunctions";
import "./Product.css";
import { db } from "../../../util/indexedDB";

const oldStates = {
  title: "",
  factorPrice: "",
  price: "",
  countInStock: "",
  attr1: "",
  attr2: "",
  attr3: "",
  description: "",
  category: "",
  subcategory: "",
  brand: "",
  sell: "",
  discount: "none",
  finallyPrice: "",
  hostId: "",
  details: []
};

const ProductUpdate = ({ history }) => {
  const [oldPhotos, setOldPhotos] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [values, setValues] = useState(oldStates);
  const [colors, setColors] = useState([]);
  const [defColors, setDefColors] = useState([]);
  const [colorLoading, setColorLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showFinallyPrice, setShowFinallyPrice] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [formState, inputHandler] = useForm(
    {
      title: {
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
      }
    },
    false
  );

  const { userInfo : { role } } = useSelector(state => state.userSignin);
  
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/product/${id}`)
      .then((response) => {
        setProductLoading(false);
        const {
          title,
          factorPrice,
          price,
          countInStock,
          attr1,
          attr2,
          attr3,
          details,
          brand,
          category,
          hostId,
          subcategory,
          colors,
          description,
          sell,
          finallyPrice,
          discount,
          photos,
        } = response.data.product;
        
        if (response.data.success) {
          setOldPhotos(photos);
          setColors(colors);
          setBrands(response.data.brands);
          setSubcategories(response.data.subcategories);
          setValues({
            title,
            factorPrice,
            price,
            countInStock,
            attr1,
            attr2,
            attr3,
            brand,
            category,
            subcategory,
            description,
            details,
            sell,
            finallyPrice,
            hostId,
            discount,
          });
          finallyPrice && setShowFinallyPrice(true);
          category && setShowSub(true);
          subcategory && setShowBrand(true);
        }
      })
      .catch((err) => {
        setProductLoading(false);
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  }, [id]);

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
  const loadAllColors = () => {
    setColorLoading(true);
    axios
      .get("/get-all-colors")
      .then((response) => {
        setColorLoading(false);
        if (response.data.success) {
          setDefColors(response.data.colors);
          setError("");

          db.colors.clear();
          db.colors.bulkPut(response.data.colors);
        }
      })
      .catch((err) => {
        db.colors.toArray().then(items => {
          if(items.length > 0) {
            setDefColors(items);
            setError("");
          }
        });
        setColorLoading(false);
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  };
  
  useEffect(() => {
    if(role === 1){
      loadAllCategories();
    }
    loadAllColors();
  }, [role]);

  //image-picker-codes
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const pickedHandler = async (e) => {
    if(e.target.files.length + files.length + oldPhotos.length > 5){
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
  const removeOldImage = (index) => {
    const oldImages = [...oldPhotos];
    const willDeletPhotos = [...deletedPhotos];
    willDeletPhotos.push(oldImages[index]);
    setDeletedPhotos(willDeletPhotos);
    oldImages.splice(index, 1);
    setOldPhotos(oldImages);
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
    if (e === "none") {
      setValues({ ...values, subcategory: "", category: "none" });
      setShowSub(false);
      setShowBrand(false);
      return;
    }
    setValues({ ...values, subcategory: "", category: e });
    axios
      .get(`/category/subs/${e}`)
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
    setShowBrand(false);
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
          setError(err.response.data.message);
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
    const price = values.price;
    let finalPrice = price - (price * e) / 100;

    setValues({ ...values, finallyPrice: finalPrice, discount: e });
    setShowFinallyPrice(true);
  };

  const changeInputHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const appendDetailHandler = () => {
    const newDetails = [
      ...values.details,
      {question:formState.inputs.question.value,answer: formState.inputs.answer.value}
    ]
    setValues({...values, details: newDetails})
  }

  const deleteDetailHandler = (index) => {
    const oldDetails = values.details
    const newDetails = oldDetails.filter((item,i) => i !== index)
    setValues({...values, details: newDetails})
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if(files.length+oldPhotos < 1 || colors.length < 1 || values.brand === 'none' || values.countInStock < 1 || values.countInStock > 99 || values.factorPrice < 10000 || values.price < 10000 || values.finallyPrice < 10000){
      toast.warning(
        files.length+oldPhotos < 1 ? "عکسی برای محصول انتخاب نکرده اید" : colors.length < 1 ? "رنگ انتخاب نشده است" : values.brand === 'none' ? "برند انتخاب نشده است" :
        values.countInStock < 1 ? "تعداد کالا را مشخص کنید" : values.factorPrice < 10000 ? "قیمت فاکتور کالا را چک کنید" : values.countInStock > 99 ? "تعداد کالا باید زیر 100 باشد" :
        values.price < 10000 ? "قیمت فروش  کالا در بازار را چک کنید" : values.finallyPrice < 10000 && "قیمت نهایی کالا را چک کنید"
      )
      return;
    }
    const activeColors = colors;
    const finallyColors = activeColors.map((c) => c._id);

    const formData = new FormData();

    formData.append("validHostId", role === 1 ? values.hostId : null);
    formData.append("title", formState.inputs.title.value);
    formData.append("factorPrice", values.factorPrice);
    formData.append("price", values.price);
    formData.append("discount", values.discount);
    formData.append("finallyPrice", values.finallyPrice);
    formData.append("countInStock", values.countInStock);
    formData.append("attr1", formState.inputs.attr1.value);
    formData.append("attr2", formState.inputs.attr2.value);
    formData.append("attr3", formState.inputs.attr3.value);
    formData.append("description", formState.inputs.description.value);
    formData.append("category", values.category);
    formData.append("subcategory", values.subcategory);
    formData.append("sell", values.sell);
    formData.append("brand", values.brand);
    formData.append("details", JSON.stringify(values.details))

    formData.append("colors", finallyColors);
    formData.append("deletedPhotos", deletedPhotos);
    formData.append("oldPhotos", oldPhotos);

    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .put(`/product-update/${id}`, formData, {
        onUploadProgress: function(progressEvent){
          setProgressCount(Math.round( (progressEvent.loaded * 100) / progressEvent.total ))
        }
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          history.goBack();
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
    <div className="admin-panel-wrapper">
      {productLoading ? (
        <div className="loader_wrapper">
          <VscLoading className="loader" />
        </div>
      ) : error.length > 0 ? (
        <h4 className="warning-message">{error}</h4>
      ) : values.title?.length > 0 ? (
        <>
          <div className="d-flex-around mb-2">
            <h4>
              ویرایش محصول با عنوان "{" "}
              <strong className="text-blue">{values.title}</strong> "
            </h4>
            <Link
              to={role === 1 ? "/admin/dashboard/products" : "/store-admin/dashboard/products"}
              className="create-new-slide-link"
            >
              <span className="sidebar-text-link">بازگشت به فهرست محصولات</span>
              <IoArrowUndoCircle className="font-md" />
            </Link>
          </div>
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

            {oldPhotos.length > 0 &&
              oldPhotos.map((op, i) => (
                <div className="preview_img_wrapper" key={i}>
                  <span className="delete_img" onClick={() => removeOldImage(i)}>
                    <TiDelete />
                  </span>
                  <span className="number-of-order">
                    {i+1+urls.length}
                  </span>
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${op}`}
                    alt="preview"
                  />
                </div>
              ))}
          </div>
          {role === 1 && <label className="auth-label" htmlFor="hostId">
            کد کاربری فروشنده :
          </label>}
          {role === 1 &&
            <Input
              id="hostId"
              element="input"
              type="text"
              onInput={inputHandler}
              defaultValue={values.hostId}
              disabled={true}
              validators={[
                VALIDATOR_MAXLENGTH(30),
                VALIDATOR_MINLENGTH(3),
                VALIDATOR_SPECIAL_CHARACTERS(),
              ]}
          />
          }
          <label className="auth-label" htmlFor="category">
            عنوان کالا :
          </label>
          <Input
            id="title"
            element="input"
            type="text"
            onInput={inputHandler}
            defaultValue={values.title}
            validators={[
              VALIDATOR_MAXLENGTH(30),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          {role === 1 && <label className="auth-label" htmlFor="category">
            دسته بندی :
          </label>}
          {role === 1 && <select
            name="category"
            value={values.category}
            onChange={(e) => setCategoryHandler(e.target.value)}
          >
            <option value="none">دسته بندی را انتخاب کنید</option>
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>}
          {showSub && (
            <label className="auth-label">
              برچسب :
            </label>
          )}
          {subLoading ? (
            <div className="w-100 d-flex-center-center">
              <VscLoading className="loader" />
            </div>
          ) : showSub && (
            <select
              name="subcategory"
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
            <label className="auth-label">
              برند :
            </label>
          )}
          {showBrand && (
            <select
              value={values.brand}
              name="brand"
              onChange={(e) => {
                if (e.target.value === "none") {
                  setValues({ ...values, brand: "none" });
                  return;
                }
                changeInputHandler(e);
              }}
            >
              <option value="none">برند را انتخاب کنید</option>
              {brands.length > 0 &&
                brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.brandName}
                  </option>
                ))}
            </select>
          )}
          <label className="auth-label" style={{display: "block", marginTop: "15px"}}> قیمت فاکتور کالا (تومان) : </label>
          <input
            name="factorPrice"
            value={values.factorPrice}
            type="number"
            inputMode="numeric"
            onChange={(e) => changeInputHandler(e)}
          />
          <label className="auth-label"> قیمت فروش کالا در بازار (تومان) : </label>
          <input
            name="price"
            value={values.price}
            type="number"
            inputMode="numeric"
            onFocus={clearFinallyPriceHandler}
            onChange={(e) => changeInputHandler(e)}
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
          <label className="auth-label">وضعیت فروش :</label>
          <select
            name="sell"
            value={values.sell}
            onChange={(e) => changeInputHandler(e)}
          >
            <option value={true}>ارائه میشود</option>
            <option value={false}>دیگر ارائه نمیشود</option>
          </select>
          <label className="auth-label">تعداد کالا :</label>
          <input
            name="countInStock"
            value={values.countInStock}
            type="number"
            inputMode="numeric"
            onChange={(e) => changeInputHandler(e)}
          />
          <label className="auth-label">رنگ ها</label>
          {colorLoading ? <VscLoading className="loader" /> : defColors?.length > 0 &&
          <select value="none" onChange={(e) => setColorsHandler(e.target.value)}>
            <option value="none">لطفا رنگ ها را انتخاب کنید</option>
            {defColors.length > 0 &&
              defColors.map((dc, i) => (
                <option key={i} value={dc._id}>
                  {dc.colorName}
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
            placeholder="ویژگی-1 :"
            onInput={inputHandler}
            defaultValue={values.attr1}
            validators={[
              VALIDATOR_MAXLENGTH(60),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Input
            id="attr2"
            element="input"
            type="text"
            placeholder="ویژگی-2 :"
            onInput={inputHandler}
            defaultValue={values.attr2}
            validators={[
              VALIDATOR_MAXLENGTH(60),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Input
            id="attr3"
            element="input"
            type="text"
            placeholder="ویژگی-3 :"
            onInput={inputHandler}
            defaultValue={values.attr3}
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
            defaultValue={values.description}
            rows={10}
            validators={[
              VALIDATOR_MAXLENGTH(1000),
              VALIDATOR_MINLENGTH(10),
              VALIDATOR_SPECIAL_CHARACTERS_2(),
            ]}
          />
          <label className="auth-label">مشخصات محصول :</label>
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
              onClick={appendDetailHandler}
              disabled={
                !formState.inputs.answer.isValid || !formState.inputs.question.isValid ||
                formState.inputs.answer.value.length === 0 ||
                formState.inputs.question.value.length === 0
              }
            >
              افزودن
            </Button>

            {values.details?.length > 0 && <div className="details_wrapper">
              {values.details.map((detail,i) => <div className="detail" key={i}><span>{detail.question}؟ {detail.answer}</span><span className="delete_img" onClick={() => deleteDetailHandler(i)}><TiDelete /></span></div>)}
            </div>}
          <Button type="submit" disabled={loading || !formState.inputs.description.isValid || !formState.inputs.title.isValid}>
            {!loading ? "ثبت" : <span className="d-flex-center-center" style={{gap: "0 5px"}}>% {progressCount} <VscLoading className="loader" /></span>}
          </Button>
          </form>
        </>
      ) : (
        <p className="warning-message">اطلاعات محصول دریافت نشد.. لطفا صفحه را رفرش کنید</p>
      )}
    </div>
  );
};

export default ProductUpdate;
