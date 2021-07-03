import {
  USER_CONFIG_TO_SEARCH,
  DELETE_USER_CONFIG_TO_SEARCH,
} from "../Types/shopTypes";

export const searchByUserFilter = (searchConfig) => (dispatch) => {
  dispatch({ type: USER_CONFIG_TO_SEARCH, payload: searchConfig });
  localStorage.setItem("gonshapSearchConfig", JSON.stringify(searchConfig));
};

export const deleteSearchConfig = () => (dispatch) => {
  dispatch({ type: DELETE_USER_CONFIG_TO_SEARCH });
  localStorage.removeItem("gonshapSearchConfig");
  localStorage.removeItem("gonshapPageNumber");
};
