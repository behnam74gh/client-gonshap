import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "../../../util/axios";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { useForm } from "../../../util/hooks/formHook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
  VALIDATOR_PHONENUMBER,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import { useSelector } from "react-redux";
import { db } from "../../../util/indexedDB";
import "./Section14.css";

const Section14 = () => {
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({});
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [reRenderForm, setReRenderForm] = useState(true);
  const { isOnline, userSignin : { userInfo } } = useSelector((state) => state)
 
  const [formState, inputHandler] = useForm({
    phoneNumber: {
      value: "",
      isValid: false,
    },
    content: {
      value: "",
      isValid: false,
    },
  });

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;
    db.companyInformation.toArray().then(items => {
      if(items.length > 0 && mounted){
        setCompanyInfo(items[0])
        setCoordinates({
          latitude: items[0].latitude,
          longitude: items[0].longitude,
        });
      }else{
        axios.get("/read/company-info",{signal: ac.signal}).then((response) => {
          if (response.data.success && mounted) {
            setCompanyInfo(response.data.companyInfo);
            setCoordinates({
              latitude: response.data.companyInfo.latitude,
              longitude: response.data.companyInfo.longitude,
            });
          }
        })
        .catch(err => {
          if(err){
            return;
          };
        })
      }
    })

    return () => {
      ac.abort()
      mounted = false;
    }
  }, []);

  useEffect(() => {
    if (!reRenderForm) {
      setReRenderForm(true);
    }
  }, [reRenderForm]);

  const submitHandler = (e) => {
    e.preventDefault();

    if(!isOnline){
      toast.warning('شما به اینترنت دسترسی ندارید')
      return
    }
    
    setLoading(true);
    axios
      .post("/create/user-suggest", {
        phoneNumber: formState.inputs.phoneNumber.value,
        content: formState.inputs.content.value,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setReRenderForm(false);
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
    <section id="sec14">
        {(coordinates.latitude !== null && coordinates.longitude !== null) && (
          <div className="company_location">
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
                <Marker position={[coordinates.latitude, coordinates.longitude]}>
                  <Popup>{companyInfo.companyTitle}</Popup>
                </Marker>
              </MapContainer>
          </div>
        )}
      <div className="suggestion_wrapper">
        {reRenderForm && (
          <form className="auth-form" onSubmit={submitHandler}>
            <h5 className="mt-0">پیشنهادات و انتقادات ( لطفا ابتدا عضو شوید )</h5> 
            <label className="auth-label">
              شماره تلفن همراه :<span className="need_to_fill">*</span>
            </label>
            <Input
              id="phoneNumber"
              element="input"
              type="text"
              placeholder="مثال: 5683***0911"
              onInput={inputHandler}
              validators={[
                VALIDATOR_PHONENUMBER(),
                VALIDATOR_MAXLENGTH(11),
              ]}
            />
            <Input
              id="content"
              element="textarea"
              type="text"
              placeholder="نظر شما :"
              rows={8}
              onInput={inputHandler}
              validators={[
                VALIDATOR_MAXLENGTH(1000),
                VALIDATOR_MINLENGTH(20),
                VALIDATOR_SPECIAL_CHARACTERS(),
              ]}
            />
            <Button type="submit" disabled={loading || !formState.isValid || userInfo?.userId?.length < 1 || userInfo.isBan}>
              {!loading ? "ارسال" : <VscLoading className="loader" />}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Section14;
