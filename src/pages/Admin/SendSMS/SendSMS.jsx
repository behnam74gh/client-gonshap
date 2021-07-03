import React, { useEffect, useState } from "react";
import {
  RiMailVolumeLine,
  RiMailSendLine,
  RiMailAddLine,
} from "react-icons/ri";
import { Link } from "react-router-dom";

import axios from "../../../util/axios";
import ListOfSentSMS from "../../../components/AdminDashboardComponents/ListOfSentSMS";
import "./SendSMS.css";

const SendSMS = () => {
  const [amount, setAmount] = useState();
  const [prices, setPrices] = useState();
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    axios
      .get("/web-service/amount")
      .then((response) => {
        if (response.data.success) {
          setAmount(response.data.amount);
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get("/web-service/price/per-sms")
      .then((response) => {
        if (response.data.success) {
          setPrices(response.data.prices);
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  return (
    <div className="admin-panel-wrapper">
      <h4>ارسال پیامک به کاربران</h4>
      <div className="d-flex-evenly mt-3">
        <Link to="/admin/dashboard/one" className="create-new-slide-link">
          <span className="sidebar-text-link">ارسال تکی</span>
          <RiMailAddLine className="font-md" />
        </Link>
        <Link to="/admin/dashboard/many" className="create-new-slide-link">
          <span className="sidebar-text-link">ارسال چندتایی</span>
          <RiMailSendLine className="font-md" />
        </Link>
        <Link to="/admin/dashboard/to-all" className="create-new-slide-link">
          <span className="sidebar-text-link">ارسال به همه</span>
          <RiMailVolumeLine className="font-md" />
        </Link>
      </div>
      <hr />
      <div className="d-flex-evenly">
        {errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : (
          <h5>
            موجودی حساب:{" "}
            <strong className="text-blue">
              {amount ? amount.toLocaleString("fa") : "0"}&nbsp;ریال
            </strong>
          </h5>
        )}
        {prices && (
          <h5>
            تعرفه پیامک فارسی
            <strong className="text-blue mr-1">
              {prices && prices.fa}&nbsp;ریال{" "}
            </strong>
            انگلیسی
            <strong className="text-blue mr-1">
              {prices && prices.en}&nbsp;ریال
            </strong>
          </h5>
        )}
      </div>
      <ListOfSentSMS />
    </div>
  );
};

export default SendSMS;
