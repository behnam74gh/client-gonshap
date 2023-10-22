import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import LoadingSkeletonCard from "../../components/Home/Shared/LoadingSkeletonCard";
import axios from "../../util/axios.js";
import "../Admin/CommentsList/CommentsList.css";

const CartTotalInfo = ({cartItemsInfo}) => {
  const [loading2, setLoading2] = useState(false);

  const { cart, userSignin,isOnline } = useSelector((state) => ({ ...state }));

  const { cartItems, loading } = cart;
  const { userInfo } = userSignin;

  const history = useHistory();

  const purchaseCheckoutHandler = () => {
    if(!navigator.onLine) {
      toast.warn('شما آفلاین هستید')
      return;
    }
    let activeCartItems = [];
    let notExistItemsLength = 0;

    cartItems.forEach((item) => {
      const product = cartItemsInfo.find((p) => p._id === item.id);
      if (product.countInStock < 1) {
        notExistItemsLength += 1;
      } else {
        activeCartItems.push(item);
      }
    });

    let colorNeededItem = activeCartItems.find((item) =>
      item.colors ? item.colors.length < item.count : item
    );

    if (colorNeededItem || activeCartItems.length < 1) {
      return colorNeededItem ? toast.warning("رنگ کالا را مشخص نکردید") : toast.warning('محصول ناموجود شده است و امکان ثبت سفارش وجود ندارد');
    } else {
      setLoading2(true);

      axios
        .post("/save/user-cart", { cartItems: activeCartItems })
        .then((response) => {
          if (response.data.success) {
            setLoading2(false);
            if (activeCartItems.length < cartItems.length) {
              toast.info(
                `${
                  notExistItemsLength > 1 ? "محصولاتی" : "محصولی"
                } که ناموجود ${
                  notExistItemsLength > 1 ? "بودند" : "بود"
                } در سبد شما محاسبه ${
                  notExistItemsLength > 1 ? "نشدند!" : "نشد!"
                }`
              );
            }
            history.push({
              pathname: "/checkout",
              state: {
                from: `/cart`,
              },
            });
          }
        })
        .catch((err) => {
          setLoading2(false);
          if (err.response) {
            toast.warning(err.response.data.message);
          }
        });
    }
  };

  return loading ? (
    <LoadingSkeletonCard count={1} />
  ) : (
    <React.Fragment>
      <h4>محصولات</h4>
      <hr className="my-2" />
      {cartItemsInfo && cartItemsInfo.length > 0 ? (
        cartItemsInfo.map((item) => (
          <div key={item._id} className="total_price_wrapper">
            <span>{item.title}</span>
            <strong className="mx-2 text-purple">X</strong>
            <span>
              {cartItems.find((product) => product.id === item._id).count}
            </span>{" "}
            <span className="mx-2"> = </span>
            <strong className="mx-1">
              {(
                cartItems.find((product) => product.id === item._id).count *
                item.finallyPrice
              ).toLocaleString("fa")}
            </strong>
            تومان
          </div>
        ))
      ) : (
        <p className="warning-message">محصولی وجود ندارد</p>
      )}
      {cartItems.length > 0 && (
        <div className="total_price">
          <strong>مجموع قیمت :</strong>
          <span className="finaly_total_price_digit">
            {cartItemsInfo &&
              cartItemsInfo.length > 0 &&
              cartItemsInfo
                .reduce(
                  (a, item) =>
                    a +
                    cartItems.find((product) => product.id === item._id).count *
                      item.finallyPrice,
                  0
                )
                .toLocaleString("fa")}
          </span>
          تومان
        </div>
      )}
      <hr className="my-2" />
      {!userInfo && (
        <strong className="w-100 font-sm text-center">
          جهت اقدام به خرید ابتدا وارد حساب کاربری خود شوید!
        </strong>
      )}
      {cartItems.length > 0 && (
        <div className="cart_checkout_btns_wrapper">
          {userInfo && userInfo.userId ? (
            <button
              type="button"
              disabled={!cartItems.length || userInfo.isBan || loading2 || !isOnline}
              onClick={purchaseCheckoutHandler}
              className="modal_btn bg-purple w-45 p-0"
            >
              {loading2 ? (
                <VscLoading className="loader my-2" />
              ) : (
                "ثبت سفارش"
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={!cartItems.length || !isOnline}
              className="modal_btn bg-purple w-100 py-3"
              onClick={() =>
                history.push({
                  pathname: "/signin",
                  state: {
                    from: `/cart`,
                  },
                })
              }
            >
              ورود به حساب جهت خرید
            </button>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default CartTotalInfo;
