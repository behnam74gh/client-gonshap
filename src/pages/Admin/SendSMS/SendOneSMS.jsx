import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { IoArrowUndoCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

import axios from "../../../util/axios";
import { useForm } from "../../../util/hooks/formHook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_PHONENUMBER,
  VALIDATOR_SPECIAL_CHARACTERS_2,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import "../Carousel/Carousels.css";

const SendOneSMS = () => {
  const [reRenderParent, setReRenderParent] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formState, inputHandler] = useForm(
    {
      messageContent: {
        value: "",
        isValid: false,
      },
      phoneNumber: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setReRenderParent(true);
  }, [reRenderParent]);

  const submitHandler = (e) => {
    e.preventDefault();

    setLoading(true);
    axios
      .post("/send/sms", {
        messageContent: formState.inputs.messageContent.value,
        phoneNumber: formState.inputs.phoneNumber.value,
        level: "one",
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setReRenderParent(false);
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
    reRenderParent && (
      <div className="admin-panel-wrapper">
        <h4>ارسال پیامک به یک شماره</h4>
        <form className="auth-form" onSubmit={submitHandler}>
          <Input
            id="messageContent"
            element="textarea"
            type="text"
            placeholder="محتوای پیامک :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(400),
              VALIDATOR_MINLENGTH(8),
              VALIDATOR_SPECIAL_CHARACTERS_2(),
            ]}
          />
          <Input
            id="phoneNumber"
            element="input"
            type="text"
            placeholder="شماره موبایل :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(11),
              VALIDATOR_PHONENUMBER(),
            ]}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {!loading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
        </form>
        <Link
          to="/admin/dashboard/send-sms"
          className="create-new-slide-link text-blue font-sm d-flex-center-center"
        >
          لیست پیامک های ارسال شده
          <IoArrowUndoCircle className="font-md" />
        </Link>
      </div>
    )
  );
};

export default SendOneSMS;
