import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { Calendar, DateObject } from "react-multi-date-picker";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../util/axios";
import { useForm } from "../../../util/hooks/formHook";
import {
  VALIDATOR_SPECIAL_CHARACTERS,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import "./ToDo.css";

const ToDoCreate = () => {
  const [reRenderParent, setReRenderParent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState();

  const {userInfo : {role}} = useSelector(state => state.userSignin)

  const [formState, inputHandler] = useForm(
    {
      taskContent: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setReRenderParent(true);
  }, [reRenderParent]);

  const setDateHandler = (value) => {
    if (value instanceof DateObject) value = value.toDate();
    setDate(value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (date === null || date === undefined) {
      return toast.warning("تاریخ یادداشت را مشخص کنید");
    }

    setLoading(true);
    axios
      .post("/todo/create", {
        taskContent: formState.inputs.taskContent.value,
        taskDate: date.toISOString(),
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setDate(null);
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
        <h4>جهت ایجاد یادداشت محتوا و تاریخ را تعیین کنید</h4>
        <form className="auth-form" onSubmit={submitHandler}>
          <Input
            id="taskContent"
            element="input"
            type="text"
            placeholder="محتوای یادداشت :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(400),
              VALIDATOR_MINLENGTH(8),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="از علامت ها و عملگرها استفاده نکنید؛ میتوانید از 8 تا 400 حرف وارد کنید!"
          />
          <div className="d-flex-center-center">
            <Calendar
              value={date}
              onChange={setDateHandler}
              locale="fa"
              calendar="persian"
              className="calendar-margin"
            />
          </div>
          <div className="d-flex-center-center">
            <Button type="submit" disabled={!formState.isValid}>
              {!loading ? "ثبت" : <VscLoading className="loader" />}
            </Button>
          </div>
        </form>
        <Link className="font-sm text-blue" to={`/${role === 2 ? "store-admin" : "admin"}/dashboard/todo`}>
          برو به لیست یادداشت ها
        </Link>
      </div>
    )
  );
};

export default ToDoCreate;
