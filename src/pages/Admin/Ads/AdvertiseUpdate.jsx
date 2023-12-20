import React, { useState, useEffect, useRef } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import { TiDelete } from "react-icons/ti";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";
import { Link } from "react-router-dom";
import { IoArrowUndoCircle } from "react-icons/io5";
import { resizeFile } from "../../../util/customFunctions";

const oldStates = {
  title: "",
  owner: "",
  phoneNumber: "",
  storePhoneNumber: "",
  address: "",
  description: "",
  instagramId: "",
  telegramId: "",
  whatsupId: "",
  baseCost: "",
  linkAddress: "",
  longitude: "",
  latitude: "",
};

const AdvertiseUpdate = ({ history, match }) => {
  const [oldPhotos, setOldPhotos] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [values, setValues] = useState(oldStates);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("");
  const [advertisesStatus, setAdvertisesStatus] = useState("");
  const [showAdvertisePrice, setShowAdvertisePrice] = useState(true);
  const [advertisesCost, setAdvertisesCost] = useState("");
  const [dates, setDates] = useState([]);
  const [days, setDays] = useState("");
  const [progressCount, setProgressCount] = useState(0);

  const defaultLevels = [1, 2, 3, 4, 5];
  const defaultStatus = ["reserve", "active", "done", "cancel"];

  const { slug } = match.params;

  useEffect(() => {
    axios
      .get(`/advertise/${slug}`)
      .then((response) => {
        const {
          title,
          owner,
          phoneNumber,
          storePhoneNumber,
          address,
          longitude,
          latitude,
          description,
          instagramId,
          telegramId,
          whatsupId,
          baseCost,
          linkAddress,
          photos,
          advertisesCost,
          level,
          status,
          dateFrom,
          dateTo,
          days,
        } = response.data.thisAdvertise;
        if (response.data.success) {
          setValues({
            title,
            owner,
            phoneNumber,
            storePhoneNumber,
            address,
            longitude,
            latitude,
            description,
            instagramId,
            telegramId,
            whatsupId,
            baseCost,
            linkAddress,
          });
          const df = new Date(dateFrom);
          const dt = new Date(dateTo);
          const oldDates = [df, dt];
          let dates = oldDates.map((date) =>
            date instanceof DateObject ? date.toDate() : date
          );

          setDates(dates);

          setDays(days);
          setOldPhotos(photos);
          setAdvertisesCost(advertisesCost);
          setLevel(level);
          setAdvertisesStatus(status);
        }
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  }, [slug]);

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
        if(e.target.files[i].type.split("/")[1] !== "gif"){
          const resizedImage = await resizeFile(e.target.files[i]);
          if(resizedImage.size > 500000){
          toast.warning('حجم عکس انتخاب شده بعد از تغییر اندازه توسط بازارچک، بیشتر از 500 KB است. لطفا حجم عکس را کمتر کنید');
            return;
          }else{
            resizeddFiles.push(resizedImage);
          }
        }else{
          if(e.target.files[i].size > 1000000){
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
  const removeOldImage = (index) => {
    const oldImages = [...oldPhotos];
    const willDeletPhotos = [...deletedPhotos];
    willDeletPhotos.push(oldImages[index]);
    setDeletedPhotos(willDeletPhotos);
    oldImages.splice(index, 1);
    setOldPhotos(oldImages);
  };
  //image-picker-codes

  const clearFinallyPriceHandler = () => {
    setAdvertisesCost("");
    setShowAdvertisePrice(false);
    setLevel("");
  };

  const setAdvertisesCostHandler = (e) => {
    let baseCost = values.baseCost;

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

  const changeInputHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("linkAddress", values.linkAddress);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("storePhoneNumber", values.storePhoneNumber);
    formData.append("description", values.description);
    formData.append("address", values.address);
    formData.append("longitude", values.longitude);
    formData.append("latitude", values.latitude);
    formData.append("instagramId", values.instagramId);
    formData.append("telegramId", values.telegramId);
    formData.append("whatsupId", values.whatsupId);
    formData.append("baseCost", values.baseCost);

    formData.append("level", level);
    formData.append("advertisesStatus", advertisesStatus);
    formData.append("advertisesCost", advertisesCost);

    formData.append("dateFrom", dates[0].toISOString());
    formData.append("dateTo", dates[1].toISOString());
    formData.append("days", days);

    formData.append("deletedPhotos", deletedPhotos);
    formData.append("oldPhotos", oldPhotos);

    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .put(`/advertise/update/${slug}`, formData, {
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
      {error.length > 0 ? (
        <h4 className="warning-message">{error}</h4>
      ) : (
        <div className="d-flex-around mb-2">
          <h4 className="my-0">
            ویرایش اطلاعات تبلیغ با نام{" "}
            <strong className="text-blue">{values.title}</strong>
          </h4>
          <Link to="/admin/dashboard/ads" className="create-new-slide-link">
            <span className="sidebar-text-link">بازگشت به فهرست تبلیغ ها</span>
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
          عنوان تبلیغ :<span className="need_to_fill">*</span>
        </label>
        <input
          name="title"
          value={values.title}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">
          مالک فروشگاه :<span className="need_to_fill">*</span>
        </label>
        <input value={values.owner} type="text" disabled={true} />
        <label className="auth-label">
          شماره تلفن مالک :<span className="need_to_fill">*</span>
        </label>
        <input
          name="phoneNumber"
          value={values.phoneNumber}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">
          {" "}
          هزینه روزانه تبلیغ (تومان) :<span className="need_to_fill">
            *
          </span>{" "}
        </label>
        <input
          name="baseCost"
          value={values.baseCost}
          type="number"
          onChange={(e) => changeInputHandler(e)}
          onFocus={clearFinallyPriceHandler}
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
            <option key={i}>{l}</option>
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
        <select
          value={advertisesStatus}
          onChange={(e) => setAdvertisesStatus(e.target.value)}
        >
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
        <input
          name="linkAddress"
          value={values.linkAddress}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">شماره تلفن فروشگاه :</label>
        <input
          name="storePhoneNumber"
          value={values.storePhoneNumber}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">آدرس فروشگاه :</label>
        <input
          name="address"
          value={values.address}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">مختصات محل فروشگاه (longitude) :</label>
        <input
          name="longitude"
          value={values.longitude}
          type="number"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">مختصات محل فروشگاه (latitude) :</label>
        <input
          name="latitude"
          value={values.latitude}
          type="number"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">آدرس اینستاگرام :</label>
        <input
          name="instagramId"
          value={values.instagramId}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">آدرس تلگرام :</label>
        <input
          name="telegramId"
          value={values.telegramId}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">آدرس واتساپ :</label>
        <input
          name="whatsupId"
          value={values.whatsupId}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <textarea
          type="text"
          name="description"
          value={values.description}
          rows="12"
          onChange={(e) => changeInputHandler(e)}
        ></textarea>
        <Button type="submit" disabled={loading}>
          {!loading ? "ثبت" : <span className="d-flex-center-center" style={{gap: "0 5px"}}>% {progressCount} <VscLoading className="loader" /></span>}
        </Button>
      </form>
    </div>
  );
};

export default AdvertiseUpdate;
