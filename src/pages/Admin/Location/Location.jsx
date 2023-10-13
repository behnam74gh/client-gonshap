import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { useForm } from "../../../util/hooks/formHook";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "../../../util/axios";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
  VALIDATOR_NUMBER,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import { TiDelete } from "react-icons/ti";
import { db } from '../../../util/indexedDB';
import defPic from "../../../assets/images/def.jpg";
import InstagramLogo from "../../../assets/images/instalogo.png";
import TelegramLogo from "../../../assets/images/telegram_PNG11.png";
import WhatsappLogo from "../../../assets/images/whatsapp-logo.png";
import "./Location.css";

const Location = () => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const [reRenderForm, setReRenderForm] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({});
  const [errorText, setErrorText] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const [formState, inputHandler] = useForm({
    companyTitle: {
      value: "",
      isValid: false,
    },
    storePhoneNumber1: {
      value: "",
      isValid: false,
    },
    storePhoneNumber2: {
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
      isValid: false,
    },
    telegramId: {
      value: "",
      isValid: false,
    },
    whatsupId: {
      value: "",
      isValid: false,
    },
    signENemad: {
      value: "",
      isValid: true,
    },
    signUnion: {
      value: "",
      isValid: true,
    },
    signMedia: {
      value: "",
      isValid: true,
    },
    aboutUs: {
      value: "",
      isValid: true,
    },
    address: {
      value: "",
      isValid: true,
    },
  });

  const loadCompanyInfo = () => {
    axios.get("/read/company-info").then((response) => {
      if (response.data.success) {
        setCompanyInfo(response.data.companyInfo);
        setCoordinates({
          latitude: response.data.companyInfo.latitude,
          longitude: response.data.companyInfo.longitude,
        });
      }
    })
    .catch((err) => {
      if (err.response) {
        setErrorText(err.response.data.message);
      }
    });
  }

  useEffect(() => {
    db.companyInformation.toArray().then(items => {
      if(items.length > 0){
        setCompanyInfo(items[0])
        setCoordinates({
          latitude: items[0].latitude,
          longitude: items[0].longitude,
        });
      }else{
        loadCompanyInfo()
      }
    })
  }, []);

  useEffect(() => {
    if (!reRenderForm) {
      setReRenderForm(true);
    }
  }, [reRenderForm]);

  //image-picker-codes
  const filePickerRef = useRef();

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (e) => {
    let pickedFile;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
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

  const deleteNewImageHandler = () => {
    if (url.length > 0) {
      setUrl();
      setFile();
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("companyTitle", formState.inputs.companyTitle.value);
    formData.append(
      "storePhoneNumber1",
      formState.inputs.storePhoneNumber1.value
    );
    formData.append(
      "storePhoneNumber2",
      formState.inputs.storePhoneNumber2.value
    );
    formData.append("longitude", formState.inputs.longitude.value);
    formData.append("latitude", formState.inputs.latitude.value);
    formData.append("instagramId", formState.inputs.instagramId.value);
    formData.append("telegramId", formState.inputs.telegramId.value);
    formData.append("whatsupId", formState.inputs.whatsupId.value);
    formData.append("signENemad", formState.inputs.signENemad.value);
    formData.append("signUnion", formState.inputs.signUnion.value);
    formData.append("signMedia", formState.inputs.signMedia.value);
    formData.append("aboutUs", formState.inputs.aboutUs.value);
    formData.append("address", formState.inputs.address.value);

    formData.append("photo", file);

    axios
      .post("/set/company-info/", formData)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setReRenderForm(false);
          deleteNewImageHandler();
          setShowForm(false);
          loadCompanyInfo();
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
      <Button onClick={() => setShowForm(!showForm)}>
        {!showForm ? "وارد کردن اطلاعات شرکت" : "بستن فرم"}
      </Button>
      {showForm && (
        <React.Fragment>
          {reRenderForm && (
            <form className="auth-form" onSubmit={submitHandler}>
              <label className="auth-label">لوگویِ شرکت :</label>
              <div className="image-upload-wrapper">
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
              <div className="d-flex-center-center pb-2">
                {url && (
                  <div className="w-35 pos-rel d-flex-center-center my-1">
                    <span
                      className="delete_ticket_img"
                      onClick={deleteNewImageHandler}
                    >
                      <TiDelete />
                    </span>
                    <img src={url} alt="preview" style={{width: "100%"}} className="ticket-img" />
                  </div>
                )}
              </div>
              <label className="auth-label">نام شرکت :</label>
              <Input
                id="companyTitle"
                element="input"
                type="text"
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(70),
                  VALIDATOR_MINLENGTH(2),
                  VALIDATOR_SPECIAL_CHARACTERS(),
                ]}
              />
              <label className="auth-label">شماره تلفن ثابت شرکت 1 :</label>
              <Input
                id="storePhoneNumber1"
                element="input"
                type="text"
                placeholder="مثال: 01717027687"
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(11),
                  VALIDATOR_MINLENGTH(11),
                ]}
              />
              <label className="auth-label">شماره تلفن ثابت شرکت 2 :</label>
              <Input
                id="storePhoneNumber2"
                element="input"
                type="text"
                placeholder="مثال: 01717027687"
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(11),
                  VALIDATOR_MINLENGTH(11),
                ]}
              />
              <label className="auth-label">آدرس شرکت :</label>
              <Input
                id="address"
                element="input"
                type="text"
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(150),
                  VALIDATOR_MINLENGTH(3),
                  VALIDATOR_SPECIAL_CHARACTERS(),
                ]}
              />
              <label className="auth-label">
                مختصات نقشه ی شرکت (longitude) :
              </label>
              <Input
                id="longitude"
                element="input"
                type="number"
                placeholder="55.16630172729493"
                onInput={inputHandler}
                validators={[VALIDATOR_NUMBER()]}
              />
              <label className="auth-label">
                مختصات نقشه ی شرکت (latitude) :
              </label>
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
              <label className="auth-label">آدرس نماد الکترونیک :</label>
              <Input
                id="signENemad"
                element="input"
                type="text"
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(150),
                ]}
              />
              <label className="auth-label">آدرس صنفی :</label>
              <Input
                id="signUnion"
                element="input"
                type="text"
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(150),
                ]}
              />
              <label className="auth-label">آدرس رسانه دیجیتال :</label>
              <Input
                id="signMedia"
                element="input"
                type="text"
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(150),
                ]}
              />
              <Input
                id="aboutUs"
                element="textarea"
                type="text"
                placeholder="درباره ما"
                rows={8}
                onInput={inputHandler}
                validators={[
                  VALIDATOR_MAXLENGTH(3000),
                  VALIDATOR_MINLENGTH(300),
                  VALIDATOR_SPECIAL_CHARACTERS(),
                ]}
              />
              <Button
                type="submit"
                disabled={loading || !formState.isValid || file === undefined}
              >
                {!loading ? "ثبت" : <VscLoading className="loader" />}
              </Button>
            </form>
          )}
        </React.Fragment>
      )}
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : companyInfo._id && companyInfo._id.length > 0 ? (
        <div className="company_info_wrapper">
          <div className="company_title_info_wrapper">
            <div className="company_title_wrapper">
              <span className="ml-2">نام شرکت :</span>
              <h5>{companyInfo.companyTitle}</h5>
            </div>
            <div className="d-flex-center-center">
              <img
                className="company_logo"
                src={
                  companyInfo.logo.length > 0
                    ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${companyInfo.logo}`
                    : `${defPic}`
                }
                alt={companyInfo.companyTitle}
              />
            </div>
          </div>
          <div className="about_us_wrapper">
            <p>{companyInfo.aboutUs}</p>
          </div>
          <div className="company_location_info_wrapper">
            <div className="company_access_infos_wrapper">
              <div className="info_box">
                <strong className="font-sm">
                  آدرس : {companyInfo.address}
                </strong>
              </div>
              <div className="info_box">
                <span className="font-sm">تلفن ثابت اول :</span>
                <strong>{companyInfo.storePhoneNumber1}</strong>
              </div>
              <div className="info_box">
                <span className="font-sm">تلفن ثابت دوم :</span>
                <strong>{companyInfo.storePhoneNumber2}</strong>
              </div>
              <div className="info_box">
                <img
                  src={InstagramLogo}
                  alt="instagram_id"
                  className="instagram_logo"
                />
                <a
                  href={`https://instagram.com/${companyInfo.instagramId}`}
                  target="_blank"
                  rel="noreferrer"
                  title={companyInfo.title}
                >
                  {companyInfo.instagramId}
                </a>
              </div>
              <div className="info_box">
                <img src={TelegramLogo} alt="telegram_id" />
                <a
                  href={`https://telegram.com/${companyInfo.telegramId}`}
                  target="_blank"
                  rel="noreferrer"
                  title={companyInfo.title}
                >
                  {companyInfo.telegramId}
                </a>
              </div>
              <div className="info_box">
                <img src={WhatsappLogo} alt="whatsapp_id" />
                <a
                  href={`https://whatsapp.com/${companyInfo.whatsupId}`}
                  target="_blank"
                  rel="noreferrer"
                  title={companyInfo.title}
                >
                  {companyInfo.whatsupId}
                </a>
              </div>
            </div>
            <div className="company_location_box">
              {coordinates.latitude && (
                <MapContainer
                  center={[coordinates.latitude, coordinates.longitude]}
                  zoom={16}
                  scrollWheelZoom={false}
                  className="map_supp"
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[coordinates.latitude, coordinates.longitude]}
                  >
                    <Popup>{companyInfo.companyTitle}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="info-message">اطلاعاتی برای شرکت ثبت نشده است!</p>
      )}
    </div>
  );
};

export default Location;
