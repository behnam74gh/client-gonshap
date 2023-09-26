import React, { useEffect, useRef, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { VscLoading } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";
import { toast } from "react-toastify";
import axios from "../../../util/axios";
import Button from "../../../components/UI/FormElement/Button";
import { UPDATE_DASHBOARD_IMAGE, USER_SIGNIN_SUCCESS } from "../../../redux/Types/authTypes";
import Input from "../../../components/UI/FormElement/Input";
import { 
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PERSIAN_ALPHABET,
  VALIDATOR_SPECIAL_CHARACTERS
} from "../../../util/validators";
import { useForm } from "../../../util/hooks/formHook";
import defPro from "../../../assets/images/pro-8.png";
import "../../../components/UI/FormElement/ImageUpload.css";
import "../../../components/UI/FormElement/Input.css";
import "./UpdateProfileInfo.css";

const UpdateProfileInfo = ({ history }) => {
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [oldPhoto, setOldPhoto] = useState("");
  const [deletedPhoto, setDeletedPhoto] = useState("");
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });

  const dispatch = useDispatch();
  const [formState, inputHandler] = useForm(
    {
      firstName: {
        value: "",
        isValid: false,
      },
      lastName: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  // const reCaptchaSiteKey = `${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;

  useEffect(() => {
    setLoading(true);
    axios
      .get("/get/current-user/info")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          const { wantedUser } = response.data;
          setValues({
            firstName: wantedUser.firstName,
            lastName: wantedUser.lastName,
            address: wantedUser.address ? wantedUser.address : "",
          });
          wantedUser.image ? setOldPhoto(wantedUser.image) : setOldPhoto("");
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data.message)
          setErrorText(err.response.data.message);
      });
  }, []);

  //image-picker-codes
  const filePickerRef = useRef();

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (e) => {
    let pickedFile;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      if (oldPhoto.length > 0) {
        setDeletedPhoto(oldPhoto);
        setOldPhoto("");
      }
      setFile(pickedFile);
    } else {
      return;
    }

    setFileUrl(e.target.files[0]);
  };
  const setFileUrl = (file) => {
    const turnedUrl = URL.createObjectURL(file);
    setUrl(turnedUrl);
    if (url) URL.revokeObjectURL(url);
  };
  //image-picker-codes

  const changeInputHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const changeRecaptchaHandler = (value) => {
    if (value !== null) {
      axios
        .post("/recaptcha", { securityToken: value })
        .then((res) => {
          if (res.data.success) {
            setExpired(false);
          }
        })
        .catch((err) => {
          if (err || err.response) {
            toast.warning("خطایی رخ داده است،لطفا اینترنت خود را چک کنید");
          }
        });
    }
  };

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

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("firstName", formState.inputs.firstName.value);
    formData.append("lastName", formState.inputs.lastName.value);
    formData.append("address", formState.inputs.address.value);

    formData.append("oldPhoto", oldPhoto);
    formData.append("deletedPhoto", deletedPhoto);
    formData.append("photo", file);
    setLoading(true);
    
    if (!expired) {
      axios
        .put("/user/profile/update-info", formData)
        .then((response) => {
          setLoading(false);
          if (response.data.success) {
            const { userInfo,message } = response.data;
            toast.success(message);
            const {firstName,isAdmin,role,isBan,supplierFor,userId,usersImage}=userInfo;
            setExpired(true);
            dispatch({
              type: USER_SIGNIN_SUCCESS,
              payload: {
                firstName,
                isAdmin,role,isBan,supplierFor,
                userId,
              },
            });
            if (localStorage.getItem("gonshapUserInfo")) {
              localStorage.setItem(
                "gonshapUserInfo",
                JSON.stringify({
                  firstName,
                  isAdmin,role,isBan,supplierFor,
                  userId,
                })
              );
            }
            dispatch({ type: UPDATE_DASHBOARD_IMAGE, payload: usersImage });
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
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <h4>
          <strong className="text-blue">
            {`${values.firstName} ${values.lastName} `}
          </strong>
          عزیز، لطفا اطلاعات جدید را با دقت وارد نمایید.
        </h4>
      )}
      <form
        className="auth-form edit-profile"
        encType="multipart/form-data"
        onSubmit={submitHandler}
      >
        <div className="image-upload-wrapper">
          <input
            ref={filePickerRef}
            type="file"
            accept=".jpg,.png,.jpeg,.jfif"
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
                className="profile_img"
              />
            </div>
          ) : url ? (
            <div className="w-35 pos-rel d-flex-center-center my-1">
              <span className="delete_user_img" onClick={deleteNewImageHandler}>
                <TiDelete />
              </span>
              <img src={url} alt="preview" className="profile_img" />
            </div>
          ) : (
            <div className="w-35 d-flex-center-center my-1">
              <img src={defPro} alt="preview" className="profile_img" />
            </div>
          )}
        </div>

        <label className="auth-label">نام :</label>
        <Input
            id="firstName"
            element="input"
            type="text"
            onInput={inputHandler}
            defaultValue={values.firstName}
            validators={[
              VALIDATOR_MAXLENGTH(20),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_PERSIAN_ALPHABET(),
            ]}
        />
        <label className="auth-label">نام خانوادگی :</label>
        <Input
            id="lastName"
            element="input"
            type="text"
            onInput={inputHandler}
            defaultValue={values.lastName}
            validators={[
              VALIDATOR_MAXLENGTH(25),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_PERSIAN_ALPHABET(),
            ]}
        />
        <label className="auth-label">آدرس :</label>
        <Input
            id="address"
            element="input"
            type="text"
            onInput={inputHandler}
            defaultValue={values.address}
            placeholder="جهت ارسال کالا"
            validators={[
              VALIDATOR_MAXLENGTH(300),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
        />
        <label className="auth-label">تصاویر مرتبط را انتخاب کنید : </label>
        {/* <ReCAPTCHA
          sitekey={reCaptchaSiteKey}
          onChange={changeRecaptchaHandler}
          theme="dark"
          hl="fa"
          className="recaptcha"
        /> */}
        <Button
          type="submit"
          disabled={ loading || !formState.inputs.firstName.isValid || !formState.inputs.lastName.isValid}
        >
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfileInfo;
