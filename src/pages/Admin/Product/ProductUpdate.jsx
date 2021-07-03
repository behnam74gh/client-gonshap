import React, { useEffect, useRef, useState } from "react";
import { IoArrowUndoCircle } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import { VscLoading } from "react-icons/vsc";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";
import "./Product.css";

const oldStates = {
  title: "",
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
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showFinallyPrice, setShowFinallyPrice] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [showBrand, setShowBrand] = useState(false);

  const { slug } = useParams();

  useEffect(() => {
    axios
      .get(`/product/${slug}`)
      .then((response) => {
        const {
          title,
          price,
          countInStock,
          attr1,
          attr2,
          attr3,
          brand,
          category,
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
            price,
            countInStock,
            attr1,
            attr2,
            attr3,
            brand,
            category,
            subcategory,
            description,
            sell,
            finallyPrice,
            discount,
          });
          finallyPrice && setShowFinallyPrice(true);
          category && setShowSub(true);
          subcategory && setShowBrand(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  }, [slug]);

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
  const loadAllColors = () => {
    axios
      .get("/get-all-colors")
      .then((response) => {
        if (response.data.success) {
          setDefColors(response.data.colors);
          setError("");
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

  const submitHandler = (e) => {
    e.preventDefault();
    const activeColors = colors;
    const finallyColors = activeColors.map((c) => c._id);

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("discount", values.discount);
    formData.append("finallyPrice", values.finallyPrice);
    formData.append("countInStock", values.countInStock);
    formData.append("attr1", values.attr1);
    formData.append("attr2", values.attr2);
    formData.append("attr3", values.attr3);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("subcategory", values.subcategory);
    formData.append("sell", values.sell);
    formData.append("brand", values.brand);

    formData.append("colors", finallyColors);
    formData.append("deletedPhotos", deletedPhotos);
    formData.append("oldPhotos", oldPhotos);

    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .put(`/product-update/${slug}`, formData)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
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
      {error.length > 0 ? (
        <h4 className="warning-message">{error}</h4>
      ) : (
        <div className="d-flex-around mb-2">
          <h4>
            ویرایش محصول با عنوان "{" "}
            <strong className="text-blue">{slug}</strong> " از دسته بندیِ{" "}
            <strong>{slug}</strong>
          </h4>
          <Link
            to="/admin/dashboard/products"
            className="create-new-slide-link"
          >
            <span className="sidebar-text-link">بازگشت به فهرست محصولات</span>
            <IoArrowUndoCircle className="font-md" />
          </Link>
        </div>
      )}
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
          {oldPhotos.length > 0 &&
            oldPhotos.map((op, i) => (
              <div className="preview_img_wrapper" key={i}>
                <span className="delete_img" onClick={() => removeOldImage(i)}>
                  <TiDelete />
                </span>
                <img
                  src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${op}`}
                  alt="preview"
                />
              </div>
            ))}
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
        <input
          name="title"
          value={values.title}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label" htmlFor="category">
          دسته بندی :
        </label>
        <select
          name="category"
          value={values.category}
          onChange={(e) => setCategoryHandler(e.target.value)}
        >
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
            name="subcategory"
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
              brands.map((b, i) => (
                <option key={i} value={b._id}>
                  {b.brandName}
                </option>
              ))}
          </select>
        )}
        <label className="auth-label"> قیمت کالا (تومان) : </label>
        <input
          name="price"
          value={values.price}
          type="number"
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
        <label className="auth-label">فروش :</label>
        <select
          name="sell"
          value={values.sell}
          onChange={(e) => changeInputHandler(e)}
        >
          <option>لطفا وضعیت فروش را مشخص کنید</option>
          <option value={true}>ارائه میشود</option>
          <option value={false}>ارائه نمیشود</option>
        </select>
        <label className="auth-label">تعداد کالا :</label>
        <input
          name="countInStock"
          value={values.countInStock}
          type="number"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">رنگ</label>
        <select value="none" onChange={(e) => setColorsHandler(e.target.value)}>
          <option value="none">لطفا رنگ ها را انتخاب کنید</option>
          {defColors.length > 0 &&
            defColors.map((dc, i) => (
              <option key={i} value={dc._id}>
                {dc.colorName}
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
        <input
          name="attr1"
          value={values.attr1}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">مشخصات-2 :</label>
        <input
          name="attr2"
          value={values.attr2}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">مشخصات-3 :</label>
        <input
          name="attr3"
          value={values.attr3}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">
          ابتدا توضیحات ؛ سپس مشخصات ( هرکدام را با (-) جدا کنید و سوال و جواب
          را با (؟) جدا کنید)
        </label>
        <textarea
          type="text"
          name="description"
          value={values.description}
          rows="16"
          onChange={(e) => changeInputHandler(e)}
        ></textarea>
        <Button type="submit">
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
    </div>
  );
};

export default ProductUpdate;
