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
  UPDATE_DASHBOARD_IMAGE,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
} from "../../redux/Types/authTypes";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { getCookie } from "../../util/customFunctions";
import "./Signin.css";

const Signin = ({ history, location }) => {
  const [remindMe, setRemindMe] = useState(false);
  const [error, setError] = useState("");
  
  const [expired, setExpired] = useState(true);
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
      if (userInfo && userInfo.userId) history.push("/");
    }
  }, [history, userInfo]);

  const roleBasedRedirect = (role) => {
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (role === 1) {
        history.push("/admin/dashboard/home");
      } else if (role === 2) {
        history.push('/store-admin/dashboard/home')
      } else {
        history.push("/user/dashboard/home");
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
    
    axios
      .post("/signin", {
        phoneNumber: phoneNumber.value,
        password: password.value,
        saveInfo: remindMe,
      })
      .then((response) => {
        if (response.data.success) {
          const { firstName, avatar, role, isBan, userId, supplierFor, csrfToken } =  getCookie('userInfoBZ');
          
          dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: { firstName, role, isBan, supplierFor, userId, csrfToken },
          });
          dispatch({ type: UPDATE_DASHBOARD_IMAGE, payload: avatar });

          roleBasedRedirect(role);
        }else{
          setError('ارتباط با سرور برقرار نشد')
          dispatch({ type: USER_SIGNIN_FAIL });
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
  };

  return (
    <div className="auth-section">
      <Helmet>
        <title>صفحه ورود</title>
      </Helmet>
      {registered && (
        <h3 className="success-message">
          تبریک! شما عضو خانواده بازارچک شدید.
        </h3>
      )}
      {history?.location?.state?.from.includes('/product/details/') ? 
      <span className="back_to_product_text" style={{fontSize: "14px"}}>جهت ثبت دیدگاه یا امتیازدهی به محصول ابتدا باید وارد حساب کاربری شوید</span>
       :<h4>
        برای <strong className="text-blue">ورود</strong> به حساب، اطلاعات زیر را
        وارد کنید!
      </h4>}
      <form className="auth-form" onSubmit={signinHandler}>
        <label className="auth-label">
          شماره تلفن :<span className="need_to_fill">*</span>
        </label>
        <Input
          id="phoneNumber"
          element="input"
          type="text"
          placeholder="مثال: 5683***0911"
          onInput={inputHandler}
          validators={[
            VALIDATOR_REQUIRE(),
            VALIDATOR_PHONENUMBER(),
            VALIDATOR_MAXLENGTH(11),
          ]}
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
          validators={[VALIDATOR_REQUIRE(),VALIDATOR_PASSWORD(),VALIDATOR_MINLENGTH(6)]}
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
          onExpired={() => setExpired(true)}
        />
        <Button type="submit" disabled={!formState.isValid || loading || expired}>
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
