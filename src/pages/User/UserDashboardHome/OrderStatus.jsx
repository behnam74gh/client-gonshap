import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import LoadingOrderSkeleton from "../../../components/UI/LoadingSkeleton/LoadingOrderSkeleton";
import { Link,useHistory } from "react-router-dom";
import { ReactComponent as ProcessingSvg } from '../../../assets/images/status-processing.svg';
import { ReactComponent as DeliveredSvg } from '../../../assets/images/status-delivered.svg';
import { ReactComponent as ReturnedSvg } from '../../../assets/images/status-returned.svg';
import "./OrderStatus.css";

const OrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [ordersStatus, setOrdersStatus] = useState({});
  const [errorText, setErrorText] = useState("");

  const history = useHistory()

  useEffect(() => {
    setLoading(true);
    axios
      .get("/fetch/user/last-orders")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setOrdersStatus(response.data.ordersCount);
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

  const pushToOrdersListHandler = (statusNumber) => {
    history.push({
      pathname: "/user/dashboard/orders",
      state: {
        from: `/user/dashboard/home/${statusNumber}`,
      },
    });
  }

  return (
    <section id="order_status_wrapper">
      {loading ? (
        <LoadingOrderSkeleton count={1} />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : ordersStatus?.activeOrders ? (
        <>
          <div className="orders_title_wrapper">
            <h5 className="my-0">سفارش های من</h5>
            <Link to='/user/dashboard/orders' className='text-blue font-sm'>مشاهده همه</Link>
          </div>
          <div className="status_wrapper">
            <div className="status_of_orders">

              <div className="status_info_wrapper">
                <ProcessingSvg style={{cursor: "pointer"}} onClick={() => pushToOrdersListHandler(1)} />
                <div className="status_info">
                  <span className="order_count">{ordersStatus.activeOrders} سفارش</span>
                  <span className="order_status">جاری</span>
                </div>
              </div>

              <div className="status_info_wrapper">
                <DeliveredSvg style={{cursor: "pointer"}} onClick={() => pushToOrdersListHandler(2)} />
                <div className="status_info">   
                  <span className="order_count">{ordersStatus.completedOrders} سفارش</span>
                  <span className="order_status">تحویل شده</span>
                </div>
              </div>

              <div className="status_info_wrapper">
                <ReturnedSvg style={{cursor: "pointer"}} onClick={() => pushToOrdersListHandler(3)} />
                <div className="status_info"> 
                  <span className="order_count">{ordersStatus.canceledOrders} سفارش</span>
                  <span className="order_status">ناموفق</span>
                </div>
              </div>

            </div>
          </div>
        </>
      ) : (
        <p className="info-message w-100 text-center">
          سفارشی برای شما ثبت نشده است.
        </p>
      )}

    </section>
  );
};

export default OrderStatus;

