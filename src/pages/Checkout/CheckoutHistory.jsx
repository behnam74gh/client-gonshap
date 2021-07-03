import React, { useState } from "react";
import axios from "../../util/axios";
import Button from "../../components/UI/FormElement/Button";
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/Actions/cartActions";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { COUPON_APPLIED } from "../../redux/Types/couponTypes";
import { COD } from "../../redux/Types/CODTypes";
import { VscLoading } from "react-icons/vsc";
import defPic from "../../assets/images/def.jpg";

const CheckoutHistory = ({
  products,
  totalPrice,
  cartItems,
  userInfo,
  addressSaved,
  totalAfterDiscount,
  CODelivery,
  coupon,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const emptyCartHandler = () => {
    dispatch(resetCart());
    axios
      .delete("/empty/user/cart")
      .then((response) => {
        if (response.data.success) {
          toast.info(response.data.message);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.warning(err.response.data.message);
        }
      });
  };

  const purchaseCODOrderHandler = () => {
    setLoading(true);
    axios
      .post("/create/user-order/cod", {
        COD: CODelivery,
        couponApplied: coupon,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          emptyCartHandler();
          dispatch({ type: COUPON_APPLIED, payload: false });
          dispatch({ type: COD, payload: false });
          toast.success(response.data.message);
          setTimeout(() => {
            history.push("/user/dashboard");
          }, 300);
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
  };

  const purchaseOrderHandler = () => {
    setLoading(true);
    axios
      .post("/create/user-order", {
        couponApplied: coupon,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          emptyCartHandler();
          dispatch({ type: COUPON_APPLIED, payload: false });
          toast.success(response.data.message);
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
  };

  return (
    <React.Fragment>
      <h3>خلاصه سفارش</h3>
      <hr className="my-2" />
      <div className="items_price_wrapper">
        {products.length > 0 &&
          products.map((item, i) => (
            <div key={i} className="checkout_item_price">
              <div className="checkout_price">
                <span>{item.product.title}</span>
                <strong className="mx-2 text-purple">X</strong>
                <span>{item.count}</span> <span className="mx-2"> = </span>
                <strong className="mx-1">
                  {(item.price * item.count).toLocaleString("fa")}
                </strong>
                تومان
              </div>
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
          ))}
        <div className="checkout_total_price">
          <strong>مجموع قیمت :</strong>
          <span className="finaly_total_price_digit">
            {totalPrice && totalPrice.toLocaleString("fa")}
          </span>
          تومان
        </div>
      </div>
      <hr className="my-2" />
      {totalAfterDiscount > 0 && (
        <div className="applyed_discount_wrapper">
          <span className="font-sm">کد تخفیف اعمال شد :</span>
          <div className="finaly_price_after_discount">
            <span className="ml-2 font-sm">مبلغ نهایی :</span>
            <strong className="mr-2">
              {totalAfterDiscount.toLocaleString("fa")} تومان
            </strong>
          </div>
        </div>
      )}
      <p className="info-message">
        نوع پرداخت :{" "}
        <strong className="mr-2">
          {CODelivery ? "پرداخت در محل" : "پرداخت اینترنتی"}
        </strong>
      </p>
      <div className="purchase_btns_wrapper">
        {CODelivery ? (
          <Button
            type="button"
            disabled={
              !userInfo || !addressSaved || !totalPrice || totalPrice === 0
            }
            onClick={purchaseCODOrderHandler}
          >
            {loading ? <VscLoading className="loader" /> : "ثبت سفارش"}
          </Button>
        ) : (
          <Button
            type="button"
            disabled={
              !userInfo || !addressSaved || !totalPrice || totalPrice === 0
            }
            onClick={purchaseOrderHandler}
          >
            {loading ? <VscLoading className="loader" /> : "ثبت سفارش"}
          </Button>
        )}
        <Button
          type="button"
          disabled={!cartItems.length || !userInfo}
          onClick={emptyCartHandler}
        >
          خالی کردن سبد
        </Button>
      </div>
      {errorText.length > 0 && <p className="warning-message">{errorText}</p>}
    </React.Fragment>
  );
};

export default CheckoutHistory;
