import React, { useEffect, useState } from "react";
import { IoArrowUndoCircle } from "react-icons/io5";
import { VscLoading } from "react-icons/vsc";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";
import "./SendSMS.css";

const SMSDetails = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [message, setMessage] = useState({});

  const { id } = match.params;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/read/sms/${id}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setMessage(response.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, [id]);

  return (
    <div className="admin-panel-wrapper">
      <h4>جزئیات این پیامک</h4>
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <div className="d-flex-around mb-2">
          <p className="font-sm">
            جزئیات پیامک با کد رهگیری{" "}
            <strong className="text-blue">{message.groupId}</strong>
          </p>
          <Link
            to="/admin/dashboard/send-sms"
            className="create-new-slide-link"
          >
            <span className="sidebar-text-link">بازگشت به فهرست پیامک ها</span>
            <IoArrowUndoCircle className="font-md" />
          </Link>
        </div>
      )}
      {loading ? (
        <VscLoading className="loader" />
      ) : (
        <div className="w-100">
          <p className="text-muted">
            دسته بندی :&nbsp;
            <strong className="text-blue font-sm">
              {message.level === "one"
                ? "فقط به یک کاربر ارسال شده است."
                : message.level === "many"
                ? "به چند کاربر خاص ارسال شده است."
                : "به همه گُنشاپی ها ارسال شده است."}
            </strong>
          </p>
          <p className="text-muted">
            وضعیت ارسال پیامک :&nbsp;
            <strong
              className={
                message.sentStatusCode === "1"
                  ? "success-message font-sm"
                  : message.sentStatusCode === "2"
                  ? "font-sm text-blue"
                  : "warning-message font-sm"
              }
            >
              {message.sentStatusCode === "1"
                ? "پیامک ارسال شده است."
                : message.sentStatusCode === "2"
                ? "پیامک در صف میباشد."
                : message.sentStatusCode === "3"
                ? "پیامک فیلتر شده است!"
                : "وضعیت ارسال پیامک هنوز مشخص نیست!"}
            </strong>
          </p>
          <p className="message-content">
            محتوای پیامک:{" "}
            <strong className="font-sm">{message.messageContent}</strong>
          </p>
          <div className="table-wrapper">
            <table>
              <thead className="heading-table font-sm">
                <tr>
                  <th>شماره تلفن کاربر</th>
                  <th>وضعیت تحویل پیامک</th>
                </tr>
              </thead>
              <tbody>
                {message.receivedStatusCodes &&
                  message.receivedStatusCodes.map((sms, index) => (
                    <tr key={index}>
                      <td className="font-sm">0{sms.mobile}</td>
                      <td className="font-sm">{sms.receivedStatus}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMSDetails;
