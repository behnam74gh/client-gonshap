import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import axios from "../../../util/axios";
import { 
  VALIDATOR_MINLENGTH,
  VALIDATOR_PASSWORD,
  VALIDATOR_REPEAT_PASSWORD,
  VALIDATOR_REQUIRE
} from "../../../util/validators";
import { useForm } from "../../../util/hooks/formHook";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import { useSelector } from "react-redux";

const ChangeUserPassword = ({ history }) => {
  const [expired, setExpired] = useState(true);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.userSignin);

  const reCaptchaSiteKey = `${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;

  const [formState, inputHandler] = useForm(
    {
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

  const changeRecaptchaHandler = (value) => {
    if (value !== null) {
      setCaptchaLoading(true);
      axios
        .post("/recaptcha", { securityToken: value })
        .then((res) => {
          setCaptchaLoading(false);
          if (res.data.success) {
            setExpired(false);
          }
        })
        .catch((err) => {
          setCaptchaLoading(false);
          if (err || err.response) {
            toast.warning("خطایی رخ داده است،لطفا اینترنت خود را چک کنید");
          }
        });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const { password, repeatPassword } = formState.inputs;
    setLoading(true);
    if (!expired && repeatPassword.value === password.value) {
      axios
        .put("/user/change-password", { newPassword: password.value })
        .then((response) => {
          setLoading(false);
          if (response.data.success) {
            toast.success(response.data.message);
            setExpired(true);
            if (userInfo.role === 1) {
              history.push("/admin/dashboard/home");
            } else if (userInfo.role === 2) {
              history.push('/store-admin/dashboard/home')
            } else {
              history.push("/user/dashboard/home");
            }
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
    }
  };

  const grecaptchaObject = window.grecaptcha;

  return (
    <div className="admin-panel-wrapper">
      <h4>تغییر رمز عبور</h4>
      <form className="auth-form" onSubmit={submitHandler}>
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
          validators={[
            VALIDATOR_REPEAT_PASSWORD(formState.inputs.password.value),
          ]}
        />
        <label className="auth-label">تصاویر مرتبط را انتخاب کنید : </label>
        <ReCAPTCHA
          sitekey={reCaptchaSiteKey}
          onChange={changeRecaptchaHandler}
          className="recaptcha"
          hl="fa"
          theme="dark"
          onExpired={() => setExpired(true)}
          grecaptcha={grecaptchaObject}
        />
        <Button
          type="submit"
          disabled={!formState.isValid || expired || captchaLoading || loading ||
            formState.inputs.password.value !== formState.inputs.repeatPassword.value
          }
        >
          {(captchaLoading || loading) ? <VscLoading className="loader" /> : "ثبت"}
        </Button>
      </form>
    </div>
  );
};

export default ChangeUserPassword;
