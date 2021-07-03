import {
  USER_CONFIG_TO_SEARCH,
  DELETE_USER_CONFIG_TO_SEARCH,
} from "../Types/shopTypes";

export const shopReducer = (
  state = {
    searchConfig: localStorage.getItem("gonshapSearchConfig")
      ? JSON.parse(localStorage.getItem("gonshapSearchConfig"))
      : {},
  },
  action
) => {
  switch (action.type) {
    case USER_CONFIG_TO_SEARCH:
      return {
        searchConfig: action.payload,
      };
    case DELETE_USER_CONFIG_TO_SEARCH:
      return {
        searchConfig: {},
      };
    default:
      return state;
  }
};
