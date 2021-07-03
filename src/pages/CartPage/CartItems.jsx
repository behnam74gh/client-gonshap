import React from "react";
import CartItem from "./CartItem";

const CartItems = ({ cartItems }) => {
  return (
    <React.Fragment>
      {cartItems &&
        cartItems.length > 0 &&
        cartItems.map((item, i) => <CartItem key={i} product={item} />)}
    </React.Fragment>
  );
};

export default CartItems;
