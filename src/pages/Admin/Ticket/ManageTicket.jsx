import React, { useEffect, useState, useRef } from "react";
import { VscLoading } from "react-icons/vsc";
import { IoArrowUndoCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

import { useForm } from "../../../util/hooks/formHook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
} from "../../../util/validators";
import axios from "../../../util/axios";
import Button from "../../../components/UI/FormElement/Button";
import Input from "../../../components/UI/FormElement/Input";
import { toast } from "react-toastify";
import { TiDelete } from "react-icons/ti";
import "../../User/Ticket/Ticket.css";
import "./manageTicket.css";

const ManageTicket = ({ match, history }) => {
  const [ticket, setTicket] = useState();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [putAnswer, setPutAnswer] = useState(false);
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const [putLoading, setPutLoading] = useState(false);

  const { id } = match.params;

  const [formState, inputHandler] = useForm(
    {
      answer: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/read/current-ticket/${id}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setTicket(response.data.ticket);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, [id]);

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

  const spreadStatusInSelect = (s) => {
    let status;
    switch (s) {
      case 1:
        status = "فرایند خرید (ایجاد سفارش)";
        break;
      case 2:
        status = "پرداخت در محل";
        break;
      case 3:
        status = "بازگشت وجه";
        break;
      case 4:
        status = "پس فرستادن کالا";
        break;
      case 5:
        status = "نحوه تحویل کالا";
        break;
      case 6:
        status = "کیفیت کالا";
        break;
      case 7:
        status = "قیمت کالا";
        break;
      case 8:
        status = "ویرایش اطلاعات حساب کاربری";
        break;
      case 9:
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

    formData.append("answer", formState.inputs.answer.value);

    formData.append("photo", file);

    setPutLoading(true);
    axios
      .put(`/answer/user/ticket/${id}`, formData)
      .then((response) => {
        setPutLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
        }
        history.goBack();
      })
      .catch((err) => {
        setPutLoading(false);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  return (
    <div className="admin-panel-wrapper">
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        ticket &&
        ticket.sender._id && (
          <div className="d-flex-around mb-2">
            <h4 className="font-sm mb-0">
              پاسخ دهی به تیکت ارسالی از طرف{" "}
              <strong className="text-blue">{`${ticket.sender.firstName}  ${ticket.sender.lastName}`}</strong>{" "}
            </h4>
            <Link
              to="/admin/dashboard/tickets"
              className="create-new-slide-link"
            >
              <span className="sidebar-text-link">بازگشت به فهرست تیکت ها</span>
              <IoArrowUndoCircle className="font-md" />
            </Link>
          </div>
        )
      )}
      {loading ? (
        <VscLoading className="loader" />
      ) : (
        ticket &&
        ticket.sender._id && (
          <div className="ticket-wrapper">
            <div className="ticket-titles-wrapper">
              <span className="font-sm">
                موضوع تیکت :{" "}
                <strong className="text-blue">
                  {spreadStatusInSelect(ticket.status)}
                </strong>
              </span>
              <span className="font-sm">
                رسیدگی :
                <strong className="text-blue mx-2">
                  {ticket.visited ? "شد" : "نشده است"}
                </strong>
              </span>
              <span className="font-sm">
                تاریخ ارسال :
                <strong className="text-blue mx-1">
                  {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                </strong>
              </span>
            </div>
            <div className="ticket-body-wrapper">
              <div className="ticket-body">
                <p>{ticket.content}</p>
              </div>
              {ticket.image && ticket.image.length > 0 && (
                <div className="ticket-image">
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ticket.image}`}
                    alt={ticket.status}
                    className="w-100"
                  />
                </div>
              )}
            </div>

            <div className="d-flex-center-center mb-2">
              <hr />
              <Button onClick={() => setPutAnswer(!putAnswer)}>
                {ticket.visited ? "پاسخدهی مجدد" : "پاسخدهی به تیکت"}
              </Button>
            </div>

            {putAnswer && (
              <form
                className="auth-form"
                encType="multipart/form-data"
                onSubmit={submitHandler}
              >
                <label className="auth-label">
                  توضیحات شما در پاسخ به تیکت :
                </label>
                <Input
                  id="answer"
                  element="textarea"
                  type="text"
                  row={15}
                  onInput={inputHandler}
                  validators={[
                    VALIDATOR_MAXLENGTH(3000),
                    VALIDATOR_MINLENGTH(30),
                    VALIDATOR_SPECIAL_CHARACTERS(),
                  ]}
                  errorText="از علامت ها و عملگر ها استفاده نکنید،بین 30 تا 3000 حرف میتوانید وارد کنید"
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
                  disabled={
                    !formState.inputs.answer.isValid || putLoading || !putAnswer
                  }
                >
                  {!putLoading ? "ثبت پاسخ" : <VscLoading className="loader" />}
                </Button>
              </form>
            )}
            {ticket.visited && (
              <div className="answer-wrapper">
                <span className="font-sm">
                  تاریخ پاسخدهی :
                  <strong className="mx-1">
                    {Date.parse(ticket.createdAt) !==
                    Date.parse(ticket.updatedAt)
                      ? new Date(ticket.updatedAt).toLocaleDateString("fa-IR")
                      : "در انتظار پاسخ دهی"}
                  </strong>
                </span>
                <div className="ticket-body">
                  <p>{ticket.answer}</p>
                </div>
                {ticket.answerImage && ticket.answerImage.length > 0 && (
                  <div className="ticket-image">
                    <img
                      src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ticket.answerImage}`}
                      alt={ticket.status}
                      className="w-100"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ManageTicket;
