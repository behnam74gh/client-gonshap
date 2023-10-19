import React, { useEffect, useState,useRef } from "react";
import { VscLoading } from "react-icons/vsc";
import axios from "../../../util/axios";
import defPic from "../../../assets/images/pro-8.png";
import { Link } from "react-router-dom";
import Button from "../../../components/UI/FormElement/Button";
import { IoArrowUndoCircle } from "react-icons/io5";
import "../../User/UserOrders/SingleOrder/SingleOrder.css";
import "./OrderDetails.css";
import { useSelector } from "react-redux";

const OrderDetails = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({});
  const [errorText, setErrorText] = useState("");

  const {userInfo: {role}} = useSelector(state => state.userSignin)

  const { id } = match.params;

  const printableDivRef = useRef()
  const iframeRef = useRef()

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/read/current-order/${id}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setOrder(response.data.currentOrder);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, [id]);
  
  const getPrintOrPdfHandler = () => {
    iframeRef.current.contentWindow.document.open()
    iframeRef.current.contentWindow.document.write(printableDivRef.current.innerHTML)
    iframeRef.current.contentWindow.document.close()
    iframeRef.current.contentWindow.focus()
    iframeRef.current.contentWindow.print()
  }

  return (
    <div className="admin-panel-wrapper">
      <Link to={`/${role === 1 ? "admin" : "store-admin"}/dashboard/orders`} className="create-new-slide-link mb-3">
        <span className="sidebar-text-link">بازگشت به فهرست سفارش ها</span>
        <IoArrowUndoCircle className="font-md" />
      </Link>
      {loading ? (
        <VscLoading className="loader" />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        order._id &&
        order._id.length > 0 && (
          <div style={{width: "100%",display: "flex",flexFlow: "column wrap"}}>
            <div ref={printableDivRef} style={{width: "100%",display: "flex",flexFlow: "column wrap",backgroundColor: "white",padding: "30px 40px",borderRadius: "4px",boxShadow: "0 2px 17px rgba(0,0,0,0.3)"}}>
              <h5 style={{direction: "rtl",marginBottom: "10px",marginTop: "0", textAlign: "center !important"}}>
                جزئیات سفارش با شماره سریال{" "}
                <strong style={{marginRight: "5px", color: "#2c6df0"}}>{id}</strong>
              </h5>
              <div style={{width: "100%",direction: "rtl",display: "flex",flexFlow: "row",alignItems: "flex-start",margin: "0 0 30px"}}>
                <div style={{flexBasis: "50%",display: "flex",flexFlow: "column wrap",padding: "10px 0 10px 30px",fontSize: "12px"}}>
                  <strong style={{marginBottom: "10px"}}>اطلاعات خریدار</strong>
                  <hr style={{marginTop: "5px",marginBottom: "10px",width: "100%",border: "none",margin: "30px 0",borderTop: "1px solid rgba(150,148,148)"}} />
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <img style={{width: "100%",height: "auto", maxWidth: "80px", maxHeight: "80px",borderRadius: "50%"}}
                      src={
                        !order.shippingAddress.buyerImage
                          ? `${defPic}`
                          : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${order.shippingAddress.buyerImage}`
                      }
                      alt={order.shippingAddress.fullName}
                    />
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>نام و نام خانوادگی :</span>
                    <strong>{order.shippingAddress.fullName}</strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>شماره تلفن :</span>
                    <strong>{order.shippingAddress.phoneNumber}</strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>آدرس تحویل کالا :</span>
                    <strong>{order.shippingAddress.address}</strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>هزینه سفارش :</span>
                    <strong>
                      {order.paymentInfo.amount.toLocaleString("fa")}
                      &nbsp;تومان
                    </strong>
                  </div>
                </div>
                <div style={{padding: "10px 30px 10px 0px",flexBasis: "50%",display: "flex",flexFlow: "column wrap",fontSize: "12px"}}>
                  <strong style={{marginBottom: "10px"}}>جزئیات سفارش</strong>
                  <hr style={{marginTop: "5px",marginBottom: "10px",width: "100%",border: "none",margin: "30px 0",borderTop: "1px solid rgba(150,148,148)"}} />
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>سود سفارش :</span>
                    <strong>
                      {order.paymentInfo.profit?.toLocaleString("fa")}
                      &nbsp;تومان
                    </strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>تاریخ ثبت سفارش :</span>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>وضعیت سفارش :</span>
                    <strong>
                      {order.orderStatus === 0
                        ? "نیاز به تایید"
                        : order.orderStatus === 1
                        ? "تایید شد"
                        : order.orderStatus === 2
                        ? "کامل شد"
                        : order.orderStatus === 3
                        ? "لغو شد"
                        : "رد شد"}
                    </strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>وضعیت ارسال :</span>
                    <strong>
                      {order.deliveryStatus === 0
                        ? "ارسال نشده است"
                        : order.deliveryStatus === 1
                        ? "ارسال شد"
                        : order.deliveryStatus === 2
                        ? "تحویل داده شد"
                        : "برگشت داده شد"}
                    </strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>تاریخ تحویل :</span>
                    <strong>
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleDateString("fa-IR")
                        : "-"}
                    </strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>وضعیت پرداخت :</span>
                    <strong>
                      {order.isPaid ? "پرداخت تکمیل شد" : "پرداخت نشده است"}
                    </strong>
                  </div>
                  <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
                    <span>تاریخ پرداخت :</span>
                    <strong>
                      {order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleDateString("fa-IR")
                        : "-"}
                    </strong>
                  </div>
                </div>
              </div>
              <div style={{overflowX: "auto",direction: "rtl",width: "100%"}}>
                <table style={{border: "none",width: "100%"}}>
                  <thead style={{backgroundColor: "#000",boxShadow: "0 4px 18px rgba(0, 0, 0, 0.45)"}}>
                    <tr>
                      <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>تصویر</th>
                      <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>عنوان</th>
                      <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>قیمت فروش</th>
                      <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>سود تکی</th>
                      <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>تعداد</th>
                      <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>سود مجموع</th>
                      <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>رنگ</th>
                    </tr>
                  </thead>
                  <tbody style={{fontSize: "12px",border: "none"}}>
                    {order.products.length > 0 &&
                      order.products.map((item) => (
                        <tr key={item.product._id}>
                          <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>
                            <div style={{display: "flex",alignItems: "center",flexFlow: "row wrap",justifyContent: "center"}}>
                              <img
                                style={{width: "100%", height: "100%",maxWidth: "40px",maxHeight: "40px",minHeight: "40px"}}
                                src={
                                  !item.image
                                    ? `${defPic}`
                                    : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${item.image}`
                                }
                                alt={item.product.title}
                              />
                            </div>
                          </td>
                          <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>
                            <Link
                              to={`/product/details/${item.product._id}`}
                              style={{color: "#2c6df0",fontWeight: "600"}}
                            >
                              {item.product.title}
                            </Link>
                          </td>
                          <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{item.price.toLocaleString("fa")} تومان</td>
                          <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{item.profit?.toLocaleString("fa")} تومان</td>
                          <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{item.count}</td>
                          <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{(item.count * item.profit).toLocaleString("fa")} تومان</td>
                          <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>
                            <div style={{display: "flex",flexFlow: "row wrap",justifyContent: "center",alignItems: "center"}}>
                              {item.colors.length > 0 &&
                                item.colors.map((color, i) => (
                                  <span
                                    style={{
                                      background: `#${color.colorHex}`,
                                      color:
                                        `#${color.colorHex}` < "#1f101f"
                                          ? "white"
                                          : "black",
                                    width: "25px",height: "25px",borderRadius: "50%",margin: "2px 4px" 
                                    }}
                                    key={i}
                                  >
                                  </span>
                                ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{display: "flex",flexFlow: "row wrap", justifyContent: "space-between",alignItems: "center"}}>
              <div style={{flexBasis: "50%",display: "flex",flexFlow: "row wrap",justifyContent: "flex-start",alignItems: "center"}}>
                <Button style={{
                  width: "60%",background: "#6a0093",color: "#ffffff",borderRadius: "4px",outline: "none",padding: "8px 16px",minHeight: "38px",margin: "0.5em 0",
                  border: "none",cursor: "pointer",fontFamily: "inherit",fontSize: "14px",overflow: "hidden",display:"flex",
                  flexFlow: "row wrap",justifyContent: "center",alignItems: "center"
                }} onClick={getPrintOrPdfHandler} type="button">pdf یا پرینت از سفارش</Button>
              </div>
            </div>
          </div>
        )
      )}
      <iframe ref={iframeRef}
       style={{height: "0px", width: "0px",display: "flex",flexFlow: "column wrap", justifyContent: "center",alignItems: "center",
       position: "absolute",background: "white"}} title="iframe for print"></iframe>
    </div>
  );
};

export default OrderDetails;
