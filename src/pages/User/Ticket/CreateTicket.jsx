import React, { useRef, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import { TiDelete } from "react-icons/ti";

import { useForm } from "../../../util/hooks/formHook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
} from "../../../util/validators";
import axios from "../../../util/axios";
import Button from "../../../components/UI/FormElement/Button";
import Input from "../../../components/UI/FormElement/Input";
import { resizeFile } from "../../../util/customFunctions";
import { CUSTOMER_LAST_TICKETS } from "../../../redux/Types/ttlDataTypes";
import { useDispatch } from "react-redux";

const CreateTicket = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const [ticketStatus, setTicketStatus] = useState("none");
  const [progressCount, setProgressCount] = useState(0);

  const dispatch = useDispatch();

  const defaultStatus = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const [formState, inputHandler] = useForm(
    {
      content: {
        value: "",
        isValid: false,
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
    let pickedFile;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = await resizeFile(e.target.files[0]);
      if(pickedFile?.size > 500000){
        toast.warning('حجم عکس انتخاب شده بعد از تغییر اندازه توسط بازارچک، بیشتر از 500 KB است. لطفا حجم عکس را کمتر کنید');
        return;
      }
      setFile(pickedFile);
      setFileUrl(pickedFile);
    } else {
      return;
    }
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

  const spreadStatusInSelect = (s) => {
    let status;
    switch (s) {
      case "1":
        status = "نحوه ایجاد سفارش";
        break;
      case "2":
        status = "نحوه پرداخت وجه";
        break;
      case "3":
        status = "بازگشت وجه";
        break;
      case "4":
        status = "پس فرستادن کالا";
        break;
      case "5":
        status = "نحوه تحویل کالا";
        break;
      case "6":
        status = "کیفیت کالا";
        break;
      case "7":
        status = "قیمت کالا";
        break;
      case "8":
        status = "ویرایش اطلاعات حساب کاربری";
        break;
      case "9":
        status = "موارد دیگر";
        break;
      default:
        return;
    }
    return status;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("ticketStatus", ticketStatus);
    formData.append("content", formState.inputs.content.value);

    formData.append("photo", file);

    setLoading(true);
    axios
      .post("/user/create/ticket", formData, {
        onUploadProgress: function(progressEvent){
          setProgressCount(Math.round( (progressEvent.loaded * 100) / progressEvent.total ))
        }
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          dispatch({
            type: CUSTOMER_LAST_TICKETS,
            payload: {
              ttlTime : 0,
              data: null
            }
          });
        }
        history.goBack();
      })
      .catch((err) => {
        setLoading(false);
        if (err?.response && typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err?.response?.data?.message || "اینترنت شما ضعیف است، لطفا مجددا تلاش فرمایید");
        }
      });
  };

  return (
    <div className="admin-panel-wrapper">
      <form
        className="auth-form"
        encType="multipart/form-data"
        onSubmit={submitHandler}
      >
        <label className="auth-label">موضوع تیکت :</label>
        <select
          value={ticketStatus}
          className="ticket_select"
          onChange={(e) => setTicketStatus(e.target.value)}
        >
          <option value="none">تعیین موضوع</option>
          {defaultStatus.map((s, i) => (
            <option key={i} value={s}>
              {spreadStatusInSelect(s)}
            </option>
          ))}
        </select>
        <label className="auth-label">توضیحات شما در مورد تیکت :</label>
        <Input
          id="content"
          element="textarea"
          type="text"
          row={15}
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(3000),
            VALIDATOR_MINLENGTH(10),
            VALIDATOR_SPECIAL_CHARACTERS(),
          ]}
        />
        <label className="auth-label">در صورت لزوم :</label>
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
        <div className="d-flex-center-center">
          {url && (
            <div className="w-100 pos-rel d-flex-center-center my-1">
              <span
                className="delete_ticket_img"
                onClick={deleteNewImageHandler}
              >
                <TiDelete />
              </span>
              <img src={url} alt="preview" className="ticket-img" />
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!formState.inputs.content.isValid || loading}
        >
          {!loading ? "ثبت" : <span className="d-flex-center-center" style={{gap: "0 5px"}}>% {progressCount} <VscLoading className="loader" /></span>}
        </Button>
      </form>
    </div>
  );
};

export default CreateTicket;
