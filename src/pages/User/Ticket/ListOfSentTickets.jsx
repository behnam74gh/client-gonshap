import React, { useEffect, useState } from "react";
import LoadingOrderSkeleton from "../../../components/UI/LoadingSkeleton/LoadingOrderSkeleton";
import Pagination from "../../../components/UI/Pagination/Pagination";
import axios from "../../../util/axios";

const ListOfSentTickets = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState();
  const [ticketsLength, setTicketsLength] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    axios
      .post("/fetch/user/all-tickets", { page, perPage })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setTickets(response.data.myTickets);
          setTicketsLength(response.data.allCount);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
        } else {
          setErrorText(err.response.data.message);
        }
      });
  }, [page, perPage]);

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
        <LoadingOrderSkeleton count={3} />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (tickets?.length > 0 ? tickets.map((t) => (
          <div key={t._id} className="ticket-wrapper">
            <div className="ticket-titles-wrapper">
              <span className="font-sm">
                موضوع تیکت :{" "}
                <strong className="text-blue">
                  {spreadStatusInSelect(t.status)}
                </strong>
              </span>
              <span className="font-sm">
                بررسی :
                <strong className="text-blue mx-2">
                  {t.visited ? "شد" : "نشده است"}
                </strong>
              </span>
              <span className="font-sm">
                تاریخ ارسال :
                <strong className="text-blue mx-1">
                  {new Date(t.createdAt).toLocaleDateString("fa-IR")}
                </strong>
              </span>
            </div>
            <div className="ticket-body-wrapper">
              <div className="ticket-body">
                <p>{t.content}</p>
              </div>
              {t.image && t.image.length > 0 && (
                <div className="ticket-image">
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${t.image}`}
                    alt={t.status}
                    className="w-100"
                  />
                </div>
              )}
            </div>
            {t.visited && (
              <div className="answer-wrapper">
                <span className="font-sm">
                  تاریخ پاسخ دهی :
                  <strong className="mx-1">
                    {new Date(t.updatedAt).toLocaleDateString("fa-IR")}
                  </strong>
                </span>
                <div className="ticket-body">
                  <p>{t.answer}</p>
                </div>
                {t.answerImage && t.answerImage.length > 0 && (
                  <div className="ticket-image">
                    <img
                      src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${t.answerImage}`}
                      alt={t.status}
                      className="w-100"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )) : (
          <p className="info-message">شما تیکت ارسال شده ندارید</p>
        )
      )}
      {ticketsLength > perPage && (
        <Pagination
          perPage={perPage}
          productsLength={ticketsLength}
          setPage={setPage}
          page={page}
        />
      )}
    </React.Fragment>
  );
};

export default ListOfSentTickets;
