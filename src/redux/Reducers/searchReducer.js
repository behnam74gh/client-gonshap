import {
  SEARCH_QUERY,
  SUBMIT_QUERY,
  UNSUBMIT_QUERY,
} from "../Types/searchInputTypes";

export const searchReducer = (
  state = { text: "", submited: false },
  action
) => {
  switch (action.type) {
    case SEARCH_QUERY:
      return { text: action.payload.keyword, submited: false };
    case SUBMIT_QUERY:
      return {
        ...state,
        submited: true,
      };
    case UNSUBMIT_QUERY:
      return {
        text: "",
        submited: false,
      };
    default:
      return state;
  }
};
