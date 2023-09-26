import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import ReCAPTCHA from "react-google-recaptcha";
import Button from "../../components/UI/FormElement/Button";
import Input from "../../components/UI/FormElement/Input";
import { useForm } from "../../util/hooks/formHook";
import axios from "../../util/axios";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_PHONENUMBER,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PASSWORD,
  VALIDATOR_AUTHNUMBER,
  VALIDATOR_REPEAT_PASSWORD
} from "../../util/validators";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import "./ForgotPassword.css";
import "./Register.css";

const ForgotPassword = ({ history }) => {
  const [phoneNumIsValid, setPhoneNumIsValid] = useState(false);
  const [allowToReqAuthcode, setAllowToReqAuthcode] = useState(false);
  const [authCodeIsValid, setAuthCodeIsValid] = useState(false);
  const [authCodeMessage, setAuthCodeMessage] = useState({
    success: false,
    message: "",
  });
  const [aAuthLoading, setAAuthLoading] = useState(false);
  const [aLoading, setALoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumberMessage, setPhoneNumberMessage] = useState({
    success: false,
    message: "",
  });
  const [nPLoading, setNPLoading] = useState(false);
  const [count, setCount] = useState(180);

  const [expired, setExpired] = useState(true);
  const reCaptchaSiteKey = `${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;

  const [formState, inputHandler] = useForm(
    {
      phoneNumber: {
        value: "",
        isValid: false,
      },
      authCode: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      repeatPassword: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const { userInfo } = useSelector((state) => state.userSignin);

  useEffect(() => {
    userInfo && userInfo.userId && history.push("/");
  }, [history, userInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    count === 0 && setAllowToReqAuthcode(true);

    return () => clearInterval(interval);
  }, [count]);

  const sendPhoneNumberHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/forgot-password-1", {
        phoneNumber: formState.inputs.phoneNumber.value,
      })
      .then((response) => {
        if (response.data.success) {
          setLoading(false);
          toast.success(response.data.message);
          setPhoneNumIsValid(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          setPhoneNumberMessage({
            success: err.response.data.success,
            message: err.response.data.message[0],
          });
        } else {
          setPhoneNumberMessage({
            success: err.response.data.success,
            message: err.response.data.message,
          });
        }
      });
  };

  const sendAuthCodeAgainHandler = () => {
    setAAuthLoading(true);
    if (allowToReqAuthcode) {
      axios
        .post("/send-auth-code-again", {
          phoneNumber: formState.inputs.phoneNumber.value,
        })
        .then((response) => {
          if (response.data.success) {
            setAAuthLoading(false);
            toast.success(response.data.message);
            setPhoneNumIsValid(true);
            setAllowToReqAuthcode(false);
          }
        })
        .catch((err) => {
          setAAuthLoading(false);
          if (typeof err.response.data.message === "object") {
            toast.warning(err.response.data.message[0]);
          } else {
            toast.warning(err.response.data.message);
          }
        });
    } else {
      setAAuthLoading(false);
      toast.warning("کد تایید ارسال شده است");
    }
  };

  const checkValidity = (e) => {
    e.preventDefault();
    setALoading(true);
    axios
      .post("/ckeck-auth-code", {
        phoneNumber: formState.inputs.phoneNumber.value,
        authCode: formState.inputs.authCode.value,
      })
      .then((response) => {
        if (response.data.success) {
          setALoading(false);
          toast.success(response.data.message);
          setAuthCodeIsValid(true);
        }
      })
      .catch((err) => {
        setALoading(false);
        if (typeof err.response.data.message === "object") {
          setAuthCodeMessage({
            success: err.response.data.success,
            message: err.response.data.message[0],
          });
        } else {
          setAuthCodeMessage({
            success: err.response.data.success,
            message: err.response.data.message,
          });
        }
      });
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

  const setNewPasswordToDB = (e) => {
    e.preventDefault();
    setNPLoading(true);
    const { phoneNumber, password, repeatPassword } = formState.inputs;
    if (repeatPassword.value === password.value) {
      axios
        .post("/forgot-password-2", {
          phoneNumber: phoneNumber.value,
          newPassword: password.value,
        })
        .then((response) => {
          if (response.data.success) {
            setNPLoading(false);
            toast.success(response.data.message);
            history.push("/signin");
          }
        })
        .catch((err) => {
          setNPLoading(false);
          if (typeof err.response.data.message === "object") {
            toast.warning(err.response.data.message[0]);
          } else {
            toast.warning(err.response.data.message);
          }
        });
    }
  };

  return (
    <div className="auth-section">
      <Helmet>
        <title>بازگرداندن رمز عبور</title>
      </Helmet>
      {!authCodeIsValid && !phoneNumIsValid && (
        <form className="auth-form" onSubmit={sendPhoneNumberHandler}>
          <h5 className="register_heading">
            شماره
            <strong className="text-blue mx-1"> تلفن همراه </strong>خود را وارد کنید!
          </h5>
          <Input
            id="phoneNumber"
            element="input"
            type="text"
            placeholder="مثال: 5683***0911"
            onInput={inputHandler}
            disabled={phoneNumIsValid}
            focusHandler={() =>
              setPhoneNumberMessage({ success: false, message: "" })
            }
            validators={[
              VALIDATOR_REQUIRE(),
              VALIDATOR_PHONENUMBER(),
              VALIDATOR_MAXLENGTH(11),
            ]}
          />
          <Button
            type="submit"
            disabled={!formState.inputs.phoneNumber.isValid || phoneNumIsValid}
          >
            {!loading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
          {phoneNumberMessage.message.length > 0 &&
            !phoneNumberMessage.success && (
              <p className="warning-message">
                {phoneNumberMessage.message}
                <Link to="/register" className="text-blue mr-1">
                  جهت عضویت کلیک کنید
                </Link>
              </p>
            )}
        </form>
      )}
      {phoneNumIsValid && !authCodeIsValid && (
        <form className="auth-form" onSubmit={checkValidity}>
          <h4>لطفا کد تایید را وارد کنید</h4>
          <Input
            id="authCode"
            element="input"
            type="text"
            placeholder="مثال: 145464"
            onInput={inputHandler}
            disabled={authCodeIsValid}
            validators={[VALIDATOR_AUTHNUMBER()]}
          />
          <div className="auth-code-wrapper">
            <Button
              type="submit"
              disabled={!formState.inputs.authCode.isValid || authCodeIsValid}
            >
              {!aLoading ? "ثبت" : <VscLoading className="loader" />}
            </Button>
            {allowToReqAuthcode ? (
              <Button
                type="button"
                style={{ width: "140px" }}
                disabled={authCodeIsValid || !allowToReqAuthcode}
                onClick={sendAuthCodeAgainHandler}
              >
                {!aAuthLoading ? (
                  "درخواست کد تایید"
                ) : (
                  <VscLoading className="loader" />
                )}
              </Button>
            ) : (
              new Date(count * 1000 - 30 * 3 * 1000).toLocaleTimeString("fa", {
                minute: "numeric",
                second: "numeric",
              })
            )}
            {!authCodeMessage.success && authCodeMessage.message.length > 0 && (
              <p className="warning-message">{authCodeMessage.message}</p>
            )}
          </div>
        </form>
      )}

      {phoneNumIsValid && authCodeIsValid && (
        <form className="auth-form" onSubmit={setNewPasswordToDB}>
          <h4>
            کاربر گرامی <strong className="text-blue">رمز عبور جدید </strong>{" "}
            خود را وارد کنید!
          </h4>
          <label className="auth-label">رمز عبور</label>
          <Input
            id="password"
            element="input"
            type="password"
            placeholder="مثال: 12Ab3a"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE(),VALIDATOR_PASSWORD(),VALIDATOR_MINLENGTH(6)]}
          />
          <label className="auth-label">تکرار رمز عبور</label>
          <Input
            id="repeatPassword"
            element="input"
            type="password"
            placeholder="مثال: 12Ab3a"
            onInput={inputHandler}
            validators={[VALIDATOR_REPEAT_PASSWORD(formState.inputs.password.value),]}
          />
          <ReCAPTCHA
            sitekey={reCaptchaSiteKey}
            onChange={changeRecaptchaHandler}
            theme="dark"
            hl="fa"
            className="recaptcha"
          />
          <Button
            type="submit"
            disabled={
              !formState.inputs.password.isValid || expired ||
              formState.inputs.password.value !== formState.inputs.repeatPassword.value 
            }
          >
            {!nPLoading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
