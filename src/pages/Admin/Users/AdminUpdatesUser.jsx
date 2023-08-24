import React, { useEffect, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import { VscLoading } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import axios from "../../../util/axios";
import defPro from "../../../assets/images/pro-8.png";
import Button from "../../../components/UI/FormElement/Button";
import "../UpdateProfileInfo/UpdateProfileInfo.css";

const AdminUpdatesUser = ({ match, history }) => {
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [oldPhoto, setOldPhoto] = useState("");
  const [deletedPhoto, setDeletedPhoto] = useState("");
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    isBanned: "",
    isAdmin: false,
    role: 3
  });
  const { id } = match.params;

  // const reCaptchaSiteKey = `${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/read/current-user/${id}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          const { thisUser } = response.data;
          setValues({
            firstName: thisUser.firstName,
            lastName: thisUser.lastName,
            address: thisUser.address ? thisUser.address : "",
            isBanned: thisUser.isBanned,
            isAdmin: thisUser.isAdmin,
            role: thisUser.role
          });
          thisUser.image ? setOldPhoto(thisUser.image) : setOldPhoto("");
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) setErrorText(err.response.data.message);
      });
  }, [id]);

  const changeInputHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // const changeRecaptchaHandler = (value) => {
  //   if (value !== null) {
  //     axios
  //       .post("/recaptcha", { securityToken: value })
  //       .then((res) => {
  //         if (res.data.success) {
  //           setExpired(false);
  //         }
  //       })
  //       .catch((err) => {
  //         toast.warning(err.response);
  //       });
  //   }
  // };

  const deleteOldImageHandler = () => {
    if (oldPhoto.length > 0) {
      setDeletedPhoto(oldPhoto);
      setOldPhoto("");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!values.firstName.length || !values.lastName.length) {
      return toast.warning("نام و نام خانوادگی باید وارد شود");
    }
    setLoading(true);
    if (!expired) {
      axios
        .put(`/admin/update/users-profile/${id}`, {
          firstName: values.firstName,
          lastName: values.lastName,
          address: values.address,
          isBanned: values.isBanned,
          role: Number(values.role),
          oldPhoto,
          deletedPhoto,
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
            toast.error(err.response.data.message);
          }
        });
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="d-flex-around">
        {errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : (
          <h4 className="mb-0">
            ویرایش اطلاعات کاربر با نام{" "}
            <strong className="text-blue">{`${values.firstName} ${values.lastName}`}</strong>
            {values.isAdmin && <span className="font-sm mr-1">(مدیریت)</span>}
          </h4>
        )}
        <Link to="/admin/dashboard/users" className="create-new-slide-link">
          <span className="sidebar-text-link">بازگشت به لیست کاربران</span>
        </Link>
      </div>
      <form className="auth-form edit-profile" onSubmit={submitHandler}>
        <div className="d-flex-center-center">
          {oldPhoto ? (
            <div className="preview_img_wrapper w-50 d-flex-center-center my-1">
              <span className="delete_user_img" onClick={deleteOldImageHandler}>
                <TiDelete />
              </span>
              <img
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${oldPhoto}`}
                alt="preview"
                className="profile_img"
              />
            </div>
          ) : (
            <div className="w-35 d-flex-center-center my-1">
              <img src={defPro} alt="preview" className="profile_img" />
            </div>
          )}
        </div>

        <label className="auth-label">نام :</label>
        <input
          name="firstName"
          value={values.firstName}
          type="text"
          onChange={(e) => changeInputHandler(e)}
          pattern="[\u0600-\u06FF\s]{3,20}"
          title="لطفا فقط از حروف فارسی استفاده کنید، نام باید بین 3 تا 20 حرف باشد"
        />
        <label className="auth-label">نام خانوادگی :</label>
        <input
          name="lastName"
          value={values.lastName}
          type="text"
          onChange={(e) => changeInputHandler(e)}
          pattern="[\u0600-\u06FF\s]{3,25}"
          title="لطفا فقط از حروف فارسی استفاده کنید، فامیلی باید بین 3 تا 25 حرف باشد"
        />
        <label className="auth-label">آدرس :</label>
        <textarea
          type="text"
          name="address"
          value={values.address}
          rows="3"
          onChange={(e) => changeInputHandler(e)}
          title="لطفا فقط از حروف فارسی استفاده کنید، آدرس باید بین 15 تا 300 حرف باشد"
        ></textarea>
        {values.role !== 1 && <label className="auth-label">وضعیت فعالیت :</label>}
        {values.role !== 1 && <select
          name="isBanned"
          value={values.isBanned}
          onChange={(e) => changeInputHandler(e)}
        >
          <option value={false}>فعال</option>
          <option value={true}>مسدود</option>
        </select>}

        {values.role !== 1 && <label className="auth-label">نوع دسترسی :</label>}
        {values.role !== 1 && <select
          name="role"
          value={values.role}
          onChange={(e) => changeInputHandler(e)}
        >
          <option value={1} disabled={true}>مدیریت اصلی</option>
          <option value={2}>مدیر فروشگاه</option>
          <option value={3}>کاربر عادی</option>
        </select>}

        <label className="auth-label">تصاویر مرتبط را انتخاب کنید : </label>
        {/* <ReCAPTCHA
          sitekey={reCaptchaSiteKey}
          onChange={changeRecaptchaHandler}
          hl="fa"
          className="recaptcha"
          theme="dark"
        /> */}
        <Button type="submit" disabled={loading}>
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
    </div>
  );
};

export default AdminUpdatesUser;
