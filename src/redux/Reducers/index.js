import { combineReducers } from "redux";
import { userSigninReducer } from "./authReducers";
import { subMenuReducer } from "./subMenuReducer";
import { ratingModalReducer } from "./ratingModalReducer";
import { cartReducer } from "./cartReducers";
import { favoritesReducer } from "./favoriteReducers";
import { searchReducer } from "./searchReducer";
import { shopReducer } from "./shopReducers";
import { advertiseReducer } from "./advertise";
import { CODReducer } from "./CODRedusers";
import { isMobileReducer } from "./isMobileReduser";
import { isOnlineReducer } from "./isOnlineReducer";

const rootReducer = combineReducers({
  userSignin: userSigninReducer,
  subMenu: subMenuReducer,
  ratingModal: ratingModalReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  search: searchReducer,
  shopConfig: shopReducer,
  advertise: advertiseReducer,
  CODelivery: CODReducer,
  isMobile: isMobileReducer,
  isOnline: isOnlineReducer,
});

export default rootReducer;
