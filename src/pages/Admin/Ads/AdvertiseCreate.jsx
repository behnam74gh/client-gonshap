import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
  VALIDATOR_CONSTANTNUMBER,
  VALIDATOR_PHONENUMBER,
  VALIDATOR_NUMBER,
  VALIDATOR_SPECIAL_CHARACTERS_3_LINK,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import { Link } from "react-router-dom";
import { IoArrowUndoCircle } from "react-icons/io5";
import { resizeFile } from "../../../util/customFunctions";

const AdvertiseCreate = ({ history }) => {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [level, setLevel] = useState("");
  const [advertisesStatus, setAdvertisesStatus] = useState("");
  const [showAdvertisePrice, setShowAdvertisePrice] = useState(false);
  const [advertisesCost, setAdvertisesCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState("");
  const [dates, setDates] = useState([]);
  const [progressCount, setProgressCount] = useState(0);

  const defaultLevels = [1, 2, 3, 4, 5];
  const defaultStatus = ["reserve", "active", "done", "cancel"];
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
        isValid: true,
      },
      longitude: {
        value: "",
        isValid: false,
      },
      latitude: {
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
      description: {
        value: "",
        isValid: true,
      },
      address: {
        value: "",
        isValid: true,
      },
      baseCost: {
        value: "",
        isValid: true,
      },
      linkAddress: {
        value: "",
        isValid: true,
      },
    },
    false
  );

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
        if(e.target.files[i].type.split("/")[1] !== "gif"){
          const resizedImage = await resizeFile(e.target.files[i]);
          if(resizedImage.size > 500000){
          toast.warning('حجم عکس انتخاب شده بعد از تغییر اندازه توسط بازارچک، بیشتر از 500 KB است. لطفا حجم عکس را کمتر کنید');
            return;
          }else{
            resizeddFiles.push(resizedImage);
          }
        }else{
          if(e.target.files[i].size > 3000000){
            toast.warning('حجم gif بیشتر از 1 MB است');
            return;
          }else{
            resizeddFiles.push(e.target.files[i])
          }
        };
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

  const clearFinallyPriceHandler = () => {
    setAdvertisesCost("");
    setShowAdvertisePrice(false);
    setLevel("");
  };

  const setAdvertisesCostHandler = (e) => {
    let baseCost = formState.inputs.baseCost.value;

    let totalCost = days * baseCost;

    setLevel(e);
    setAdvertisesCost(totalCost);
    setShowAdvertisePrice(true);
  };

  const setDateHandler = (value) => {
    setAdvertisesCost("");
    setShowAdvertisePrice(false);
    setLevel("");
    let dates = value.map((date) =>
      date instanceof DateObject ? date.toDate() : date
    );
    let date1 = dates[0] && dates[0].getTime();
    let date2 = dates[1] && dates[1].getTime();

    let timeDifference = date2 - date1;
    let daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    setDates(dates);
    setDays(daysDifference);
  };

  //create-product-submit
  const submitHandler = (e) => {
    e.preventDefault();

    if (dates.length > 1) {
      const formData = new FormData();

      formData.append("title", formState.inputs.title.value);
      formData.append("phoneNumber", formState.inputs.phoneNumber.value);
      formData.append(
        "storePhoneNumber",
        formState.inputs.storePhoneNumber.value
      );
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("longitude", formState.inputs.longitude.value);
      formData.append("latitude", formState.inputs.latitude.value);
      formData.append("instagramId", formState.inputs.instagramId.value);
      formData.append("telegramId", formState.inputs.telegramId.value);
      formData.append("whatsupId", formState.inputs.whatsupId.value);
      formData.append("baseCost", formState.inputs.baseCost.value);
      formData.append("linkAddress", formState.inputs.linkAddress.value);

      formData.append("level", level);
      formData.append("advertisesStatus", advertisesStatus);
      formData.append("advertisesCost", advertisesCost);

      formData.append("dateFrom", dates[0].toISOString());
      formData.append("dateTo", dates[1].toISOString());
      formData.append("days", days);

      let filesLength = files.length;

      for (let i = 0; i < filesLength; i++) {
        formData.append("photos", files[i]);
      }

      setLoading(true);
      axios
        .post("/advertise/create", formData, {
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
    } else {
      return toast.warning("تاریخ را تعیین نکرده اید!");
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="d-flex-around mb-2">
        <h4 className="my-0">جهت ایجاد تبلیغ، اطلاعات موردنیاز را وارد کنید</h4>
        <Link to="/admin/dashboard/ads" className="create-new-slide-link">
          <span className="sidebar-text-link">بازگشت به فهرست تبلیغ ها</span>
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
            accept=".jpg,.png,.jpeg,.gif"
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
          عنوان تبلیغ :<span className="need_to_fill">*</span>
        </label>
        <Input
          id="title"
          element="input"
          type="text"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(70),
            VALIDATOR_MINLENGTH(6),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
        />
        <label className="auth-label">
          شماره تلفن مالک :<span className="need_to_fill">*</span>
        </label>
        <Input
          id="phoneNumber"
          element="input"
          type="text"
          placeholder="مثال: 09117025683"
          onInput={inputHandler}
          validators={[
            VALIDATOR_PHONENUMBER(),
            VALIDATOR_MAXLENGTH(11),
            VALIDATOR_MINLENGTH(11),
          ]}
        />
        <label className="auth-label">
          {" "}
          هزینه روزانه تبلیغ (تومان) :<span className="need_to_fill">
            *
          </span>{" "}
        </label>
        <Input
          id="baseCost"
          element="input"
          type="number"
          onInput={inputHandler}
          focusHandler={clearFinallyPriceHandler}
          validators={[
            VALIDATOR_MAXLENGTH(9),
            VALIDATOR_MINLENGTH(5),
            VALIDATOR_NUMBER(),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
        />
        <label className="auth-label">
          {" "}
          مدت تبلیغ :<span className="need_to_fill">*</span>{" "}
        </label>
        <Calendar
          value={dates}
          onChange={setDateHandler}
          numberOfMonths={2}
          range
          locale="fa"
          calendar="persian"
          className="my-1"
        />
        <br />
        <label className="auth-label">
          سطح تبلیغ :<span className="need_to_fill">*</span>
        </label>
        <select
          value={level}
          onChange={(e) => setAdvertisesCostHandler(e.target.value)}
        >
          <option>سطح تبلیغ را انتخاب کنید</option>
          {defaultLevels.map((l, i) => (
            <option key={i} value={l}>
              {l}
            </option>
          ))}
        </select>
        {showAdvertisePrice && (
          <label className="auth-label">
            {" "}
            هزینه تبلیغ :<span className="need_to_fill">*</span>
          </label>
        )}
        {showAdvertisePrice && (
          <input type="number" value={advertisesCost} disabled />
        )}
        <label className="auth-label">
          وضعیت تبلیغ :<span className="need_to_fill">*</span>
        </label>
        <select onChange={(e) => setAdvertisesStatus(e.target.value)}>
          <option>وضعیت تبلیغ را انتخاب کنید</option>
          {defaultStatus.map((s, i) => (
            <option key={i} value={s}>
              {s === "reserve"
                ? "رزرو شود"
                : s === "active"
                ? "فعال شود"
                : s === "done"
                ? "اتمام تبلیغ"
                : "لغو شود"}
            </option>
          ))}
        </select>
        <label className="auth-label">آدرسِ لینک :</label>
        <Input
          id="linkAddress"
          element="input"
          type="text"
          placeholder="مثال: gonshap.com"
          onInput={inputHandler}
          validators={[VALIDATOR_SPECIAL_CHARACTERS_3_LINK()]}
        />
        <p className="warning-message">
          اگر آدرسِ لینک دارد،اطلاعات زیر را وارد نکنید؛درغیر اینصورت آدرسِ لینک
          را خالی بگذارید!
        </p>
        <label className="auth-label">شماره تلفن فروشگاه :</label>
        <Input
          id="storePhoneNumber"
          element="input"
          type="text"
          placeholder="مثال: 01717027687"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(11),
            VALIDATOR_MINLENGTH(11),
            VALIDATOR_CONSTANTNUMBER(),
          ]}
        />
        <label className="auth-label">آدرس فروشگاه :</label>
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
        <label className="auth-label">مختصات محل فروشگاه (longitude) :</label>
        <Input
          id="longitude"
          element="input"
          type="number"
          placeholder="55.16630172729493"
          onInput={inputHandler}
          validators={[VALIDATOR_NUMBER()]}
        />
        <label className="auth-label">مختصات محل فروشگاه (latitude) :</label>
        <Input
          id="latitude"
          element="input"
          type="number"
          placeholder="37.253457669207286"
          onInput={inputHandler}
          validators={[VALIDATOR_NUMBER()]}
        />
        <label className="auth-label">آدرس اینستاگرام :</label>
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
        <label className="auth-label">آدرس تلگرام :</label>
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
        <label className="auth-label">آدرس واتساپ :</label>
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
            VALIDATOR_MINLENGTH(100),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
        />
        <Button
          type="submit"
          disabled={
            loading ||
            !formState.inputs.baseCost.isValid ||
            advertisesCost.length <= 5
          }
        >
            {!loading ? "ثبت" : <span className="d-flex-center-center" style={{gap: "0 5px"}}>% {progressCount} <VscLoading className="loader" /></span>}
        </Button>
      </form>
    </div>
  );
};

export default AdvertiseCreate;
