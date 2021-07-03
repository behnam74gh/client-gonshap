import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";

import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
  VALIDATOR_CONSTANTNUMBER,
  VALIDATOR_REQUIRE,
  VALIDATOR_PHONENUMBER,
  VALIDATOR_NUMBER,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import { Link } from "react-router-dom";
import { IoArrowUndoCircle } from "react-icons/io5";

const CarouselCreate = ({ history }) => {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [backupFor, setBackupFor] = useState("");
  const [loading, setLoading] = useState(false);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      phoneNumber: {
        value: "",
        isValid: false,
      },
      storePhoneNumber: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      longitude: {
        value: "",
        isValid: false,
      },
      latitude: {
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

  useEffect(() => {
    loadAllCategories();
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

  //create-product-submit
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", formState.inputs.title.value);
    formData.append(
      "storePhoneNumber",
      formState.inputs.storePhoneNumber.value
    );
    formData.append("phoneNumber", formState.inputs.phoneNumber.value);
    formData.append("address", formState.inputs.address.value);
    formData.append("longitude", formState.inputs.longitude.value);
    formData.append("latitude", formState.inputs.latitude.value);
    formData.append("description", formState.inputs.description.value);

    formData.append("backupFor", backupFor);

    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .post("/supplier-store/create", formData)
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
      <div className="d-flex-around mb-2">
        <h4 className="my-0">ایجاد فروشگاه تامین کننده محصولات</h4>
        <Link to="/admin/dashboard/carousel" className="create-new-slide-link">
          <span className="sidebar-text-link">
            بازگشت به فهرست تامین کننده ها
          </span>
          <IoArrowUndoCircle className="font-md" />
        </Link>
      </div>
      <hr />
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
          عنوان فروشگاه :
        </label>
        <Input
          id="title"
          element="input"
          type="text"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(70),
            VALIDATOR_MINLENGTH(3),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
          errorText="از علامت ها و عملگر ها استفاده نکنید، میتوانید از 3 تا 70 حرف وارد کنید!"
        />
        <label className="auth-label">شماره تلفن مالک :</label>
        <Input
          id="phoneNumber"
          element="input"
          type="text"
          placeholder="مثال: 09117025683"
          onInput={inputHandler}
          validators={[
            VALIDATOR_REQUIRE(),
            VALIDATOR_PHONENUMBER(),
            VALIDATOR_MAXLENGTH(11),
            VALIDATOR_MINLENGTH(11),
          ]}
          errorText="شماره باید با 09 شروع شود و درمجموع 11 عدد باشد!"
        />
        <label className="auth-label" htmlFor="category">
          محصولات پشتیبانی :
        </label>
        <select onChange={(e) => setBackupFor(e.target.value)}>
          <option>دسته بندی را انتخاب کنید</option>
          {categories.length > 0 &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
        <label className="auth-label">شماره تلفن فروشگاه :</label>
        <Input
          id="storePhoneNumber"
          element="input"
          type="text"
          placeholder="01733330309"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(11),
            VALIDATOR_MINLENGTH(11),
            VALIDATOR_CONSTANTNUMBER(),
          ]}
          errorText="تلفن ثابت باید با 0 شروع شود و کلا 11 رقم باشد!"
        />
        <label className="auth-label">آدرس فروشگاه :</label>
        <Input
          id="address"
          element="input"
          type="text"
          placeholder="گنبد-خیابان-پاسداران-کوچه پنجم-پلاک 18"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(150),
            VALIDATOR_MINLENGTH(20),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
          errorText="از علامت ها و عملگر ها استفاده نکنید،میتوانید از 20 تا 150 حرف وارد کنید!"
        />
        <label className="auth-label">مختصات محل فروشگاه (longitude) :</label>
        <Input
          id="longitude"
          element="input"
          type="number"
          placeholder="55.16630172729493"
          onInput={inputHandler}
          validators={[VALIDATOR_NUMBER()]}
          errorText="مختصات را از گوگل بگیرید، باید به عدد وارد شود"
        />
        <label className="auth-label">مختصات محل فروشگاه (latitude) :</label>
        <Input
          id="latitude"
          element="input"
          type="number"
          placeholder="37.253457669207286"
          onInput={inputHandler}
          validators={[VALIDATOR_NUMBER()]}
          errorText="مختصات را از گوگل بگیرید، باید به عدد وارد شود"
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          placeholder="توضیحات"
          rows={12}
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(10000),
            VALIDATOR_MINLENGTH(1000),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
          errorText="از علامت ها و عملگر ها استفاده نکنید،بین 1000 تا 10000 حرف میتوانید وارد کنید"
        />
        <Button type="submit" disabled={!formState.isValid}>
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
    </div>
  );
};

export default CarouselCreate;
