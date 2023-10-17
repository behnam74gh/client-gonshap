import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import "./Notice2.css";

const Notices2 = () => {
  const [newTicketsCount, setNewTicketsCount] = useState(0);
  const [newCommentsCount, setNewCommentsCount] = useState(0);
  const [newSuggestsCount, setNewSuggestsCount] = useState(0);
  const [errorText2, setErrorText2] = useState("");
  const [errorText3, setErrorText3] = useState("");
  const [errorText4, setErrorText4] = useState("");


  const loadNewTicketsCount = (signal) =>
    axios
      .get("/new-tickets/count",{signal})
      .then((response) => {
        if (response.data.success) {
          setNewTicketsCount(response.data.count);
          setErrorText2("");
        }
      })
      .catch((err) => {
        if (err.response) setErrorText2(err.response.data.message);
      });

  const loadNewCommentsCount = (signal) =>
    axios
      .get("/new-comments/count",{signal})
      .then((response) => {
        if (response.data.success) {
          setNewCommentsCount(response.data.count);
          setErrorText3("");
        }
      })
      .catch((err) => {
        if (err.response) setErrorText3(err.response.data.message);
      });

  const loadNewSuggestsCount = (signal) =>
    axios
      .get("/new-suggests/count",{signal})
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
    const ac1 = new AbortController();
    const ac2 = new AbortController();
    const ac3 = new AbortController();
    let mounted = true;
    if (mounted){
      loadNewTicketsCount(ac1.signal);
      loadNewCommentsCount(ac2.signal);
      loadNewSuggestsCount(ac3.signal);
    }
      
    return () => {
      ac1.abort()
      ac2.abort()
      ac3.abort()
      mounted = false;
    }
  }, []);

  return (
    <div className="notice2_wrapper">
      {errorText2.length > 0 ? (
        <p className="warning-message">{errorText2}</p>
      ) : errorText3.length > 0 ? (
        <p className="warning-message">{errorText3}</p>
      ) : (
        errorText4.length > 0 && <p className="warning-message">{errorText4}</p>
      )}

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
