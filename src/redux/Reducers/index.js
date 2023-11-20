import { combineReducers } from "redux";
import { userSigninReducer } from "./authReducers";
import { subMenuReducer } from "./subMenuReducer";
import { ratingModalReducer } from "./ratingModalReducer";
import { cartReducer } from "./cartReducers";
import { favoritesReducer } from "./favoriteReducers";
import { searchReducer } from "./searchReducer";
import { shopReducer } from "./shopReducers";
import { advertiseReducer } from "./advertise";
import { isMobileReducer } from "./isMobileReduser";
import { isOnlineReducer } from "./isOnlineReducer";
import { searchedItemReducer } from "./searchedItemReducer";
import { supplierItemReducer } from "./supplierItemReducer";
import { rangeInputReduser } from "./rangeInputReduser";

const rootReducer = combineReducers({
  userSignin: userSigninReducer,
  subMenu: subMenuReducer,
  ratingModal: ratingModalReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  search: searchReducer,
  shopConfig: shopReducer,
  advertise: advertiseReducer,
  isMobile: isMobileReducer,
  isOnline: isOnlineReducer,
  searchedItem: searchedItemReducer,
  supplierItem: supplierItemReducer,
  rangeValues: rangeInputReduser,
});

export default rootReducer;
