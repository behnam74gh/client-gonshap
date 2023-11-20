import { PUSH_STORE_ITEM,POP_STORE_ITEM } from '../Types/supplierItemTypes';

export const supplierItemReducer = (state = { storeItem: null }, action) => {
    switch (action.type) {
      case PUSH_STORE_ITEM:
        return {
          storeItem: action.payload
        };
      case POP_STORE_ITEM:
        return {
          storeItem: null
        };
      default:
        return state;
    }
};
  