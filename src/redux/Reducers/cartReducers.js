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

const initialState = {
  loading: false,
  cartItems: localStorage.getItem("gonshapUserCart")
    ? JSON.parse(localStorage.getItem("gonshapUserCart"))
    : [],
  errorText: "",
  cartItemsInfo: [],
  deprecatedItems: [],
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: action.payload.cartItems,
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: action.payload.updatedCartItems,
      };
    case INC_COUNT:
      return {
        ...state,
        cartItems: action.payload.cartItems,
      };
    case DEC_COUNT:
      return {
        ...state,
        cartItems: action.payload.cartItems,
      };
    case REQUEST_UPGRADE_CART_ITEMS:
      return {
        ...state,
        loading: true,
      };
    case UPGRADE_CART_ITEMS:
      return {
        ...state,
        loading: false,
        cartItemsInfo: action.payload.upgratedCartItems,
      };
    case ERROR_UPGRADE_CART_ITEMS:
      return {
        ...state,
        loading: false,
        errorText: action.payload,
      };
    case DELETE_DEPRECATED_ITEM:
      return {
        ...state,
        deprecatedItems: action.payload.deprecatedItems,
        cartItems: action.payload.newCartItems,
      };
    case SET_COLORS:
      return {
        ...state,
        cartItems: action.payload.cartItems,
      };
    case RESET_CART_ITEMS:
      return {
        cartItems: [],
      };
    default:
      return state;
  }
};
