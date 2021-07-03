import React, { useState } from "react";
import { VscLoading } from "react-icons/vsc";
import Input from "../../components/UI/FormElement/Input";
import Button from "../../components/UI/FormElement/Button";
import { useForm } from "../../util/hooks/formHook";
import axios from "../../util/axios";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
  VALIDATOR_ENGLISH_NUMERIC,
} from "../../util/validators";
import { useDispatch } from "react-redux";
import { COUPON_APPLIED } from "../../redux/Types/couponTypes";

const CheckoutForms = ({
  cartItems,
  userInfo,
  setAddressSaved,
  setTotalAfterDiscount,
  totalAfterDiscount,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponErrorText, setCouponErrorText] = useState("");
  const [couponSuccessMessage, setCouponSuccessMessage] = useState("");

  const [formState, inputHandler] = useForm(
    {
      address: {
        value: "",
        isValid: false,
      },
      couponName: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const dispatch = useDispatch();

  const setAddressToDBHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    axios
      .post("/save/user/address", { address: formState.inputs.address.value })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setSuccessMessage(response.data.message);
          setAddressSaved(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
        } else {
          setErrorText(err.response.data.message);
        }
      });
  };

  const applyDiscountCouponHandler = (e) => {
    e.preventDefault();
    setCouponLoading(true);
    axios
      .post("/apply-coupon/user/cart", {
        couponName: formState.inputs.couponName.value,
      })
      .then((response) => {
        setCouponLoading(false);
        if (response.data.success) {
          setCouponSuccessMessage(response.data.message);
          setTotalAfterDiscount(response.data.totalAfterDiscount);
          dispatch({ type: COUPON_APPLIED, payload: true });
        }
      })
      .catch((err) => {
        setCouponLoading(false);
        dispatch({ type: COUPON_APPLIED, payload: false });
        if (typeof err.response.data.message === "object") {
          setCouponErrorText(err.response.data.message[0]);
        } else {
          setCouponErrorText(err.response.data.message);
        }
      });
  };

  return (
    <React.Fragment>
      <div className="checkout_form_wrapper">
        <form onSubmit={setAddressToDBHandler}>
          <label className="auth-label">آدرس خود را وارد کنید :</label>
          <Input
            id="address"
            element="input"
            type="text"
            onInput={inputHandler}
            focusHandler={() => {
              setSuccessMessage("");
              setErrorText("");
            }}
            placeholder="مثال : گنبد - خیابان مختوم- کوچه پنجم - پلاک 81"
            validators={[
              VALIDATOR_MAXLENGTH(300),
              VALIDATOR_MINLENGTH(10),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="از علامت ها و عملگر ها استفاده نکنید،میتوانید از 10 تا 300 حرف وارد کنید!"
          />
          <Button
            type="submit"
            disabled={
              !userInfo ||
              !cartItems.length ||
              loading ||
              !formState.inputs.address.isValid
            }
          >
            {!loading ? "ثبت آدرس" : <VscLoading className="loader" />}
          </Button>
        </form>
        {errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : (
          successMessage.length > 0 && (
            <p className="success-message">آدرس شما با موفقیت ثبت شد</p>
          )
        )}
      </div>
      <div className="checkout_form_wrapper">
        <form onSubmit={applyDiscountCouponHandler}>
          <label className="auth-label">
            کد تخفیف را وارد کنید (اگر دارید) :
          </label>
          <Input
            id="couponName"
            element="input"
            type="text"
            onInput={inputHandler}
            focusHandler={() => setCouponErrorText("")}
            disabled={couponSuccessMessage.length > 0 || totalAfterDiscount > 0}
            validators={[
              VALIDATOR_MAXLENGTH(20),
              VALIDATOR_MINLENGTH(6),
              VALIDATOR_ENGLISH_NUMERIC(),
            ]}
            errorText="با حروف انگلیسی وارد کنید و از علامت ها و عملگرها استفاده نکنید؛ میتوانید از 6 تا 20 حرف وارد کنید!"
          />
          <Button
            type="submit"
            disabled={
              !userInfo ||
              !cartItems.length ||
              loading ||
              !formState.inputs.couponName.isValid ||
              couponSuccessMessage.length > 0 ||
              totalAfterDiscount > 0
            }
          >
            {!couponLoading ? (
              "اعمالِ کد تخفیف"
            ) : (
              <VscLoading className="loader" />
            )}
          </Button>
        </form>
        {couponErrorText.length > 0 ? (
          <p className="warning-message">{couponErrorText}</p>
        ) : (
          couponSuccessMessage.length > 0 && (
            <p className="success-message">{couponSuccessMessage}</p>
          )
        )}
      </div>
    </React.Fragment>
  );
};

export default CheckoutForms;
