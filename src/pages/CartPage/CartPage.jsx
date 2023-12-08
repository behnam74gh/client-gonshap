import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { upgradeCartItems } from "../../redux/Actions/cartActions";
import CartItems from "./CartItems";
import CartTotalInfo from "./CartTotalInfo";
import defPic from "../../assets/images/def.jpg";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import LoadingSkeleton from "../../components/UI/LoadingSkeleton/LoadingSkeleton";
import { db } from "../../util/indexedDB";
import { Helmet } from "react-helmet-async";
import { ReactComponent as EmptyCartSvg } from '../../assets/images/empty_cart.svg'
import "./CartPage.css";

const CartPage = () => {
  const [showDeprecatedItems, setShowDeprecatedItems] = useState(false);
  const [oldCartItemsInfo,setOldCartItemsInfo] = useState([])

  const { cart,isOnline } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const {
    cartItems,
    cartItemsInfo,
    deprecatedItems,
    loading,
    errorText,
  } = cart;

  useEffect(() => {
    if (isOnline && navigator.onLine){
      dispatch(upgradeCartItems());
    }else{
      db.cartItemsInfo.toArray()
      .then(items => {
        if(items?.length > 0){
          setOldCartItemsInfo(items)
        }
      })
    }
  }, [dispatch,isOnline]);

  useEffect(() => {
    if (deprecatedItems && deprecatedItems.length > 0) {
      setShowDeprecatedItems(true);
    }
  }, [deprecatedItems]);

  const closeDeprecatedItemsHandler = () => setShowDeprecatedItems(false);

  return (
    <section id="cart_page">
      <Helmet>
        <title>سبد خرید</title>
        <meta
          name="description"
          content="محصولاتی که در سبد خرید کاربر قرار دارند، به نمایش گذاشته میشوند جهت ثبت سفارش از فروشگاه های بازارچک"
        />
      </Helmet>
      <div className="cart_wrapper">
        <div className="cart_items_wrapper">
          <h4 className="text-mute">
            خلاصه سبد خرید
            <strong className="cart_length ml-1">{cartItems.length}</strong>
            محصول
          </h4>
          {loading ? (
            <React.Fragment>
              {cartItems &&
                cartItems.length > 0 &&
                cartItems.map((item) => <LoadingSkeleton key={item.id} />)}
            </React.Fragment>
          ) : errorText && errorText.length > 0 ? (
            <p className="warning-message">{errorText}</p>
          ) : cartItems && cartItems.length > 0 ? (
            <CartItems cartItems={isOnline ? cartItemsInfo : oldCartItemsInfo} />
          ) : (
            <div className="empty_cart_wrapper">
              <EmptyCartSvg />
              <p className="warning-message w-100">سبد خرید شما خالی است</p>
            </div>
          )}
        </div>
       {(cartItemsInfo || oldCartItemsInfo).length > 0 && <div className="cart_details_wrapper">
          <div className="text-mute">
            <h4>خلاصه سفارش</h4>
          </div>
          <CartTotalInfo cartItemsInfo={isOnline ? cartItemsInfo : oldCartItemsInfo} />
        </div>}
      </div>
      <Backdrop
        show={showDeprecatedItems}
        onClick={closeDeprecatedItemsHandler}
      />
      {showDeprecatedItems && deprecatedItems.length > 0 && (
        <div className="deprecated_items_wrapper">
          <div className="deprecated_second_wrapper">
            <div className="deprecated_item">
              <h6 className="deprecated_header">
                این محصولات به دلیل  ارائه نشدن از سبد شما حذف شدند :
              </h6>
            </div>
            {deprecatedItems &&
              deprecatedItems.length > 0 &&
              deprecatedItems.map((product) => (
                <div key={product._id} className="deprecated_item">
                  <p className="deprecated_item_title">{product.title}</p>

                  <img
                    src={
                      !product.photos[0].length
                        ? `${defPic}`
                        : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${product.photos[0]}`
                    }
                    className="deprecated_img"
                    alt={product.title}
                  />
                </div>
              ))}
            <span
              className="deprecated_close"
              onClick={closeDeprecatedItemsHandler}
            >
              <FaTimes />
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;
