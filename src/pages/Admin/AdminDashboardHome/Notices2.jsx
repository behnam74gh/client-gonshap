import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import "./Notices.css";

const Notices2 = () => {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newTicketsCount, setNewTicketsCount] = useState(0);
  const [newCommentsCount, setNewCommentsCount] = useState(0);
  const [newSuggestsCount, setNewSuggestsCount] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [errorText2, setErrorText2] = useState("");
  const [errorText3, setErrorText3] = useState("");
  const [errorText4, setErrorText4] = useState("");

  const loadNewOrdersCount = () =>
    axios
      .post("/new-orders/count",{category: null})
      .then((response) => {
        if (response.data.success) {
          setNewOrdersCount(response.data.count);
          setErrorText("");
        }
      })
      .catch((err) => {
        if (err.response) setErrorText(err.response.data.message);
      });

  const loadNewTicketsCount = () =>
    axios
      .get("/new-tickets/count")
      .then((response) => {
        if (response.data.success) {
          setNewTicketsCount(response.data.count);
          setErrorText2("");
        }
      })
      .catch((err) => {
        if (err.response) setErrorText2(err.response.data.message);
      });

  const loadNewCommentsCount = () =>
    axios
      .get("/new-comments/count")
      .then((response) => {
        if (response.data.success) {
          setNewCommentsCount(response.data.count);
          setErrorText3("");
        }
      })
      .catch((err) => {
        if (err.response) setErrorText3(err.response.data.message);
      });

  const loadNewSuggestsCount = () =>
    axios
      .get("/new-suggests/count")
      .then((response) => {
        if (response.data.success) {
          setNewSuggestsCount(response.data.count);
          setErrorText4("");
        }
      })
      .catch((err) => {
        if (err.response) setErrorText4(err.response.data.message);
      });

  useEffect(() => {
    loadNewOrdersCount();
    loadNewTicketsCount();
    loadNewCommentsCount();
    loadNewSuggestsCount();
  }, []);

  return (
    <div className="notice2_wrapper">
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : errorText2.length > 0 ? (
        <p className="warning-message">{errorText2}</p>
      ) : errorText3.length > 0 ? (
        <p className="warning-message">{errorText3}</p>
      ) : (
        errorText4.length > 0 && <p className="warning-message">{errorText4}</p>
      )}
      <div className="notice_2">
        <span>سفارش های جدید :</span>
        <strong>{newOrdersCount}</strong>
      </div>
      <div className="notice_2">
        <span>تیکت های جدید :</span>
        <strong>{newTicketsCount}</strong>
      </div>
      <div className="notice_2">
        <span>نظرات جدید :</span>
        <strong>{newCommentsCount}</strong>
      </div>
      <div className="notice_2">
        <span>پیشنهادات جدید :</span>
        <strong>{newSuggestsCount}</strong>
      </div>
    </div>
  );
};

export default Notices2;
