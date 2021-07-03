import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import { RiSearchLine } from "react-icons/ri";
import { MdRemoveRedEye } from "react-icons/md";
import axios from "../../../util/axios";
import defPic from "../../../assets/images/pro-8.png";
import Pagination from "../../../components/UI/Pagination/Pagination";
import { toast } from "react-toastify";
import { DateObject } from "react-multi-date-picker";
import DatePicker from "react-multi-date-picker";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLength, setOrdersLength] = useState();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(1);
  const [orderConfig, setOrderConfig] = useState({
    config: "orderStatus",
    activeOrderStatus: "0",
    activeDeliveryStatus: "none",
    activePaymentStatus: "none",
    activePaymentType: "none",
    date: [],
  });
  const [perPage, setPerPage] = useState(50);
  const [queryPhoneNumber, setQueryPhoneNumber] = useState("");
  const [queryOrderId, setQueryOrderId] = useState("");
  const [date, setDate] = useState();

  useEffect(() => {
    setLoading(true);

    let value;

    switch (orderConfig.config) {
      case "orderStatus":
        value = orderConfig.activeOrderStatus;
        break;
      case "deliveryStatus":
        value = orderConfig.activeDeliveryStatus;
        break;
      case "isPaid":
        value = orderConfig.activePaymentStatus;
        break;
      case "paymentMethod":
        value = orderConfig.activePaymentType;
        break;
      case "phoneNumber":
        value = orderConfig.userPhoneNumber;
        break;
      case "orderId":
        value = orderConfig.orderId;
        break;
      case "date":
        value = orderConfig.date;
        break;
      default:
        return (value = orderConfig.activeOrderStatus);
    }
    axios
      .post("/fetch/orders/by-order-status", {
        order: orderConfig.config,
        value,
        page,
        perPage,
      })
      .then((response) => {
        setLoading(false);
        const { success, orders, allCount } = response.data;
        if (success) {
          setOrders(orders);
          setOrdersLength(allCount);
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
  }, [orderConfig, page, perPage]);

  const setOrderStatusConfigHandler = (e) => {
    if (e === "none") {
      return;
    }
    setOrderConfig({
      config: "orderStatus",
      activeDeliveryStatus: "none",
      activePaymentStatus: "none",
      activePaymentType: "none",
      date: null,
      activeOrderStatus: e,
    });
    setPage(1);
    setQueryPhoneNumber("");
    setQueryOrderId("");
  };

  const setDeliveryStatusConfigHandler = (e) => {
    if (e === "none") {
      return;
    }
    setOrderConfig({
      config: "deliveryStatus",
      activeOrderStatus: "none",
      activePaymentStatus: "none",
      activePaymentType: "none",
      date: null,
      activeDeliveryStatus: e,
    });
    setPage(1);
    setQueryPhoneNumber("");
    setQueryOrderId("");
  };

  const setIsPaidConfigHandler = (e) => {
    if (e === "none") {
      return;
    }
    setOrderConfig({
      config: "isPaid",
      activeOrderStatus: "none",
      activePaymentType: "none",
      activeDeliveryStatus: "none",
      date: null,
      activePaymentStatus: e,
    });
    setPage(1);
    setQueryPhoneNumber("");
    setQueryOrderId("");
  };

  const setPaymentTypeConfigHandler = (e) => {
    if (e === "none") {
      return;
    }
    setOrderConfig({
      config: "paymentMethod",
      activeOrderStatus: "none",
      activePaymentStatus: "none",
      activeDeliveryStatus: "none",
      date: null,
      activePaymentType: e,
    });
    setPage(1);
    setQueryPhoneNumber("");
    setQueryOrderId("");
  };

  const searchOrdersByPhoneNumber = () => {
    setOrderConfig({
      config: "phoneNumber",
      activeOrderStatus: "none",
      activePaymentStatus: "none",
      activeDeliveryStatus: "none",
      activePaymentType: "none",
      date: null,
      userPhoneNumber: queryPhoneNumber,
    });
    setPage(1);
    setQueryOrderId("");
  };

  const searchOrdersById = () => {
    setOrderConfig({
      config: "orderId",
      activeOrderStatus: "none",
      activePaymentStatus: "none",
      activeDeliveryStatus: "none",
      activePaymentType: "none",
      date: null,
      orderId: queryOrderId,
    });
    setPage(1);
    setQueryPhoneNumber("");
  };

  // change-Order-Status
  const changeOrderStatusHandler = (id, e, order) => {
    axios
      .put(`/change/order-status/${id}`, { order, value: e })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          if (perPage > 50) {
            setPerPage(50);
          } else {
            setPerPage(51);
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.warning(err.response.data.message);
        }
      });
  };

  const setDateHandler = (value) => {
    if (value instanceof DateObject) value = value.toDate();
    setDate(value);

    setOrderConfig({
      config: "date",
      activeOrderStatus: "none",
      activePaymentStatus: "none",
      activeDeliveryStatus: "none",
      activePaymentType: "none",
      orderId: "none",
      date: value,
    });
  };

  return (
    <div className="admin-panel-wrapper">
      <h4>سفارش های اخیر</h4>
      {errorText.length > 0 && <p className="warning-message">{errorText}</p>}
      {loading ? (
        <VscLoading className="loader" />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th colSpan="2">
                  <select
                    value={orderConfig.activeOrderStatus}
                    onChange={(e) =>
                      setOrderStatusConfigHandler(e.target.value)
                    }
                  >
                    <option value="none">وضعیت سفارش:</option>
                    <option value="0">نیاز به تاییدها</option>
                    <option value="1">تایید شده ها</option>
                    <option value="2">کامل شده ها</option>
                    <option value="3">لغو شده ها</option>
                    <option value="4">رد شده ها</option>
                  </select>
                </th>
                <th colSpan="2">
                  <select
                    value={orderConfig.activeDeliveryStatus}
                    onChange={(e) =>
                      setDeliveryStatusConfigHandler(e.target.value)
                    }
                  >
                    <option value="none">وضعیت ارسال:</option>
                    <option value="0">ارسال نشده ها</option>
                    <option value="1">ارسال شده ها</option>
                    <option value="2">تحویلی ها</option>
                    <option value="3">برگشتی ها</option>
                  </select>
                </th>
                <th colSpan="2">
                  <select
                    value={orderConfig.activePaymentType}
                    onChange={(e) =>
                      setPaymentTypeConfigHandler(e.target.value)
                    }
                  >
                    <option value="none">نوع پرداخت:</option>
                    <option value="COD">در محل</option>
                    <option value="INTERNET">اینترنتی</option>
                  </select>
                </th>
                <th colSpan="5">
                  <div className="dashboard-search">
                    <input
                      type="search"
                      value={queryPhoneNumber}
                      placeholder="جستوجوی سفارش بر اساس شماره موبایل.."
                      onChange={(e) => setQueryPhoneNumber(e.target.value)}
                    />
                    <span onClick={searchOrdersByPhoneNumber}>
                      <RiSearchLine />
                    </span>
                  </div>
                </th>
              </tr>
              <tr
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th colSpan="3">
                  <select
                    value={orderConfig.activePaymentStatus}
                    onChange={(e) => setIsPaidConfigHandler(e.target.value)}
                  >
                    <option value="none">وضعیت پرداخت:</option>
                    <option value={true}>پرداخت شده ها</option>
                    <option value={false}>پرداخت نشده ها</option>
                  </select>
                </th>

                <th colSpan="3">
                  <DatePicker
                    value={date}
                    onChange={setDateHandler}
                    calendar="persian"
                    locale="fa"
                    calendarPosition="bottom-right"
                    style={{ height: "40px" }}
                  />
                </th>
                <th colSpan="5">
                  <div className="dashboard-search">
                    <input
                      type="search"
                      value={queryOrderId}
                      placeholder="جستوجوی سفارش بر اساس شماره سریال.."
                      onChange={(e) => setQueryOrderId(e.target.value)}
                    />
                    <span onClick={searchOrdersById}>
                      <RiSearchLine />
                    </span>
                  </div>
                </th>
              </tr>
              <tr
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th className="th-titles">تصویر</th>
                <th className="th-titles">خریدار</th>
                <th className="th-titles">تلفن همراه</th>
                <th className="th-titles">شماره سریال</th>
                <th className="th-titles">وضعیت سفارش</th>
                <th className="th-titles">هزینه نهایی</th>
                <th className="th-titles">تاریخ سفارش</th>
                <th className="th-titles">وضعیت ارسال</th>
                <th className="th-titles">وضعیت پرداخت</th>
                <th className="th-titles">نوع پرداخت</th>
                <th className="th-titles">مشاهده/ویرایش</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, i) => (
                  <tr key={i}>
                    <td>
                      <div className="d-flex-center-center">
                        <img
                          className="table-img"
                          style={{ borderRadius: "50%" }}
                          src={
                            !order.shippingAddress.buyerImage
                              ? `${defPic}`
                              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${order.shippingAddress.buyerImage}`
                          }
                          alt={order.shippingAddress.fullName}
                        />
                      </div>
                    </td>
                    <td className="font-sm">
                      <Link
                        to={`/admin/dashboard/user/${order.orderedBy}`}
                        className="text-blue"
                      >
                        {order.shippingAddress.fullName}
                      </Link>
                    </td>
                    <td className="font-sm">
                      {order.shippingAddress.phoneNumber}
                    </td>
                    <td className="font-sm">{order._id}</td>
                    <td className="font-sm">
                      <select
                        value={order.orderStatus}
                        className="order_select"
                        onChange={(e) =>
                          changeOrderStatusHandler(
                            order._id,
                            e.target.value,
                            "orderStatus"
                          )
                        }
                      >
                        <option value="0">نیاز به تایید</option>
                        <option value="1">تایید شد</option>
                        <option value="2">کامل شد</option>
                        <option value="3">لغو شد</option>
                        <option value="4">رد شد</option>
                      </select>
                    </td>
                    <td className="font-sm">
                      {order.paymentInfo.amount.toLocaleString("fa")}
                      &nbsp;تومان
                    </td>
                    <td className="font-sm">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="font-sm">
                      <select
                        value={order.deliveryStatus}
                        className="order_select"
                        onChange={(e) =>
                          changeOrderStatusHandler(
                            order._id,
                            e.target.value,
                            "deliveryStatus"
                          )
                        }
                      >
                        <option value="0">ارسال نشده است</option>
                        <option value="1">ارسال شد</option>
                        <option value="2">تحویل داده شد</option>
                        <option value="3">برگشت داده شد</option>
                      </select>
                    </td>
                    <td className="font-sm">
                      <select
                        value={order.isPaid}
                        className="order_select"
                        onChange={(e) =>
                          changeOrderStatusHandler(
                            order._id,
                            e.target.value,
                            "isPaid"
                          )
                        }
                      >
                        <option value={true}>پرداخت شد</option>
                        <option value={false}>پرداخت نشد</option>
                      </select>
                    </td>
                    <td className="font-sm">
                      {order.paymentMethod === "COD" ? "در محل" : "اینترنتی"}
                    </td>
                    <td>
                      <Link to={`/admin/dashboard/order/${order._id}`}>
                        <MdRemoveRedEye className="font-md text-blue" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13">
                    <p
                      className="warning-message"
                      style={{ textAlign: "center" }}
                    >
                      سفارشی یافت نشد!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {ordersLength > perPage && (
            <Pagination
              perPage={perPage}
              productsLength={ordersLength}
              setPage={setPage}
              page={page}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
