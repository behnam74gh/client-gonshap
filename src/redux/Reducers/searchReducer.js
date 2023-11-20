import {
  SEARCH_QUERY,
  SUBMIT_QUERY,
  UNSUBMIT_QUERY,
  SUGGEST_OPEN,
  SUGGEST_CLOSE,
  PUSH_QUERY,
  UNSUBMIT,
  TOGGLE_SEARCH_OPTION,
} from "../Types/searchInputTypes";

export const searchReducer = (
  state = { text: "", submited: false, dropdown: false, searchByText: true },
  action
) => {
  switch (action.type) {
    case SEARCH_QUERY:
      return { 
        ...state,
        text: action.payload.keyword,
        // submited: false
      };
    case PUSH_QUERY:
      return {
        ...state,
        text: action.payload.keyword,
        dropdown: false
      };
    case SUBMIT_QUERY:
      return {
        ...state,
        submited: true,
      };
    case UNSUBMIT_QUERY:
      return {
        ...state,
        text: "",
        submited: false,
        dropdown: false
      };
    case UNSUBMIT:
      return {
        ...state,
        submited: false
      }
    case SUGGEST_OPEN:
      return {
        ...state,
        dropdown: true
      }
    case SUGGEST_CLOSE:
      return {
        ...state,
        dropdown: false
      }
    case TOGGLE_SEARCH_OPTION:
      return {
        ...state,
        searchByText: action.payload
      }
    default:
      return state;
  }
};
