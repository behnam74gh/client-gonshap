import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { Calendar, DateObject } from "react-multi-date-picker";

import axios from "../../../util/axios";
import { useForm } from "../../../util/hooks/formHook";
import {
  VALIDATOR_SPECIAL_CHARACTERS,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
  VALIDATOR_ENGLISH_NUMERIC,
  VALIDATOR_PERSIAN_ALPHABET,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import "../ToDo/ToDo.css";

const Coupons = () => {
  const [reRenderParent, setReRenderParent] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState();

  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      reason: {
        value: "",
        isValid: false,
      },
      couponCount: {
        value: "",
        isValid: false,
      },
      couponPrice: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    setReRenderParent(true);
  }, [reRenderParent]);

  const loadAllCoupons = () =>
    axios
      .get("/coupons-list")
      .then((response) => {
        if (response.data.success) {
          setCoupons(response.data.listOfCoupons);
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });

  useEffect(() => {
    loadAllCoupons();
  }, []);

  const setDateHandler = (value) => {
    if (value instanceof DateObject) value = value.toDate();
    setDate(value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    setLoading(true);
    axios
      .post("/coupon/create", {
        name: formState.inputs.name.value,
        reason: formState.inputs.reason.value,
        couponCount: formState.inputs.couponCount.value,
        couponPrice: formState.inputs.couponPrice.value,
        expiryDate: date.toISOString(),
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setDate(null);
          loadAllCoupons();
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

  const removeCouponHandler = (id) => {
    if (window.confirm("برای حذف این کد تخفیف مطئن هستید؟")) {
      axios
        .delete(`/coupon-delete/${id}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            loadAllCoupons();
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    }
  };

  const couponStatusChangeHandler = (status, id) => {
    let couponStatus = status ? false : true;
    axios
      .put(`/coupon/active-status/${id}`, { couponStatus })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          loadAllCoupons();
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  };

  return (
    <div className="admin-panel-wrapper">
      <h4>ایجاد تخفیف</h4>
      {reRenderParent && (
        <form className="auth-form" onSubmit={submitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            placeholder="نام کوپن : "
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(20),
              VALIDATOR_MINLENGTH(6),
              VALIDATOR_ENGLISH_NUMERIC(),
            ]}
            errorText="با حروف انگلیسی وارد کنید و از علامت ها و عملگرها استفاده نکنید؛ میتوانید از 6 تا 20 حرف وارد کنید!"
          />
          <Input
            id="reason"
            element="input"
            type="text"
            placeholder="مناسبتِ کوپن : "
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(80),
              VALIDATOR_MINLENGTH(5),
              VALIDATOR_PERSIAN_ALPHABET(),
            ]}
            errorText="به فارسی وارد کنید و از علامت ها و عملگرها استفاده نکنید؛ میتوانید از 5 تا 80 حرف وارد کنید!"
          />
          <Input
            id="couponCount"
            element="input"
            type="number"
            placeholder="تعداد محدودیت (اجباری نیست) :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAX(150),
              VALIDATOR_MIN(1),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="از علامت ها و عملگرها استفاده نکنید؛ تعداد باید بین 1 تا 150 باشد!"
          />
          <Input
            id="couponPrice"
            element="input"
            type="number"
            placeholder="قیمت کوپن :"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(8),
              VALIDATOR_MINLENGTH(5),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="از علامت ها و عملگرها استفاده نکنید؛ مبلغ تخفیف باید بین 5 رقم تا 8 رقم باشد!"
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
            <Button
              type="submit"
              disabled={!formState.isValid || !date || typeof date !== "object"}
            >
              {!loading ? "ثبت" : <VscLoading className="loader" />}
            </Button>
          </div>
        </form>
      )}
      <hr />
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <h5>لیست کدهای تخفیف موجود</h5>
      )}
      <div className="w-100">
        {coupons.length > 0 &&
          coupons.map((c, i) => (
            <div className="task-wrapper" key={i}>
              <span className="font-sm">{c.name}</span>
              <div className="tasks-options-wrapper">
                <span
                  className="d-flex-center-center"
                  onClick={() => removeCouponHandler(c._id)}
                >
                  <MdDelete className="text-red" />
                </span>
                <input
                  type="checkbox"
                  className="check-task-status"
                  value={c.activeCoupon}
                  checked={c.activeCoupon ? true : false}
                  onChange={() =>
                    couponStatusChangeHandler(c.activeCoupon, c._id)
                  }
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Coupons;
