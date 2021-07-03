import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import SingleOrder from "../UserOrders/SingleOrder/SingleOrder";
import LoadingOrderSkeleton from "../../../components/UI/LoadingSkeleton/LoadingOrderSkeleton";
import "./UserDashboardHome.css";

const LastOrder = () => {
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState({});
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/fetch/user/last-orders")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setLastOrder(response.data.lastOrder);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  return (
    <section id="last_orders">
      {loading ? (
        <LoadingOrderSkeleton count={1} />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : lastOrder && lastOrder._id && lastOrder._id.length > 0 ? (
        <SingleOrder order={lastOrder} />
      ) : (
        <p className="info-message w-100 text-center">
          سفارشی برای شما ثبت نشده است.
        </p>
      )}
    </section>
  );
};

export default LastOrder;
