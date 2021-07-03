import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { upgradeCartItems } from "../../redux/Actions/cartActions";
import CartItems from "./CartItems";
import CartTotalInfo from "./CartTotalInfo";
import defPic from "../../assets/images/def.jpg";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import LoadingSkeleton from "../../components/UI/LoadingSkeleton/LoadingSkeleton";
import Section5 from "../../components/Home/Section5/Section5";
import Section8 from "../../components/Home/Section8/Section8";
import "./CartPage.css";

const CartPage = () => {
  const [showDeprecatedItems, setShowDeprecatedItems] = useState(false);
  const { cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const {
    cartItems,
    cartItemsInfo,
    deprecatedItems,
    loading,
    errorText,
  } = cart;

  useEffect(() => {
    dispatch(upgradeCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (deprecatedItems && deprecatedItems.length > 0) {
      setShowDeprecatedItems(true);
    }
  }, [deprecatedItems]);

  const closeDeprecatedItemsHandler = () => setShowDeprecatedItems(false);

  return (
    <section id="cart_page">
      <div className="cart_wrapper">
        <div className="cart_items_wrapper">
          <h2 className="text-mute">
            خلاصه سبد خرید
            <strong className="cart_length">{cartItems.length}</strong>
          </h2>
          {loading ? (
            <React.Fragment>
              {cartItems &&
                cartItems.length > 0 &&
                cartItems.map((item, i) => <LoadingSkeleton key={i} />)}
            </React.Fragment>
          ) : errorText && errorText.length > 0 ? (
            <p className="warning-message">{errorText}</p>
          ) : cartItems && cartItems.length > 0 ? (
            <CartItems cartItems={cartItemsInfo} />
          ) : (
            <p className="warning-message">سبد خرید شما خالی است</p>
          )}
        </div>
        <div className="cart_details_wrapper">
          <div className="text-mute">
            <h2>خلاصه سفارش</h2>
          </div>
          <CartTotalInfo />
        </div>
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
                این محصولات دیگر ارائه نمیشوند :
              </h6>
            </div>
            {deprecatedItems &&
              deprecatedItems.length > 0 &&
              deprecatedItems.map((product, i) => (
                <div key={i} className="deprecated_item">
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
      <Section8 />
      <Section5 />
    </section>
  );
};

export default CartPage;
