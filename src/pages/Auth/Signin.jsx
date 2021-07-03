import React, { useEffect, useState } from "react";
import Input from "../../components/UI/FormElement/Input";
import Button from "../../components/UI/FormElement/Button";
import ReCAPTCHA from "react-google-recaptcha";
import { VscLoading } from "react-icons/vsc";
import {
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_PASSWORD,
  VALIDATOR_PHONENUMBER,
  VALIDATOR_REQUIRE,
} from "../../util/validators";
import { useForm } from "../../util/hooks/formHook";
import axios from "../../util/axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
} from "../../redux/Types/authTypes";
import { toast } from "react-toastify";
import "./Signin.css";

const Signin = ({ history, location }) => {
  const [remindMe, setRemindMe] = useState(false);
  const [error, setError] = useState("");

  const [expired, setExpired] = useState(false); //must be true-for developing => i set it to false
  const reCaptchaSiteKey = `${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`;

  const dispatch = useDispatch();

  const { loading, userInfo } = useSelector((state) => state.userSignin);

  const registered = location.search ? location.search.split("=")[1] : false;

  const [formState, inputHandler] = useForm(
    {
      phoneNumber: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (userInfo && userInfo.refreshToken) history.push("/");
    }
  }, [history, userInfo]);

  const isAdminBasedRedirect = (userInfo) => {
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (userInfo.isAdmin) {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/dashboard");
      }
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

  const signinHandler = (e) => {
    e.preventDefault();
    dispatch({ type: USER_SIGNIN_REQUEST });
    const { phoneNumber, password } = formState.inputs;
    setError("");
    if (!expired) {
      axios
        .post("/signin", {
          phoneNumber: phoneNumber.value,
          password: password.value,
          saveInfo: remindMe,
        })
        .then((response) => {
          const { success, message, userInfo, remindMe } = response.data;
          if (success) {
            isAdminBasedRedirect(userInfo);
            const { firstName, isAdmin, refreshToken, userId } = userInfo;

            dispatch({
              type: USER_SIGNIN_SUCCESS,
              payload: { firstName, isAdmin, refreshToken, userId },
            });
            if (remindMe) {
              localStorage.setItem(
                "gonshapUserInfo",
                JSON.stringify({
                  firstName,
                  isAdmin,
                  refreshToken,
                  userId,
                })
              );
            }
            toast.success(message);
          }
        })
        .catch((err) => {
          if (typeof err.response.data.message === "object") {
            setError(err.response.data.message[0]);
          } else {
            setError(err.response.data.message);
          }
          dispatch({ type: USER_SIGNIN_FAIL });
        });
    }
  };

  return (
    <div className="auth-section">
      {registered && (
        <h3 className="success-message">
          تبریک میگم! شما عضو خانواده گُنشاپ شدید.
        </h3>
      )}
      <h4>
        برای <strong className="text-blue">ورود</strong> به حساب، اطلاعات زیر را
        وارد کنید!
      </h4>
      <form className="auth-form" onSubmit={signinHandler}>
        <label className="auth-label">
          شماره تلفن :<span className="need_to_fill">*</span>
        </label>
        <Input
          id="phoneNumber"
          element="input"
          type="text"
          placeholder="مثال: 09117025683"
          onInput={inputHandler}
          validators={[
            VALIDATOR_REQUIRE(),
            VALIDATOR_PHONENUMBER(),
            VALIDATOR_MAXLENGTH(11),
            VALIDATOR_MINLENGTH(11),
          ]}
          errorText="شماره باید با 09 شروع شود و درمجموع 11 عدد باشد!"
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
          focusHandler={() => setError("")}
          validators={[VALIDATOR_PASSWORD()]}
          errorText="رمز باید بین 6 تا 14حرف که ترکیبی از حرف بزرگ انگلیسی و عدد و حرف کوچک انگلیسی باشد!"
        />
        <label className="auth-label" id="saveInfo">
          مرا به خاطر بسپار
          <input type="checkbox" onChange={() => setRemindMe(!remindMe)} />
        </label>
        <ReCAPTCHA
          sitekey={reCaptchaSiteKey}
          onChange={changeRecaptchaHandler}
          hl="fa"
          className="recaptcha"
          theme="dark"
        />
        <Button type="submit" disabled={!formState.isValid || expired}>
          {!loading ? "ورود" : <VscLoading className="loader" />}
        </Button>
        {error && <p className="warning-message">{error}</p>}
        <Link to="/forgot-password" className="forgot-pass">
          رمز خود را فراموش کرده اید؟
        </Link>
      </form>
    </div>
  );
};

export default Signin;
