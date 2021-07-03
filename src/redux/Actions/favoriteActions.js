import {
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  REQUEST_UPGRADE_FAVORITES,
  UPGRADE_FAVORITES,
  ERROR_UPGRADE_FAVORITES,
  DELETE_DEPRECATED_FAVORITES_ITEM,
} from "../Types/favoriteTypes";
import axios from "../../util/axios";

export const addToFavorites = (productId) => (dispatch, getState) => {
  const favoriteItems = getState().favorites.favoriteItems.slice();

  const existProduct = favoriteItems.find((op) => op === productId);

  if (!existProduct) {
    favoriteItems.push(productId);
  }
  dispatch({
    type: ADD_TO_FAVORITES,
    payload: { favoriteItems },
  });
  localStorage.setItem("gonshapUserFavorites", JSON.stringify(favoriteItems));
};

export const removeFromFavorites = (productId) => async (
  dispatch,
  getState
) => {
  const favoriteItems = getState().favorites.favoriteItems.slice();
  const favoriteItemsInfo = getState().favorites.favoriteItemsInfo.slice();

  const existProductInfo = await favoriteItemsInfo.find(
    (product) => product._id === productId
  );

  if (existProductInfo) {
    const upgratedCartItems = favoriteItemsInfo.filter(
      (product) => product._id !== productId
    );

    dispatch({ type: UPGRADE_FAVORITES, payload: { upgratedCartItems } });
  }

  const updatedFavoriteItems = await favoriteItems.filter(
    (item) => item !== productId
  );

  dispatch({
    type: REMOVE_FROM_FAVORITES,
    payload: { updatedFavoriteItems },
  });

  localStorage.setItem(
    "gonshapUserFavorites",
    JSON.stringify(updatedFavoriteItems)
  );
};

export const upgradeFavoriteItems = () => async (dispatch, getState) => {
  const favoriteItems = getState().favorites.favoriteItems.slice();

  await dispatch({ type: REQUEST_UPGRADE_FAVORITES });

  await axios
    .post("/fetch/cart-items", { cartItems: favoriteItems })
    .then((response) => {
      const { success, upgratedCartItems, deprecatedItems } = response.data;
      if (success) {
        dispatch({
          type: UPGRADE_FAVORITES,
          payload: { upgratedCartItems },
        });

        if (deprecatedItems.length > 0) {
          let copyOfFavoriteItems = favoriteItems;

          deprecatedItems.forEach((product) => {
            let existingFavoriteItems = copyOfFavoriteItems.filter(
              (item) => item.toString() !== product._id.toString()
            );
            copyOfFavoriteItems = existingFavoriteItems;
          });

          dispatch({
            type: DELETE_DEPRECATED_FAVORITES_ITEM,
            payload: { deprecatedItems, newCartItems: copyOfFavoriteItems },
          });
          localStorage.setItem(
            "gonshapUserFavorites",
            JSON.stringify(copyOfFavoriteItems)
          );
        }
      }
    })
    .catch((err) => {
      if (typeof err.response.data.message === "object") {
        dispatch({
          type: ERROR_UPGRADE_FAVORITES,
          payload: err.response.data.message[0],
        });
      } else {
        dispatch({
          type: ERROR_UPGRADE_FAVORITES,
          payload: err.response.data.message,
        });
      }
    });
};
