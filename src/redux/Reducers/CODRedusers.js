import { COD } from "../Types/CODTypes";

export const CODReducer = (state = false, action) => {
  switch (action.type) {
    case COD:
      return action.payload;
    default:
      return state;
  }
};
