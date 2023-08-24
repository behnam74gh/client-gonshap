import { combineReducers } from "redux";
import { userSigninReducer } from "./authReducers";
import { subMenuReducer } from "./subMenuReducer";
import { ratingModalReducer } from "./ratingModalReducer";
import { cartReducer } from "./cartReducers";
import { favoritesReducer } from "./favoriteReducers";
import { searchReducer } from "./searchReducer";
import { shopReducer } from "./shopReducers";
import { couponReducer } from "./couponReducers";
import { CODReducer } from "./CODRedusers";
import { isMobileReducer } from "./isMobileReduser";

const rootReducer = combineReducers({
  userSignin: userSigninReducer,
  subMenu: subMenuReducer,
  ratingModal: ratingModalReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  search: searchReducer,
  shopConfig: shopReducer,
  coupon: couponReducer,
  CODelivery: CODReducer,
  isMobile: isMobileReducer
});

export default rootReducer;
