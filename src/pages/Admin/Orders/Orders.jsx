import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { VscLoading } from "react-icons/vsc";
import { RiSearchLine } from "react-icons/ri";
import { MdDelete, MdRemoveRedEye } from "react-icons/md";
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
  const [perPage] = useState(50);
  const [queryPhoneNumber, setQueryPhoneNumber] = useState("");
  const [queryOrderId, setQueryOrderId] = useState("");
  const [dates, setDates] = useState(
    JSON.parse(localStorage.getItem("orderConfig-date-dash")) ||
  []);
  const [profit,setProfit] = useState(0);
  const [toggleLoading, setToggleLoading] = useState({
    statusLoading: false,
    deliveryLoading: false,
    paymentLoading: false,
  });
  const [generate, setGenerate] = useState({
    id: null,
    value: true
  });
  const [delConfig, setDelConfig] = useState({
    id: null,
    loading: false
  });

  const {userInfo: {role,supplierFor}} = useSelector(state => state.userSignin);
  // const exelRef = useRef();
  // const tableRef = useRef();
  useEffect(() => {
    if(role === 1){
      axios.get('/all-suppliers/list').then(res => {
        if(res.data.success){
          setSuppliers(res.data.suppliers)
        }
      }).catch(err => toast.warning(err))
    }

    return () => {
      if(!window.location.href.includes('/order/')){
        localStorage.removeItem("orderConfig-dash")
        localStorage.removeItem("orderConfig-page")
        localStorage.removeItem("orderConfig-date-dash")
      }
    }
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;

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
      },{signal: ac.signal})
      .then((response) => {
        if (response.data.success && mounted) {
          setLoading(false);
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
        if(err.response && mounted) {
          setLoading(false);
          if (typeof err.response.data.message === "object"){
            setErrorText(err.response.data.message[0]); 
          }else{
            setErrorText(err.response.data.message);
          }
        }
      });

      return () => {
        ac.abort()
        mounted = false;
      }
  }, [orderConfig, page, perPage,role,supplierFor,dates]);

  useEffect(() => {
    setGenerate({
      ...generate,
      value: true
    })
  }, [generate.value])

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
    setToggleLoading({
      statusLoading: order === "orderStatus" ? true :false,
      deliveryLoading: order === "deliveryStatus" ? true :false,
      paymentLoading: order === "isPaid" ? true :false
    })
    setGenerate({
      ...generate,
      id: id
    })
    axios
      .put(`/change/order-status/${id}`, { order, value: e })
      .then((response) => {
        setToggleLoading({
          statusLoading: false,
          deliveryLoading: false,
          paymentLoading: false
        })
        if (response.data.success) {
          toast.success(response.data.message);
          let oldOrders = orders;
          const o = oldOrders.find(o => o._id === id);
          o[order] = e;
          setOrders(oldOrders)
          setGenerate({
            ...generate,
            value: false
          })
        }
      })
      .catch((err) => {
        setToggleLoading({
          statusLoading: false,
          deliveryLoading: false,
          paymentLoading: false
        })
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

  const keyPressedHandler = (e) => {
    if(e.keyCode === 13){
      searchOrdersById()
    };
  }

  const deleteOrderHandler = (id) => {
    if (window.confirm("سفارش را حذف میکنید؟")){
      setDelConfig({
        id,
        loading: true
      })
      axios.delete(`/order/delete/${id}`)
      .then(res => {
        setDelConfig({
          ...delConfig,
          loading: false
        })
        if(res.data.success){
          toast.success(res.data.message);
          const oldOrders = orders;
          const newOrders = oldOrders.filter(order => order._id !== id);
          setOrders(newOrders)
        }
      })
      .catch(err => {
        setDelConfig({
          ...delConfig,
          loading: false
        })
        if(err.response){
          toast.warning(err.response.data.message)
        }
      })
    }
    
  }

  // const exportToExelFileHandler = () => {
  //   console.log('lets take an exel file of these records');
  //   var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  //   var j = 0;
  //   // var tab = document.getElementById('headerTable'); // id of table
  //   // tableRef.current.dir = "ltr"
  //   for (j = 0; j < tableRef.current.rows.length; j++) {
  //       tab_text = tab_text + tableRef.current.rows[j].innerHTML + "</tr>";
  //       //tab_text=tab_text+"</tr>";
  //   }

  //   tab_text = tab_text + "</table>";
  //   tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
  //   tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
  //   tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

  //   var msie = window.navigator.userAgent.indexOf("MSIE ");
  //   let sa;
  //   // If Internet Explorer
  //   if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
  //     exelRef.current.document.open("txt/html", "replace");
  //     exelRef.current.document.write(tab_text);
  //     exelRef.current.document.close();
  //     exelRef.current.focus();

  //       sa = exelRef.current.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
  //   } else {
  //       // other browser not tested on IE 11
  //       sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
  //   }

  //   return sa;
  // }

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
       
      <div className="table-wrapper">
        <table>
          <thead>
            <tr
              style={{
                backgroundColor: "var(--firstColorPalete)",
                color: "white",
              }}
            >
              <th colSpan={role === 2 ? "3" : "2"}>
                <DatePicker
                  value={dates}
                  onChange={setDateHandler}
                  placeholder="جستوجو بر اساس تاریخ"
                  calendar="persian"
                  range
                  locale="fa"
                  calendarPosition="bottom-right"
                  style={{ height: window.innerWidth > 450 ? "40px" : "30px" }}         
                />
              </th>
              
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
                      <option key={item._id} value={item.phoneNumber}>
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
          
              <th colSpan={role === 1 ? "6" : "5"}>
                <div className="dashboard-search">
                  <input
                    type="search"
                    value={queryPhoneNumber}
                    placeholder="جستوجوی سفارش بر اساس شماره موبایل.."
                    onChange={(e) => setQueryPhoneNumber(e.target.value)}
                    onKeyDown={(e) => {
                      if(e.keyCode === 13){
                        searchOrdersByPhoneNumber()
                      };
                    }}
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
              <th colSpan={role === 1 ? "6" : "5"}>
                <div className="dashboard-search">
                  <input
                    type="search"
                    value={queryOrderId}
                    placeholder="جستوجوی سفارش بر اساس شماره سریال.."
                    onChange={(e) => setQueryOrderId(e.target.value)}
                    onKeyDown={(e) => keyPressedHandler(e)}
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
              {role === 1 && <th className="th-titles">حذف</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={role === 1 ? "12" : "11"}>
                  <div className="loader_wrapper">
                    <VscLoading className="loader" />
                  </div>
                </td>
              </tr>
            ): orders.length > 0 ? (
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
                    {toggleLoading.statusLoading && generate.id === order._id ? <VscLoading className="loader" /> 
                    : generate.value && 
                      (
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
                      )
                    }
                  </td>
                  <td className="font-sm">
                    {order.paymentInfo.amount.toLocaleString("fa")}
                    &nbsp;تومان
                  </td>
                  <td className="font-sm">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="font-sm">
                    {
                      toggleLoading.deliveryLoading && generate.id === order._id ? <VscLoading className="loader" />
                      : generate.value && (
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
                      )
                    }
                  </td>
                  <td className="font-sm">
                    {
                      toggleLoading.paymentLoading && generate.id === order._id ? <VscLoading className="loader" />
                      : generate.value && (
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
                      )
                    }
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
                  {role === 1 && <td>
                    {
                      delConfig.loading && delConfig.id === order._id ? (
                        <VscLoading className="loader" />
                      ) : (
                        <MdDelete style={{cursor: "pointer"}} className="text-red" onClick={() => deleteOrderHandler(order._id)} />
                      )
                    }
                  </td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 1 ? "12" : "11"}>
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
    </div>
  );
};

export default Orders;
