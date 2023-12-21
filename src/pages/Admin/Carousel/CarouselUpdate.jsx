import React, { useEffect, useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { VscLoading } from "react-icons/vsc";
import { IoArrowUndoCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";
import { useDispatch, useSelector } from "react-redux";
import { resizeFile } from "../../../util/customFunctions";
import { CURRENT_SUPPLIER } from "../../../redux/Types/ttlDataTypes";

const oldStates = {
  region: "",
  title: "",
  storePhoneNumber: "",
  phoneNumber: "",
  address: "",
  description: "",
  backupFor: "",
  longitude: "",
  latitude: "",
  instagramId: "",
  telegramId: "",
  whatsupId: "",
  authentic: false,
};

const CarouselUpdate = ({ history, match }) => {
  const [oldPhotos, setOldPhotos] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [values, setValues] = useState(oldStates);
  const [categories, setCategories] = useState([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [progressCount, setProgressCount] = useState(0);

  const { id } = match.params;
  const { userInfo: { role } } = useSelector(state => state.userSignin);
  const dispatch = useDispatch();

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

  useEffect(() => {
    setFirstLoading(true)
    axios
      .get(`/current-supplier/${id}`)
      .then((response) => {
        const {
          region,
          title,
          storePhoneNumber,
          phoneNumber,
          address,
          longitude,
          latitude,
          description,
          instagramId,
          telegramId,
          whatsupId,
          backupFor,
          photos,
          authentic,
        } = response.data.thisSupplier;
        setFirstLoading(false)
        if (response.data.success) {
          setValues({
            region,
            title,
            storePhoneNumber,
            phoneNumber,
            address,
            longitude,
            latitude,
            instagramId,
            telegramId,
            whatsupId,
            description,
            backupFor: backupFor._id,
            authentic: Boolean(authentic),
          });
          setOldPhotos(photos);
        }
      })
      .catch((err) => {
        setFirstLoading(false)
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  }, [id]);

  //image-picker-codes
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const pickedHandler = async (e) => {
    if(e.target.files.length + files.length + oldPhotos.length > 6){
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
  const removeOldImage = (index) => {
    const oldImages = [...oldPhotos];
    const willDeletPhotos = [...deletedPhotos];
    willDeletPhotos.push(oldImages[index]);
    setDeletedPhotos(willDeletPhotos);
    oldImages.splice(index, 1);
    setOldPhotos(oldImages);
  };
  //image-picker-codes

  const changeInputHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if(files.length+oldPhotos < 1 || values.longitude < 1 || values.latitude < 1 || values.title < 3 || values.title > 70 || values.storePhoneNumber < 1 || `${values.storePhoneNumber}`.length > 11 || values.address.length < 20){
      toast.warning(
        files.length+oldPhotos < 1 ? "عکسی برای بنر فروشگاه انتخاب نکرده اید" : values.longitude < 1 ? "مختصات لوکیشن نامعتبر است" : values.latitude < 1 ? "مختصات لوکیشن نامعتبر است" : `${values.storePhoneNumber}`.length > 11 ? "شماره تلفن فروشگاه نباید بیشتر از 11 رقم باشد" :
        values.title < 3 ? "عنوان فروشگاه باید بیشتر از 2 کاراکتر باشد" : values.title > 70 ? "عنوان فروشگاه باید کمتر از 70 کاراکتر باشد" : values.storePhoneNumber < 1 ? "شماره تلفن فروشگاه نامعتبر است" : values.address.length < 20 && "نشانی فروشگاه باید بیشتر از 20 کاراکتر وارد شود"
      )
      return;
    }

    const {
      region,
      title,
      storePhoneNumber,
      backupFor,
      address,
      longitude,
      latitude,
      description,
      phoneNumber
    } = values;

    const formData = new FormData();

    formData.append("region", region);
    formData.append("title", title);
    formData.append("storePhoneNumber", storePhoneNumber);
    formData.append("phoneNumber", phoneNumber);
    formData.append("backupFor", backupFor);
    formData.append("address", address);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    formData.append("instagramId", values.instagramId);
    formData.append("telegramId", values.telegramId);
    formData.append("whatsupId", values.whatsupId);
    formData.append("authentic", values.authentic);
    formData.append("description", description);

    formData.append("deletedPhotos", deletedPhotos);
    formData.append("oldPhotos", oldPhotos);

    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .put(`/supplier/update/${id}`, formData, {
        onUploadProgress: function(progressEvent){
          setProgressCount(Math.round( (progressEvent.loaded * 100) / progressEvent.total ))
        }
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          dispatch({
            type: CURRENT_SUPPLIER,
            payload: {
              ttlTime : 0,
              data: null
            }
          });
          toast.success(response.data.message);
          if(role === 1){
            history.goBack();
          }else{
            history.push('/store-admin/dashboard/home')
          }
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

  return firstLoading ? (
    <div className="loader_wrapper">
      <VscLoading className="loader" />
    </div>
  ) : (
    <div className="admin-panel-wrapper">
      {error.length > 0 ? (
        <h4 className="warning-message">{error}</h4>
      ) : role === 1 && (
        <div className="d-flex-around mb-2">
          <h4 className="my-0">
            ویرایش اطلاعات فروشگاه{" "}
            <strong className="text-blue">{values.title}</strong>
          </h4>
          <Link
            to="/admin/dashboard/carousel"
            className="create-new-slide-link"
          >
            <span className="sidebar-text-link">
              بازگشت به فهرست تامین کننده ها
            </span>
            <IoArrowUndoCircle className="font-md" />
          </Link>
        </div>
      )}
      {role === 1 && <hr /> }  
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
        {role === 1 && <label className="auth-label">
          منطقه (شهر) :
        </label>}
        {role === 1 && <select
          name="region"
          value={values.region}
          onChange={(e) => changeInputHandler(e)}
        >
          <option>منطقه را انتخاب کنید</option>
          {regions.length > 0 &&
            regions.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
        </select>}
        <label className="auth-label">
          عنوان فروشگاه :
        </label>
        <input
          name="title"
          value={values.title}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        {role === 1 && <label className="auth-label">شماره تلفن مالک :</label>}
        {role === 1 && <input
          name="phoneNumber"
          value={values.phoneNumber}
          type="text"
          disabled={true}
        />}
        {role === 1 && <label className="auth-label">
          محصولات پشتیبانی :
        </label>}
        {role === 1 && <select
          name="backupFor"
          value={values.backupFor}
          onChange={(e) => changeInputHandler(e)}
        >
          <option>دسته بندی را انتخاب کنید</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>}
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
        <label className="auth-label">آدرس اینستاگرام : (فقط ادامه /https://www.instagram.com)</label>
        <input
          name="instagramId"
          value={values.instagramId}
          placeholder="?/https://www.instagram.com"
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">آدرس تلگرام : (فقط username حساب)</label>
        <input
          name="telegramId"
          value={values.telegramId}
          placeholder="?/https://t.me"
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        {role === 1 && <label className="auth-label">آدرس واتساپ :</label>}
        {role === 1 && <input
          name="whatsupId"
          value={values.whatsupId}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />}
        {role === 1 && <label className="auth-label">تیک آبی :</label>}
        {role === 1 && <select
          name="authentic"
          value={values.authentic}
          onChange={(e) => changeInputHandler(e)}
        >
          <option value={true}>داشته باشد</option>
          <option value={false}>نداشته باشد</option>
        </select>}
        <textarea
          type="text"
          name="description"
          value={values.description}
          rows="12"
          onChange={(e) => changeInputHandler(e)}
        ></textarea>
        <Button type="submit" disabled={values.description.length < 10 || loading}>
          {!loading ? "ثبت" : <span className="d-flex-center-center" style={{gap: "0 5px"}}>% {progressCount} <VscLoading className="loader" /></span>}
        </Button>
      </form>
    </div>
  );
};

export default CarouselUpdate;
