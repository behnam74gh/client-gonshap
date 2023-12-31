import React, { useEffect, useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import axios from "../../../util/axios";
import Button from "../../../components/UI/FormElement/Button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoArrowUndoCircle } from "react-icons/io5";
import Input from "../../../components/UI/FormElement/Input";
import { 
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS_2
} from "../../../util/validators";
import { useForm } from "../../../util/hooks/formHook";
import './Brands.css'
import { resizeFile } from "../../../util/customFunctions";

const BrandUpdate = ({ match, history }) => {
  const [productLoading, setProductLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [oldPhoto, setOldPhoto] = useState("");
  const [deletedPhoto, setDeletedPhoto] = useState("");
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [progressCount, setProgressCount] = useState(0);
  const [values, setValues] = useState({
    brandName: "",
    parents: [],
    backupFor: {},
  });
  const [formState, inputHandler] = useForm(
    {
      brandName: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const {userInfo: { role, supplierFor }} = useSelector(state => state.userSignin)

  const { id } = match.params;

  useEffect(() => {
    if(role === 1){
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
    }
  }, []);

  useEffect(() => {
    axios
      .get(`/read/current-brand/${id}`)
      .then((response) => {
        setProductLoading(false);
        if (response.data.success) {
          const { thisBrand, subcategories } = response.data;
          setValues({
            brandName: thisBrand.brandName,
            parents: thisBrand.parents,
            backupFor: thisBrand.backupFor,
          });
          setSubcategories(subcategories);
          thisBrand.image ? setOldPhoto(thisBrand.image) : setOldPhoto("");
          setErrorText("");
        }
      })
      .catch((err) => {
        setProductLoading(false);
        if (err.response && err.response.data.message)
          setErrorText(err.response.data.message);
      });
  }, [id]);

  //image-picker-codes
  const filePickerRef = useRef();

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = async (e) => {
    let pickedFile;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = await resizeFile(e.target.files[0]);
      if(pickedFile?.size > 500000){
        toast.warning('حجم عکس انتخاب شده بعد از تغییر اندازه توسط بازارچک، بیشتر از 500 KB است. لطفا حجم عکس را کمتر کنید');
        return;
      }

      if (oldPhoto.length > 0) {
        setDeletedPhoto(oldPhoto);
        setOldPhoto("");
      }

      setFile(pickedFile);
      setFileUrl(pickedFile);
    } else {
      return;
    }
  };
  const setFileUrl = (file) => {
    const turnedUrl = URL.createObjectURL(file);
    setUrl(turnedUrl);
    if (url) URL.revokeObjectURL(url);
  };
  //image-picker-codes

  const deleteOldImageHandler = () => {
    if (oldPhoto.length > 0) {
      setDeletedPhoto(oldPhoto);
      setOldPhoto("");
    }
  };
  const deleteNewImageHandler = () => {
    if (url.length > 0) {
      setUrl();
      setFile();
    }
  };

  const setCategoryHandler = (e) => {
    if (e === "none") {
      setValues({ ...values, backupFor: {}, parents: [] });
      return;
    }

    setValues({ ...values, backupFor: e, parents: [] });
    axios
      .get(`/category/subs/${e}`)
      .then((response) => {
        if (response.data.success) {
          setSubcategories(response.data.subcategories);
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
    const oldParents = values.parents;

    let existingParent = oldParents.find((op) => op === e);
    if (existingParent) {
      // let updatedParents = oldParents.filter((oc) => oc !== e);
      // setValues({ ...values, parents: updatedParents });
      return toast.info('از قبل انتخاب شده است');
    } else {
      setValues({ ...values, parents: [...values.parents, e] });
    }
  };

  const removeParentHandler = (e) => {
    const updatedParents = values.parents.filter((p) => p !== e);
    setValues({ ...values, parents: updatedParents });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("newBrandName", formState.inputs.brandName.value);
    formData.append("parents", values.parents);
    formData.append("backupFor", role === 1 ?  values.backupFor  : supplierFor);

    formData.append("oldPhoto", oldPhoto);
    formData.append("deletedPhoto", deletedPhoto);
    formData.append("photo", file);

    setLoading(true);
    axios
      .put(`/current-brand/update/${id}`, formData, {
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
          toast.error(err?.response?.data?.message || "اینترنت شما ضعیف است، لطفا مجددا تلاش فرمایید");
        }
      });
  };

  return (
    <div className="admin-panel-wrapper">
      {productLoading ? (
        <div className="loader_wrapper">
          <VscLoading className="loader" />
        </div>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <>
          <div className="d-flex-around mb-2">
            <h4>
              ویرایش برند با نام&nbsp;
              <strong className="text-blue mx-2">
                {values.brandName && values.brandName}
              </strong>
              را با دقت انجام دهید!
            </h4>
            <Link to={role === 1 ? "/admin/dashboard/brands" : "/store-admin/dashboard/brands"} className="create-new-slide-link">
              <span className="sidebar-text-link">بازگشت به فهرست برندها</span>
              <IoArrowUndoCircle className="font-md" />
            </Link>
          </div>
          <form
        className="auth-form edit-profile"
        encType="multipart/form-data"
        onSubmit={submitHandler}
      >
        <label className="auth-label">نام برند :</label>
        <Input
          id="brandName"
          element="input"
          type="text"
          placeholder="مثال: سامسونگ"
          onInput={inputHandler}
          defaultValue={values.brandName}
          validators={[
            VALIDATOR_MAXLENGTH(30),
            VALIDATOR_MINLENGTH(2),
            VALIDATOR_SPECIAL_CHARACTERS_2(),
          ]}
        />
        {role === 1 && <label className="auth-label" htmlFor="category">
          دسته بندی :
        </label>}
        {role === 1 && <select
          value={values.backupFor}
          id="category"
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
        <label className="auth-label" htmlFor="subcategory">
          برچسب :
        </label>

        <select
          id="subcategory"
          onChange={(e) => setParentsHandler(e.target.value)}
        >
          <option value="none">برچسب را انتخاب کنید</option>
          {subcategories.length > 0 &&
            subcategories.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
        </select>

        {values.parents?.length > 0 ? (
          <div className="image-upload__preview my-2">
            {values.parents.map((p) => (
              <span className="color_wrapper bg-purple" key={p}>
                {subcategories &&
                  subcategories.length > 0 &&
                  subcategories.find((s) => s._id === p).name}
                <span
                  className="delete_color text-dark"
                  onClick={() => removeParentHandler(p)}
                >
                  <TiDelete />
                </span>
              </span>
            ))}
          </div>
        ) : <p className="font-sm w-100 m-0 text-center">برچسبی را انتخاب نکرده اید</p>}
        <div className="image-upload-wrapper mt-3">
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
        <div className="d-flex-center-center">
          {oldPhoto ? (
            <div className="w-50 pos-rel d-flex-center-center my-1">
              <span className="delete_user_img" onClick={deleteOldImageHandler}>
                <TiDelete />
              </span>
              <img
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${oldPhoto}`}
                alt="preview"
                className="brand_img_create"
              />
            </div>
          ) : (
            url && (
              <div className="w-35 pos-rel d-flex-center-center my-1">
                <span
                  className="delete_user_img"
                  onClick={deleteNewImageHandler}
                >
                  <TiDelete />
                </span>
                <img src={url} alt="preview" className="brand_img_create" />
              </div>
            )
          )}
        </div>

        <Button
          type="submit"
          disabled={
            (!file && !oldPhoto) ||
            values.brandName.length < 2 ||
            loading ||
            !values.parents.length ||
            !values.backupFor
          }
        >
          {!loading ? "ثبت" : <span className="d-flex-center-center" style={{gap: "0 5px"}}>% {progressCount} <VscLoading className="loader" /></span>}
        </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default BrandUpdate;
