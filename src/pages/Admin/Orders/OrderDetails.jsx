import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import axios from "../../../util/axios";
import defPic from "../../../assets/images/pro-8.png";
import { Link } from "react-router-dom";
import Button from "../../../components/UI/FormElement/Button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "../../../components/PdfFiles/Invoice";
import { IoArrowUndoCircle } from "react-icons/io5";
import "../../User/UserOrders/SingleOrder/SingleOrder.css";
import "./OrderDetails.css";

const OrderDetails = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState({});
  const [errorText, setErrorText] = useState("");

  const { id } = match.params;

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

  return (
    <div className="admin-panel-wrapper">
      <Link to="/admin/dashboard/orders" className="create-new-slide-link mb-3">
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
          <div className="admin_dashboard_order_details_wrapper">
            <h5 className="text-center mt-0 mb-2">
              جزئیات سفارش با شماره سریال{" "}
              <strong className="text-blue mr-1">{id}</strong>
            </h5>
            <div className="current_order_details_wrapper">
              <div className="order_buyer_info_wrapper">
                <strong className="mb-2">اطلاعات خریدار</strong>
                <hr className="mt-1 mb-2" />
                <div className="dashboard_order_info_box">
                  <img
                    src={
                      !order.shippingAddress.buyerImage
                        ? `${defPic}`
                        : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${order.shippingAddress.buyerImage}`
                    }
                    alt={order.shippingAddress.fullName}
                    className="buyer_img"
                  />
                </div>
                <div className="dashboard_order_info_box">
                  <span>نام و نام خانوادگی :</span>
                  <strong>{order.shippingAddress.fullName}</strong>
                </div>
                <div className="dashboard_order_info_box">
                  <span>شماره تلفن :</span>
                  <strong>{order.shippingAddress.phoneNumber}</strong>
                </div>
                <div className="dashboard_order_info_box">
                  <span>آدرس تحویل کالا :</span>
                  <strong>{order.shippingAddress.address}</strong>
                </div>
                <div className="dashboard_order_info_box">
                  <span>هزینه سفارش :</span>
                  <strong>
                    {order.paymentInfo.amount.toLocaleString("fa")}
                    &nbsp;تومان
                  </strong>
                </div>
                <div className="dashboard_order_info_box">
                  <span>تخفیف داده شده :</span>
                  <strong>
                    {order.paymentInfo.discountAmount.toLocaleString("fa")}
                    &nbsp;تومان
                  </strong>
                </div>
              </div>
              <div className="order_status_wrapper">
                <strong className="mb-2">جزئیات سفارش</strong>
                <hr className="mt-1 mb-2" />
                <div className="dashboard_order_info_box">
                  <span>تاریخ ثبت سفارش :</span>
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </strong>
                </div>
                <div className="dashboard_order_info_box">
                  <span>نوع سفارش :</span>
                  <strong>
                    {order.paymentMethod === "COD"
                      ? "پرداخت در محل"
                      : "پرداخت اینترنتی"}
                  </strong>
                </div>
                <div className="dashboard_order_info_box">
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
                <div className="dashboard_order_info_box">
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
                <div className="dashboard_order_info_box">
                  <span>تاریخ تحویل :</span>
                  <strong>
                    {order.paidAt
                      ? new Date(order.paidAt).toLocaleDateString("fa-IR")
                      : "-"}
                  </strong>
                </div>
                <div className="dashboard_order_info_box">
                  <span>وضعیت پرداخت :</span>
                  <strong>
                    {order.isPaid ? "پرداخت تکمیل شد" : "پرداخت نشده است"}
                  </strong>
                </div>
                <div className="dashboard_order_info_box">
                  <span>تاریخ پرداخت :</span>
                  <strong>
                    {order.deliveredAt
                      ? new Date(order.deliveredAt).toLocaleDateString("fa-IR")
                      : "-"}
                  </strong>
                </div>
              </div>
            </div>
            <div className="order_table">
              <table>
                <thead>
                  <tr>
                    <th>تصویر</th>
                    <th>عنوان</th>
                    <th>قیمت</th>
                    <th>تعداد</th>
                    <th>رنگ</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.length > 0 &&
                    order.products.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <div className="d-flex-center-center">
                            <img
                              className="table-img"
                              src={
                                !item.image
                                  ? `${defPic}`
                                  : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${item.image}`
                              }
                              alt={item.product.title}
                            />
                          </div>
                        </td>
                        <td>
                          <Link
                            to={`/product/details/${item.product._id}`}
                            className="text-blue"
                          >
                            {item.product.title}
                          </Link>
                        </td>
                        <td>{item.price.toLocaleString("fa")} تومان</td>
                        <td>{item.count}</td>
                        <td>
                          <div className="single_order_color_wrapper">
                            {item.colors.length > 0 &&
                              item.colors.map((color, i) => (
                                <span
                                  style={{
                                    background: `#${color.colorHex}`,
                                    color:
                                      `#${color.colorHex}` < "#1f101f"
                                        ? "white"
                                        : "black",
                                  }}
                                  className="single_order_color tooltip"
                                  key={i}
                                >
                                  <span className="tooltip_text">
                                    {color.colorName}
                                  </span>
                                </span>
                              ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="admin_dashboard_order_btns_wrapper">
              <div className="print_btn_wrapper">
                <Button type="button">پرینت از سفارش</Button>
              </div>
              <div className="print_btn_wrapper">
                <PDFDownloadLink
                  document={<Invoice order={order} />}
                  fileName="order.pdf"
                  className="button"
                >
                  دانلود فایل PDF
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default OrderDetails;
