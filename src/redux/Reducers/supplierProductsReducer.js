import { SAVE_SUPPLIER_PRODUCTS,CLEAR_SUPPLIER_PRODUCTS,CLEAR_SUPPLIER_ACTIVE_PRODUCTS } from '../Types/supplierProductsTypes';

export const supplierProductsReducer = (state = { items: [],itemsLength: 0 }, action) => {
    switch (action.type) {
      case SAVE_SUPPLIER_PRODUCTS:
        return {
          items: action.payload.items,
          itemsLength: action.payload.length
        };
      case CLEAR_SUPPLIER_PRODUCTS:
        return {
          items: [],
          itemsLength: 0
        };
      case CLEAR_SUPPLIER_ACTIVE_PRODUCTS:
        return {
          ...state,
          items: []
        }
      default:
        return state;
    }
};
  