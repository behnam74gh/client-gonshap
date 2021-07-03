import {
  OPEN_STAR_RATING_MODAL,
  CLOSE_STAR_RATING_MODAL,
} from "../Types/ratingModalType";

const initialState = {
  modalOpen: false,
};

export const ratingModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_STAR_RATING_MODAL:
      return {
        modalOpen: true,
      };
    case CLOSE_STAR_RATING_MODAL:
      return {
        modalOpen: false,
      };
    default:
      return state;
  }
};
