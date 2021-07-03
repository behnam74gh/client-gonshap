import {
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  REQUEST_UPGRADE_FAVORITES,
  UPGRADE_FAVORITES,
  ERROR_UPGRADE_FAVORITES,
  DELETE_DEPRECATED_FAVORITES_ITEM,
} from "../Types/favoriteTypes";

const initialState = {
  loading: false,
  favoriteItems: localStorage.getItem("gonshapUserFavorites")
    ? JSON.parse(localStorage.getItem("gonshapUserFavorites"))
    : [],
  errorText: "",
  favoriteItemsInfo: [],
  deprecatedFavoriteItems: [],
};

export const favoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_FAVORITES:
      return {
        ...state,
        favoriteItems: action.payload.favoriteItems,
      };
    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favoriteItems: action.payload.updatedFavoriteItems,
      };
    case REQUEST_UPGRADE_FAVORITES:
      return {
        ...state,
        loading: true,
      };
    case UPGRADE_FAVORITES:
      return {
        ...state,
        loading: false,
        favoriteItemsInfo: action.payload.upgratedCartItems,
      };
    case ERROR_UPGRADE_FAVORITES:
      return {
        ...state,
        loading: false,
        errorText: action.payload,
      };
    case DELETE_DEPRECATED_FAVORITES_ITEM:
      return {
        ...state,
        deprecatedFavoriteItems: action.payload.deprecatedItems,
        favoriteItems: action.payload.newCartItems,
      };
    default:
      return state;
  }
};
