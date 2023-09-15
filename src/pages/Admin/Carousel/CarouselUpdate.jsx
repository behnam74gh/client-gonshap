import React, { useEffect, useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { VscLoading } from "react-icons/vsc";
import { IoArrowUndoCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";

const oldStates = {
  title: "",
  storePhoneNumber: "",
  phoneNumber: "",
  address: "",
  description: "",
  backupFor: "",
  longitude: "",
  latitude: "",
};

const CarouselUpdate = ({ history, match }) => {
  const [oldPhotos, setOldPhotos] = useState([]);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [values, setValues] = useState(oldStates);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;
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

  useEffect(() => {
    axios
      .get(`/current-supplier/${slug}`)
      .then((response) => {
        const {
          title,
          storePhoneNumber,
          phoneNumber,
          address,
          longitude,
          latitude,
          description,
          backupFor,
          photos,
        } = response.data.thisSupplier;
        if (response.data.success) {
          setValues({
            title,
            storePhoneNumber,
            phoneNumber,
            address,
            longitude,
            latitude,
            description,
            backupFor: backupFor._id,
          });
          setOldPhotos(photos);
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
  const pickedHandler = (e) => {
    let longSizes = [...e.target.files].filter(file => file.size > 600000);
    if(e.target.files.length + files.length + oldPhotos.length > 6){
      toast.warning('بیشتر از 6 عکس نمی توانید انتخاب کنید')
      return;
    }
    if(longSizes.length > 0){
      toast.warning('سایز عکس بیشتر از 600 کیلوبایت است')
      return;
    }
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

  const changeInputHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const {
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

    formData.append("title", title);
    formData.append("storePhoneNumber", storePhoneNumber);
    formData.append("phoneNumber", phoneNumber);
    formData.append("backupFor", backupFor);
    formData.append("address", address);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    formData.append("description", description);

    formData.append("deletedPhotos", deletedPhotos);
    formData.append("oldPhotos", oldPhotos);

    let filesLength = files.length;

    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .put(`/supplier/update/${slug}`, formData)
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
          <h4 className="my-0">
            ویرایش اطلاعات فروشگاه{" "}
            <strong className="text-blue">{values.title}</strong> که تامین کننده
            محصولات
            <strong className="text-blue">&nbsp;{values.backupFor}</strong> است.
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
          عنوان فروشگاه :
        </label>
        <input
          name="title"
          value={values.title}
          type="text"
          onChange={(e) => changeInputHandler(e)}
        />
        <label className="auth-label">شماره تلفن مالک :</label>
        <input
          name="phoneNumber"
          value={values.phoneNumber}
          type="text"
          disabled={true}
        />
        <label className="auth-label" htmlFor="category">
          محصولات پشتیبانی :
        </label>
        <select
          name="backupFor"
          value={values.backupFor}
          onChange={(e) => changeInputHandler(e)}
        >
          <option>دسته بندی را انتخاب کنید</option>
          {categories.length > 0 &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
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
        <textarea
          type="text"
          name="description"
          value={values.description}
          rows="12"
          onChange={(e) => changeInputHandler(e)}
        ></textarea>
        <Button type="submit">
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
    </div>
  );
};

export default CarouselUpdate;
