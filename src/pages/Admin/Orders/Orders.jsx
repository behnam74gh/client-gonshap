import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { VscLoading } from "react-icons/vsc";
import { RiSearchLine } from "react-icons/ri";
import { MdRemoveRedEye } from "react-icons/md";
import axios from "../../../util/axios";
import defPic from "../../../assets/images/pro-8.png";
import Pagination from "../../../components/UI/Pagination/Pagination";
import { toast } from "react-toastify";
import { DateObject } from "react-multi-date-picker";
import DatePicker from "react-multi-date-picker";
import {db} from '../../../util/indexedDB'
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLength, setOrdersLength] = useState();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(JSON.parse(localStorage.getItem("orderConfig-page")) ||1);
  const [suppliers, setSuppliers] = useState([]);
  const [orderConfig, setOrderConfig] = useState(
    JSON.parse(localStorage.getItem("orderConfig-dash")) ||
    {
    currentSupplier: "All",
    config: "orderStatus",
    activeOrderStatus: "0",
    activeDeliveryStatus: "none",
    activePaymentStatus: "none",
    phoneNumber: "",
    orderId: ""
  });
  const [perPage, setPerPage] = useState(50);
  const [queryPhoneNumber, setQueryPhoneNumber] = useState("");
  const [queryOrderId, setQueryOrderId] = useState("");
  const [dates, setDates] = useState(
    JSON.parse(localStorage.getItem("orderConfig-date-dash")) ||
  []);
  const [profit,setProfit] = useState(0)

  const {userInfo: {role,supplierFor}} = useSelector(state => state.userSignin)
  
  useEffect(() => {
    db.supplierList.toArray().then(items => {
      setSuppliers(items)
    })

    return () => {
      if(!window.location.href.includes('/order/')){
        localStorage.removeItem("orderConfig-dash")
        localStorage.removeItem("orderConfig-page")
        localStorage.removeItem("orderConfig-date-dash")
      }
    }
  }, [])

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
      case "phoneNumber":
        value = orderConfig.phoneNumber;
        break;
      case "orderId":
        value = orderConfig.orderId;
        break;
      case "date":
        value = dates;
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
        dates: orderConfig.config !== 'date' && dates.length > 1 ? dates : null,
        supplierFor: role === 2 ? supplierFor : orderConfig.currentSupplier
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          const { orders, profitOfOrders, allCount } = response.data;
          setProfit(profitOfOrders);
          setOrders(orders);
          setOrdersLength(allCount);
          setErrorText("");
          localStorage.setItem('orderConfig-dash',JSON.stringify(orderConfig))
          localStorage.setItem('orderConfig-page',JSON.stringify(page))
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
  }, [orderConfig, page, perPage,role,supplierFor,dates]);

  const setCurrentSupplierHandler = (e) => {
    if (e === "none") {
      return;
    }
    const isQuery = ['orderId','phoneNumber'].includes(orderConfig.config)
    setOrderConfig({
      ...orderConfig,
      ...(isQuery && {config : "orderStatus"}),
      ...(isQuery && {activeOrderStatus : "0"}),
      ...(isQuery && {phoneNumber : ""}),
      ...(isQuery && {orderId : ""}),
      currentSupplier: e,
    })
    setPage(1);
    setQueryPhoneNumber("");
    setQueryOrderId("");
  }

  const setOrderStatusConfigHandler = (e) => {
    if (e === "none") {
      return;
    }
    setOrderConfig({
      ...orderConfig,
      config: "orderStatus",
      activeDeliveryStatus: "none",
      activePaymentStatus: "none",
      activeOrderStatus: e,
      phoneNumber: "",
      orderId: ""
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
      ...orderConfig,
      config: "deliveryStatus",
      activeOrderStatus: "none",
      activePaymentStatus: "none",
      activeDeliveryStatus: e,
      phoneNumber: "",
      orderId: ""
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
      ...orderConfig,
      config: "isPaid",
      activeOrderStatus: "none",
      activeDeliveryStatus: "none",
      activePaymentStatus: e,
      phoneNumber: "",
      orderId: ""
    });
    setPage(1);
    setQueryPhoneNumber("");
    setQueryOrderId("");
  };

  const searchOrdersByPhoneNumber = () => {
    setOrderConfig({
      currentSupplier: "All",
      config: "phoneNumber",
      activeOrderStatus: "none",
      activePaymentStatus: "none",
      activeDeliveryStatus: "none",
      phoneNumber: queryPhoneNumber,
      orderId: ""
    });
    setPage(1);
    setQueryOrderId("");
    setDates([])
  };

  const searchOrdersById = () => {
    setOrderConfig({
      currentSupplier: "All",
      config: "orderId",
      activeOrderStatus: "none",
      activePaymentStatus: "none",
      activeDeliveryStatus: "none",
      phoneNumber: "",
      orderId: queryOrderId
    });
    setPage(1);
    setQueryPhoneNumber("");
    setDates([])
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
    if(value.length > 1) {
      let dates = value.map((date) =>
      date instanceof DateObject ? date.toDate() : date
      );
  
      setDates(dates);

      setOrderConfig({
        ...orderConfig,
        config: "date",
        activeOrderStatus: "none",
        activePaymentStatus: "none",
        activeDeliveryStatus: "none",
        phoneNumber: "",
        orderId: ""
      });

      setPage(1);
      setQueryPhoneNumber("");
      setQueryOrderId("");
      localStorage.setItem('orderConfig-date-dash',JSON.stringify(dates))
    }else{
      return
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="profitWrapper"> 
        <h4 className="orders_title">سفارش های اخیر</h4>
        <span className="profit">
          سود مجموع سفارش های زیر
          <strong className="profit_number">{profit.toLocaleString("fa")}</strong>
          تومان میباشد.
        </span>
      </div>
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
                {role === 1 && <th colSpan="2">
                  <select
                    value={orderConfig.currentSupplier}
                    onChange={(e) =>
                      setCurrentSupplierHandler(e.target.value)
                    }
                  >
                    <option value="none">عنوان فروشگاه :</option>
                    <option value="All">همه سفارش ها</option>
                    {suppliers?.length > 0 && suppliers.map(item => {
                      return (
                        <option key={item._id} value={item.backupFor._id}>
                          {item.title}
                        </option>
                      )
                    })}
                  </select>
                </th>}
                <th colSpan={role === 2 ? "3" : "2"}>
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
                <th colSpan={role === 2 ? "3" : "2"}>
                  <DatePicker
                    value={dates}
                    onChange={setDateHandler}
                    placeholder="جستوجو بر اساس تاریخ"
                    calendar="persian"
                    range
                    locale="fa"
                    calendarPosition="bottom-right"
                    style={{ height: "40px" }}         
                  />
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
                <th className="th-titles">کد سفارش</th>
                <th className="th-titles">وضعیت سفارش</th>
                <th className="th-titles">هزینه سفارش</th>
                <th className="th-titles">تاریخ سفارش</th>
                <th className="th-titles">وضعیت ارسال</th>
                <th className="th-titles">وضعیت پرداخت</th>
                <th className="th-titles">سود مجموع</th>
                <th className="th-titles">مشاهده</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
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
                      {role === 1 && <Link
                        to={`/admin/dashboard/user/${order.orderedBy}`}
                        className="text-blue"
                      >
                        {order.shippingAddress.fullName}
                      </Link>}
                      {role === 2 && order.shippingAddress.fullName}
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
                      {order.paymentInfo.profit?.toLocaleString("fa")}
                      &nbsp;تومان
                    </td>
                    <td>
                      <Link to={`/${role === 1 ? "admin" : "store-admin"}/dashboard/order/${order._id}`}>
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
