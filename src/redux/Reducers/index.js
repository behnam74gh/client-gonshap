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
import { storeItemsReducer } from "./storeItemsReducer";
import { supplierProductsReducer } from "./supplierProductsReducer";
import { shopProductsReducer } from "./shopProductsReducer";
import { homeApiReducers } from "./homeApiReducers";
import { ttlDataReducers } from "./ttlDataReducers";

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
  storeItems: storeItemsReducer,
  supplierProducts: supplierProductsReducer,
  shopProducts: shopProductsReducer,
  cachedHomeApis: homeApiReducers,
  ttlDatas: ttlDataReducers
});

export default rootReducer;
