import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INC_COUNT,
  DEC_COUNT,
  REQUEST_UPGRADE_CART_ITEMS,
  UPGRADE_CART_ITEMS,
  ERROR_UPGRADE_CART_ITEMS,
  RESET_CART_ITEMS,
  DELETE_DEPRECATED_ITEM,
  SET_COLORS,
} from "../Types/cartTypes";
import { db } from "../../util/indexedDB";
import axios from "../../util/axios";

export const addToCart = (productId) => (dispatch, getState) => {
  const cartItems = getState().cart.cartItems.slice();

  const existProduct = cartItems.find((op) => op.id === productId);

  if (!existProduct) {
    cartItems.push({
      id: productId,
      count: 1,
    });
  }
  dispatch({
    type: ADD_TO_CART,
    payload: { cartItems },
  });
  localStorage.setItem("gonshapUserCart", JSON.stringify(cartItems));
};

export const removeFromCart = (productId) => async (dispatch, getState) => {
  const cartItems = getState().cart.cartItems.slice();
  const cartItemsInfo = getState().cart.cartItemsInfo.slice();

  const existProductInfo = await cartItemsInfo.find(
    (product) => product._id === productId
  );

  if (existProductInfo) {
    const upgratedCartItems = cartItemsInfo.filter(
      (product) => product._id !== productId
    );

    dispatch({ type: UPGRADE_CART_ITEMS, payload: { upgratedCartItems } });
  }

  const updatedCartItems = await cartItems.filter(
    (item) => item.id !== productId
  );

  dispatch({
    type: REMOVE_FROM_CART,
    payload: { updatedCartItems },
  });

  localStorage.setItem("gonshapUserCart", JSON.stringify(updatedCartItems));
};

export const resetCart = () => (dispatch) => {
  dispatch({ type: RESET_CART_ITEMS });
  localStorage.removeItem("gonshapUserCart");
};

export const incCountHandler = (productId, newCount) => (
  dispatch,
  getState
) => {
  const cartItems = getState().cart.cartItems.slice();
  const exist = cartItems.find((item) => item.id === productId);

  if (exist && newCount) {
    exist.count = newCount;
  } else if (exist) {
    exist.count++;
  }

  dispatch({
    type: INC_COUNT,
    payload: { cartItems },
  });
  localStorage.setItem("gonshapUserCart", JSON.stringify(cartItems));
};

export const decCountHandler = (productId) => (dispatch, getState) => {
  const cartItems = getState().cart.cartItems.slice();

  const exist = cartItems.find((item) => item.id === productId);
  if (exist && exist.count > 1) {
    exist.count--;
  }
  if (exist.colors && exist.colors.length > exist.count) {
    exist.colors.splice(exist.count, exist.colors.length - exist.count);
  }
  dispatch({
    type: DEC_COUNT,
    payload: { cartItems },
  });
  localStorage.setItem("gonshapUserCart", JSON.stringify(cartItems));
};

export const upgradeCartItems = () => async (dispatch, getState) => {
  const cartItems = getState().cart.cartItems.slice();

  await dispatch({ type: REQUEST_UPGRADE_CART_ITEMS });

  let existCartItems = cartItems.map((item) => item.id);

  await axios
    .post("/fetch/cart-items", { cartItems: existCartItems })
    .then((response) => {
      const { success, upgratedCartItems, deprecatedItems } = response.data;
      if (success) {
        dispatch({
          type: UPGRADE_CART_ITEMS,
          payload: { upgratedCartItems },
        });

        db.cartItemsInfo.clear()
        db.cartItemsInfo.bulkPut(upgratedCartItems)

        if (deprecatedItems.length > 0) {
          let copyOfCartItems = cartItems;

          deprecatedItems.forEach((product) => {
            let existingCartItem = copyOfCartItems.filter(
              (item) => item.id.toString() !== product._id.toString()
            );
            copyOfCartItems = existingCartItem;
          });

          dispatch({
            type: DELETE_DEPRECATED_ITEM,
            payload: { deprecatedItems, newCartItems: copyOfCartItems },
          });
          localStorage.setItem(
            "gonshapUserCart",
            JSON.stringify(copyOfCartItems)
          );
        }
      }
    })
    .catch((err) => {
      if (typeof err.response.data.message === "object") {
        dispatch({
          type: ERROR_UPGRADE_CART_ITEMS,
          payload: err.response.data.message[0],
        });
      } else {
        dispatch({
          type: ERROR_UPGRADE_CART_ITEMS,
          payload: err.response.data.message,
        });
      }
    });
};

export const setItemsColors = (productId, colors) => (dispatch, getState) => {
  const cartItems = getState().cart.cartItems.slice();

  const existProduct = cartItems.find((op) => op.id === productId);

  if (existProduct) {
    existProduct.colors = colors;
  }

  dispatch({ type: SET_COLORS, payload: { cartItems } });

  localStorage.setItem("gonshapUserCart", JSON.stringify(cartItems));
};
