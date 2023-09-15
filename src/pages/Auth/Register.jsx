import React, { useEffect, useState } from "react";
import Input from "../../components/UI/FormElement/Input";
import Button from "../../components/UI/FormElement/Button";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "../../util/axios";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PHONENUMBER,
  VALIDATOR_PERSIAN_ALPHABET,
  VALIDATOR_AUTHNUMBER,
  VALIDATOR_PASSWORD,
} from "../../util/validators";
import { useForm } from "../../util/hooks/formHook";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import "./Register.css";

const Register = ({ history }) => {
  const [phoneNumIsValid, setPhoneNumIsValid] = useState(false);
  const [phoneNumberMessage, setPhoneNumberMessage] = useState({
    success: false,
    message: "",
  });
  const [pLoading, setPLoading] = useState(false);
  const [authCodeIsValid, setAuthCodeIsValid] = useState(false);
  const [authCodeMessage, setAuthCodeMessage] = useState({
    success: false,
    message: "",
  });
  const [aLoading, setALoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowToReqAuthcode, setAllowToReqAuthcode] = useState(false);
  const [aAuthLoading, setAAuthLoading] = useState(false);
  const [registerErrMessage, setRegisterErrMessage] = useState("");
  const [expired, setExpired] = useState(false);
  const [count, setCount] = useState(180);

  // const reCaptchaSiteKey = `${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;

  const [formState, inputHandler] = useForm(
    {
      phoneNumber: {
        value: "",
        isValid: true,
      },
      authCode: {
        value: "",
        isValid: true,
      },
      firstName: {
        value: "",
        isValid: false,
      },
      lastName: {
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
    userInfo && userInfo.refreshToken && history.push("/");
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
    // setPLoading(true);
    setAuthCodeIsValid(true)
    setPhoneNumIsValid(true)

    // axios
    //   .post("/check-phone-number", {
    //     phoneNumber: formState.inputs.phoneNumber.value,
    //   })
    //   .then((response) => {
    //     if (response.data.success) {
    //       setPLoading(false);
    //       toast.success(response.data.message);
    //       setPhoneNumIsValid(true);
    //     }
    //   })
    //   .catch((err) => {
    //     setPLoading(false);
    //     if (typeof err.response.data.message === "object") {
    //       setPhoneNumberMessage({
    //         success: err.response.data.success,
    //         message: err.response.data.message[0],
    //       });
    //     } else {
    //       setPhoneNumberMessage({
    //         success: err.response.data.success,
    //         message: err.response.data.message,
    //       });
    //     }
    //   });
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
            setCount(180);
            toast.success(response.data.message);
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

  const submitRegisterInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { firstName, lastName, phoneNumber, password, repeatPassword } =
      formState.inputs;
    if (repeatPassword.value === password.value) {
      axios
        .post("/register", {
          firstName: firstName.value,
          lastName: lastName.value,
          phoneNumber: phoneNumber.value,
          password: password.value,
        })
        .then((respose) => {
          if (respose.data.success) {
            setLoading(false);
            history.push(`/signin?registered=${true}`);
          }
        })
        .catch((err) => {
          setLoading(false);
          if (typeof err.response.data.message === "object") {
            setRegisterErrMessage(err.response.data.message[0]);
          } else {
            setRegisterErrMessage(err.response.data.message);
          }
        });
    }
  };

  return (
    <div className="auth-section">
      <Helmet>
        <title>صفحه ثبت نام</title>
      </Helmet>
      {!phoneNumIsValid && (
        <form className="auth-form" onSubmit={sendPhoneNumberHandler}>
          <h5 className="register_heading">
            جهت عضویت شماره
            <strong className="text-blue mx-1"> تلفن همراه </strong> خود را وارد
            کنید
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
              VALIDATOR_MINLENGTH(11),
            ]}
            errorText="شماره باید با 09 شروع شود و درمجموع 11 عدد باشد!"
          />
          <Button
            type="submit"
            disabled={!formState.inputs.phoneNumber.isValid || phoneNumIsValid}
          >
            {!pLoading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
          {phoneNumberMessage.success &&
            phoneNumberMessage.message.length > 0 && (
              <p className="warning-message">{phoneNumberMessage.message}</p>
            )}
        </form>
      )}
      {!authCodeIsValid && phoneNumIsValid && (
        <form className="auth-form" onSubmit={checkValidity}>
          <h5 className="register_heading">کد تایید را وارد کنید</h5>
          <Input
            id="authCode"
            element="input"
            type="text"
            placeholder="مثال: 145464"
            onInput={inputHandler}
            disabled={authCodeIsValid}
            focusHandler={() =>
              setAuthCodeMessage({ success: false, message: "" })
            }
            validators={[VALIDATOR_AUTHNUMBER()]}
            errorText="کد تایید صحیح نمی باشد!"
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
              new Date(count * 1000 - 30 * 60 * 1000).toLocaleTimeString("fa", {
                minute: "numeric",
                second: "numeric",
              })
            )}
          </div>
          {authCodeMessage.message.length > 0 && (
            <p className="warning-message">{authCodeMessage.message}</p>
          )}
        </form>
      )}
      {authCodeIsValid && (
        <form className="auth-form" onSubmit={submitRegisterInfo}>
          <h5 className="register_heading">تکمیل فرم عضویت</h5>
          <label className="auth-label">
            نام :<span className="need_to_fill">*</span>
          </label>
          <Input
            id="firstName"
            element="input"
            type="text"
            placeholder="مثال: بهنام"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(20),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_PERSIAN_ALPHABET(),
            ]}
            errorText="لطفا به فارسی وارد کنید!"
          />
          <label className="auth-label">
            نام خانوادگی :<span className="need_to_fill">*</span>
          </label>
          <Input
            id="lastName"
            element="input"
            type="text"
            placeholder="مثال: قزاقی"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(25),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_PERSIAN_ALPHABET(),
            ]}
            errorText="لطفا به فارسی وارد کنید!"
          />
          <label className="auth-label">
            رمز عبور :<span className="need_to_fill">*</span>
          </label>
          <Input
            id="password"
            element="input"
            type="password"
            placeholder="مثال: 12Ab3a"
            onInput={inputHandler}
            validators={[VALIDATOR_PASSWORD()]}
            errorText="رمز باید بین 6 تا 14حرف که ترکیبی از حرف بزرگ انگلیسی و عدد و حرف کوچک انگلیسی باشد!"
          />
          <label className="auth-label">
            تکرار رمز :<span className="need_to_fill">*</span>
          </label>
          <Input
            id="repeatPassword"
            element="input"
            type="password"
            placeholder="مثال: 12Ab3a"
            onInput={inputHandler}
            validators={[VALIDATOR_PASSWORD()]}
            errorText="دقیقا همان رمز را تکرارکنید!"
          />
        {/* <ReCAPTCHA
          sitekey={reCaptchaSiteKey}
          onChange={changeRecaptchaHandler}
          theme="dark"
          hl="fa"
          className="recaptcha"
        /> */}
          <Button
            type="submit"
            disabled={
              !formState.isValid ||
              formState.inputs.password.value !==
                formState.inputs.repeatPassword.value 
            }
          >
            {!loading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
          {registerErrMessage.length > 0 && (
            <p className="warning-message">{registerErrMessage}</p>
          )}
        </form>
      )}
    </div>
  );
};

export default Register;
