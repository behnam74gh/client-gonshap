import React from "react";
import CartItem from "./CartItem";

const CartItems = ({ cartItems }) => {
  return (
    <React.Fragment>
      {cartItems?.length > 0 &&
        cartItems.map((item) => <CartItem key={item._id} product={item} />)}
    </React.Fragment>
  );
};

export default CartItems;
