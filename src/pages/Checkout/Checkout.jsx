import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import axios from "../../util/axios";
import CheckoutForms from "./CheckoutForms";
import CheckoutHistory from "./CheckoutHistory";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import "./Checkout.css";

const Checkout = ({history}) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [addressSaved, setAddressSaved] = useState(false);
  const [categories,setCategories] = useState([])
  const [oldAddress,setOldAddress] = useState("")

  const { cart, userSignin } = useSelector((state) => ({
    ...state,
  }));

  const { cartItems } = cart;
  const { userInfo } = userSignin;

  useEffect(() => {
    const {from} = history.location.state
    if(from === '/cart'){
      setLoading(true);
      axios
        .get("/read/user/cart")
        .then((response) => {
          setLoading(false);
          const {
            success,
            products,
            cartTotal,
            categories,
            address
          } = response.data;
          if (success) {
            setProducts(products);
            setTotalPrice(cartTotal);
            setCategories(categories)
            if(address.length > 0){
              setOldAddress(address);
              setAddressSaved(true)
            }
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            setErrorText(err.response.data.message);
          }
        });
    }else{
      history.push('/')
    }
  }, [history]);
  
  return (
    <section id="checkout_page">
      <Helmet>
        <title>صفحه تایید سفارش</title>
      </Helmet>
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
              addressSaved={addressSaved}
              categoriesLength={categories.length}
              oldAddress={oldAddress}
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
              />
            </div>
          )}
        </React.Fragment>
      )}
    </section>
  );
};

export default Checkout;
