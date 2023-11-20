import { PUSH_ITEM,POP_ITEM } from '../Types/searchedItemTypes';

export const searchedItemReducer = (state = { productItem: null }, action) => {
    switch (action.type) {
      case PUSH_ITEM:
        return {
            productItem: action.payload
        };
      case POP_ITEM:
        return {
            productItem: null
        };
      default:
        return state;
    }
};
  