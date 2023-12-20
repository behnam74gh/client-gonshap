import React, { useEffect, useState } from "react";
import LoadingOrderSkeleton from "../../../components/UI/LoadingSkeleton/LoadingOrderSkeleton";
import axios from "../../../util/axios";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOMER_LAST_TICKETS } from "../../../redux/Types/ttlDataTypes";
import '../Ticket/Ticket.css'

const LastTicket = () => {
  const [ticket, setTicket] = useState();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const { customerLastTicket } = useSelector(state => state.ttlDatas);
  const dispatch = useDispatch();

  useEffect(() => {
    if(Date.now() > customerLastTicket.ttlTime){
      setLoading(true);
      axios
        .get("/get/user/last-ticket")
        .then((response) => {
          setLoading(false);
          if (response.data.success) {
            setTicket(response.data.lastTicket);
            setErrorText("");
            dispatch({
              type: CUSTOMER_LAST_TICKETS,
              payload: {
                ttlTime : Date.now()+(1000*60*60*24),
                data: response.data.lastTicket
              }
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            setErrorText(err.response.data.message);
          }
        });
    }else{
      if(customerLastTicket.data !== null){
        setTicket(customerLastTicket.data);
      }
    }
  }, []);

  const spreadStatusInSelect = (s) => {
    let status;
    switch (s) {
      case 1:
        status = "فرایند خرید (ایجاد سفارش)";
        break;
      case 2:
        status = "پرداخت الکترونیکی";
        break;
      case 3:
        status = "پرداخت در محل";
        break;
      case 4:
        status = "بازگشت وجه";
        break;
      case 5:
        status = "پس فرستادن کالا";
        break;
      case 6:
        status = "نحوه تحویل کالا";
        break;
      case 7:
        status = "کیفیت کالا";
        break;
      case 8:
        status = "قیمت کالا";
        break;
      case 9:
        status = "ویرایش اطلاعات حساب کاربری";
        break;
      default:
        return;
    }
    return status;
  };

  return (
    <React.Fragment>
      {loading ? (
        <div className="w-100" style={{background: "#FFF"}}>
          <LoadingOrderSkeleton count={1} />
        </div>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : ticket && ticket.sender.firstName.length > 0 ? (
        <div className="ticket-wrapper">
          <div className="ticket-titles-wrapper">
            <span className="font-sm">
              موضوع تیکت :{" "}
              <strong className="text-blue">
                {spreadStatusInSelect(ticket.status)}
              </strong>
            </span>
            <span className="font-sm">
              رسیدگی :
              <strong className="text-blue mx-2">
                {ticket.visited ? "شد" : "نشده است"}
              </strong>
            </span>
            <span className="font-sm">
              تاریخ ارسال :
              <strong className="text-blue mx-1">
                {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
              </strong>
            </span>
          </div>
          <div className="ticket-body-wrapper">
            <div className="ticket-body">
              <p>{ticket.content}</p>
            </div>
            {ticket.image && ticket.image.length > 0 && (
              <div className="ticket-image">
                <img
                  src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ticket.image}`}
                  alt={ticket.status}
                  className="w-100"
                />
              </div>
            )}
          </div>
          {ticket.visited && (
            <div className="answer-wrapper">
              <span className="font-sm">
                تاریخ پاسخ دهی :
                <strong className="mx-1">
                  {new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}
                </strong>
              </span>
              <div className="ticket-body">
                <p>{ticket.answer}</p>
              </div>
              {ticket.answerImage && ticket.answerImage.length > 0 && (
                <div className="ticket-image">
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ticket.answerImage}`}
                    alt={ticket.status}
                    className="w-100"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="info-message w-100 text-center">
          شما تیکت ارسال شده ای ندارید
        </p>
      )}
    </React.Fragment>
  );
};

export default LastTicket;
