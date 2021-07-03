import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import axios from "../../util/axios";
import CheckoutForms from "./CheckoutForms";
import CheckoutHistory from "./CheckoutHistory";
import { useSelector } from "react-redux";
import "./Checkout.css";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [addressSaved, setAddressSaved] = useState(false);

  const { cart, userSignin, CODelivery, coupon } = useSelector((state) => ({
    ...state,
  }));

  const { cartItems } = cart;
  const { userInfo } = userSignin;

  useEffect(() => {
    setLoading(true);
    axios
      .get("/read/user/cart")
      .then((response) => {
        setLoading(false);
        const {
          success,
          products,
          cartTotal,
          totalAfterDiscount,
        } = response.data;
        if (success) {
          setProducts(products);
          setTotalPrice(cartTotal);
          setTotalAfterDiscount(totalAfterDiscount);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  return (
    <section id="checkout_page">
      {loading ? (
        <div className="d-flex-center-center w-100">
          <VscLoading className="loader" />
        </div>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <React.Fragment>
          <div className="user_checkout_info_wrapper">
            <CheckoutForms
              cartItems={cartItems}
              userInfo={userInfo}
              setAddressSaved={setAddressSaved}
              setTotalAfterDiscount={setTotalAfterDiscount}
              totalAfterDiscount={totalAfterDiscount}
            />
          </div>
          {products.length > 0 && (
            <div className="checkout_info_wrapper">
              <CheckoutHistory
                products={products}
                totalPrice={totalPrice}
                cartItems={cartItems}
                userInfo={userInfo}
                addressSaved={addressSaved}
                totalAfterDiscount={totalAfterDiscount}
                CODelivery={CODelivery}
                coupon={coupon}
              />
            </div>
          )}
        </React.Fragment>
      )}
    </section>
  );
};

export default Checkout;
