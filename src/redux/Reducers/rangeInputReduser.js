import { PUT_RANGE_VALUES,POP_RANGE_VALUES } from "../Types/rangeInputTypes";

const initialState = {
  min: 10,
  max: 5000
}

export const rangeInputReduser = (state = initialState, action) => {
    switch (action.type) {
      case PUT_RANGE_VALUES:
        return {
          min: action.payload.min,
          max: action.payload.max
        };
      case POP_RANGE_VALUES:
        return {
          min: 10,
          max: 5000
        }
      default:
        return state;
    }
};
  