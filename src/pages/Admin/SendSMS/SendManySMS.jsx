import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { TiDelete } from "react-icons/ti";
import { BiAddToQueue } from "react-icons/bi";
import { IoArrowUndoCircle } from "react-icons/io5";
import { Link } from "react-router-dom";

import axios from "../../../util/axios";
import { useForm } from "../../../util/hooks/formHook";
import {
  VALIDATOR_SPECIAL_CHARACTERS_2,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_PHONENUMBER,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import "./SendSMS.css";

const SendManySMS = () => {
  const [reRenderParent, setReRenderParent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [phoneNumberIsValid, setPhoneNumberIsValid] = useState(false);

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

  const checkPhoneNumbersValidity = () => {
    setCheckLoading(true);
    axios
      .post("/user/check/phone-number", {
        phoneNumber: formState.inputs.phoneNumber.value,
      })
      .then((response) => {
        setCheckLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setPhoneNumberIsValid(true);
        }
      })
      .catch((err) => {
        setCheckLoading(false);
        if (err.response) toast.error(err.response.data.message);
      });
  };

  const addToContactsHandler = () => {
    let phoneNum = formState.inputs.phoneNumber.value;
    const existPhoneNum = contacts.find((pn) => pn === phoneNum);
    if (!existPhoneNum) {
      setContacts([...contacts, phoneNum]);
    }
    setPhoneNumberIsValid(false);
  };

  const deletePhoneNumHandler = (contact) => {
    const contactsCopy = contacts;
    const newContacts = contactsCopy.filter((c) => c !== contact);
    setContacts(newContacts);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setLoading(true);
    axios
      .post("/send/sms", {
        messageContent: formState.inputs.messageContent.value,
        level: "many",
        contacts,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setReRenderParent(false);
          setContacts([]);
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
        <h4>ارسال پیامک به چند شماره</h4>
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
            errorText="از علامت ها و عملگرها استفاده نکنید؛ میتوانید از 8 تا 400 حرف وارد کنید!"
          />
          <Input
            id="phoneNumber"
            element="input"
            type="text"
            placeholder="شماره موبایل :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(11),
              VALIDATOR_MINLENGTH(11),
              VALIDATOR_PHONENUMBER(),
            ]}
            errorText="شماره تلفن با 09 شرو میشود و درمجموع 11 رقم میباشد!"
          />
          <div className="w-100 d-flex-between">
            <Button
              type="button"
              onClick={checkPhoneNumbersValidity}
              disabled={
                !formState.inputs.phoneNumber.isValid ||
                checkLoading ||
                phoneNumberIsValid
              }
            >
              {!checkLoading ? "چک کن" : <VscLoading className="loader" />}
            </Button>
            {phoneNumberIsValid && (
              <Button
                type="button"
                onClick={addToContactsHandler}
                disabled={!phoneNumberIsValid}
              >
                افزودن به لیست
                <BiAddToQueue className="font-md mr-1" />
              </Button>
            )}
          </div>
          {contacts.length > 0 && (
            <div className="contacts-wrapper">
              {contacts.map((c, i) => (
                <span key={i} className="contact-wrapper">
                  <TiDelete
                    onClick={() => deletePhoneNumHandler(c)}
                    className="delete-contact"
                  />
                  {c}
                </span>
              ))}
            </div>
          )}
          <Button
            type="submit"
            disabled={
              !formState.inputs.messageContent.isValid || !contacts.length
            }
          >
            {!loading ? "ارسال به همه" : <VscLoading className="loader" />}
          </Button>
        </form>
        <Link
          to="/admin/dashboard/send-sms"
          className="text-blue font-sm d-flex-center-center"
        >
          لیست پیامک های ارسال شده
          <IoArrowUndoCircle className="font-md" />
        </Link>
      </div>
    )
  );
};

export default SendManySMS;
