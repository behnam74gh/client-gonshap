import React from "react";
import { Link } from "react-router-dom";
import defPic from "../../../../assets/images/def.jpg";
import "./SingleOrder.css";

const SingleOrder = ({ order }) => {
  return (
    <div className="single_order_wrapper">
      <div className="order_details_wrapper">
        <span>
          هزینه نهایی سفارش :
          <strong className="bg-blue text-white">
            {order.paymentInfo.amount.toLocaleString("fa")} تومان
          </strong>
        </span>
        <span>
          تاریخ سفارش :
          <strong>{new Date(order.createdAt).toLocaleDateString("fa")}</strong>
        </span>
        <span>
          وضعیت سفارش:{" "}
          <strong
            className={
              order.orderStatus === 0
                ? "bg-purple text-white"
                : order.orderStatus === 1
                ? "bg-white"
                : order.orderStatus === 2
                ? "bg-success text-white"
                : order.orderStatus === 3
                ? "bg-orange"
                : "bg-danger text-white"
            }
          >
            {order.orderStatus === 0
              ? "در انتظار تایید"
              : order.orderStatus === 1
              ? "تایید شد"
              : order.orderStatus === 2
              ? "کامل شد"
              : order.orderStatus === 3
              ? "لغو شد"
              : "رد شد"}
          </strong>
        </span>

        <span>
          وضعیت پرداخت :
          <strong
            className={order.isPaid ? "bg-success text-white" : "bg-orange"}
          >
            {order.isPaid ? "پرداخت شد" : "پرداخت نشده است"}
          </strong>
        </span>
        {order.paidAt && (
          <span>
            تاریخ پرداخت:
            <strong>{new Date(order.paidAt).toLocaleDateString("fa")}</strong>
          </span>
        )}
        <span>
          وضعیت ارسال :
          <strong
            className={
              order.deliveryStatus === 0
                ? "bg-orange"
                : order.deliveryStatus === 1
                ? "bg-purple text-white"
                : order.deliveryStatus === 2
                ? "bg-success text-white"
                : "bg-danger text-white"
            }
          >
            {order.deliveryStatus === 0
              ? "ارسال نشده است"
              : order.deliveryStatus === 1
              ? "ارسال شده است"
              : order.deliveryStatus === 2
              ? "تحویل داده شد"
              : "برگشت داده شد"}
          </strong>
        </span>

        {order.deliveredAt && (
          <span>
            تاریخ تحویل :
            <strong>
              {new Date(order.deliveredAt).toLocaleDateString("fa")}
            </strong>
          </span>
        )}
        <span>
          کد رهگیری سفارش :<strong>{order._id}</strong>
        </span>
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
    </div>
  );
};

export default SingleOrder;
