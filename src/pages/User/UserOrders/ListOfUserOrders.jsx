import React, { useEffect, useLayoutEffect, useState } from "react";
import SingleOrder from "./SingleOrder/SingleOrder";
import axios from "../../../util/axios";
import Pagination from "../../../components/UI/Pagination/Pagination";
import LoadingOrderSkeleton from "../../../components/UI/LoadingSkeleton/LoadingOrderSkeleton";
import "./ListOfUserOrders.css";

const ListOfUserOrders = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLength, setOrdersLength] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(1);
  const [perPage,setPerPage] = useState(12);
  const [status,setStatus] = useState(0)

  useLayoutEffect(() => {
    if(window.innerWidth < 750){
      setPerPage(4)
    }
  }, [])
  
  useEffect(() => {
    setLoading(true);
    const from = history?.location?.state?.from;
    let num = 0;
    if(from !== undefined){
      num = from.slice(from.length-1,from.length);
      setStatus(num)
    }
    axios
      .post("/fetch/user/all-orders", {status: +num, page, perPage })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setOrders(response.data.orders);
          setOrdersLength(response.data.allCount);
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

      return () => {
        setOrdersLength(0)
      }
  }, [page, perPage,history]);

  return (
    <section id="user_orders_page">
      <h4>فهرست سفارش های شما :</h4>
      {loading ? (
        <LoadingOrderSkeleton count={3} />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : orders.length > 0 ? (
        orders.map((order, i) => <SingleOrder key={i} order={order} />)
      ) : (
        <p className="info-message">سفارش {status === 1 ? "جاری" : status === 3 ? "ناموفق" : "تحویل شده"} برای شما ثبت نشده است.</p>
      )}
      {ordersLength > perPage && (
        <Pagination
          perPage={perPage}
          productsLength={ordersLength}
          setPage={setPage}
          page={page}
        />
      )}
    </section>
  );
};

export default ListOfUserOrders;
