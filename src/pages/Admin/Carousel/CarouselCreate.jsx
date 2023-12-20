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
import { resizeFile } from "../../../util/customFunctions";

const CarouselCreate = ({ history }) => {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [backupFor, setBackupFor] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [progressCount, setProgressCount] = useState(0);

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
      instagramId: {
        value: "",
        isValid: true,
      },
      telegramId: {
        value: "",
        isValid: true,
      },
      whatsupId: {
        value: "",
        isValid: true,
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
          toast.warning(err.response.data.message);
        }
      });
  };
  const loadAllRegions = () => {
    axios
      .get("/get-all-regions")
      .then((response) => {
        if (response.data.success) {
            setRegions(response.data.regions);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.warning(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    loadAllCategories();
    loadAllRegions()
  }, []);

  //image-picker-codes
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const pickedHandler = async (e) => {
    if(e.target.files.length + files.length > 6){
      toast.warning('بیشتر از 6 عکس نمی توانید انتخاب کنید')
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
    formData.append("instagramId", formState.inputs.instagramId.value);
    formData.append("telegramId", formState.inputs.telegramId.value);
    formData.append("whatsupId", formState.inputs.whatsupId.value);
    formData.append("description", formState.inputs.description.value);

    formData.append("region", region);
    formData.append("backupFor", backupFor);

    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .post("/supplier-store/create", formData, {
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
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err?.response?.data?.message || "اینترنت شما ضعیف است، لطفا تعداد عکس را کم کنید و مجددا تلاش فرمایید");
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
        <label className="auth-label">
          منطقه (شهر) :
        </label>
        <select onChange={(e) => setRegion(e.target.value)}>
          <option>منطقه را انتخاب کنید</option>
          {regions.length > 0 &&
            regions.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
        </select>
        <label className="auth-label" htmlFor="title">
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
        />
        <label className="auth-label" htmlFor="phoneNumber">شماره تلفن مالک :</label>
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
          ]}
        />
        <label className="auth-label">
          محصولات پشتیبانی :
        </label>
        <select onChange={(e) => setBackupFor(e.target.value)}>
          <option>دسته بندی را انتخاب کنید</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
        <label className="auth-label" htmlFor="storePhoneNumber">شماره تلفن فروشگاه :</label>
        <Input
          id="storePhoneNumber"
          element="input"
          type="text"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(11),
            VALIDATOR_CONSTANTNUMBER(),
          ]}
        />
        <label className="auth-label" htmlFor="address">آدرس فروشگاه :</label>
        <Input
          id="address"
          element="input"
          type="text"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(150),
            VALIDATOR_MINLENGTH(20),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
        />
        <label className="auth-label" htmlFor="longitude">مختصات محل فروشگاه (longitude) :</label>
        <Input
          id="longitude"
          element="input"
          type="number"
          placeholder="55.16630172729493"
          onInput={inputHandler}
          validators={[VALIDATOR_NUMBER()]}
        />
        <label className="auth-label" htmlFor="latitude">مختصات محل فروشگاه (latitude) :</label>
        <Input
          id="latitude"
          element="input"
          type="number"
          placeholder="37.253457669207286"
          onInput={inputHandler}
          validators={[VALIDATOR_NUMBER()]}
        />
        <label className="auth-label" htmlFor="instagramId">آدرس اینستاگرام :</label>
        <Input
          id="instagramId"
          element="input"
          type="text"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(70),
            VALIDATOR_MINLENGTH(4),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
        />
        <label className="auth-label" htmlFor="telegramId">آدرس تلگرام :</label>
        <Input
          id="telegramId"
          element="input"
          type="text"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(70),
            VALIDATOR_MINLENGTH(4),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
        />
        <label className="auth-label" htmlFor="whatsupId">آدرس واتساپ :</label>
        <Input
          id="whatsupId"
          element="input"
          type="text"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(70),
            VALIDATOR_MINLENGTH(4),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
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
            VALIDATOR_MINLENGTH(10),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
        />
        <Button type="submit" disabled={!formState.inputs.description.isValid || loading}>
          {!loading ? "ثبت" : <span className="d-flex-center-center" style={{gap: "0 5px"}}>% {progressCount} <VscLoading className="loader" /></span>}
        </Button>
      </form>
    </div>
  );
};

export default CarouselCreate;
