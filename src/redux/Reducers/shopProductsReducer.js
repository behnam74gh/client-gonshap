import { SAVE_SHOP_PRODUCTS,CLEAR_SHOP_PRODUCTS,SET_ALL_BRANDS, UPDATE_ALL_BRANDS, CLEAR_ALL_BRANDS, CLEAR_ITEMS, PUSH_OLD_ITEMS } from '../Types/shopProductsTypes';

const initialState = {
  items: [],
  itemsLength: 0,
  allBrands: [],
  oldProductsCount: 0
}

export const shopProductsReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_SHOP_PRODUCTS:
        return {
          ...state,
          items: action.payload.items,
          itemsLength: action.payload.length
        };
      case CLEAR_SHOP_PRODUCTS:
        return {
          ...state,
          items: [],
          itemsLength: 0,
          oldProductsCount: 0
        };
      case UPDATE_ALL_BRANDS:
        return {
          ...state,
          allBrands: action.payload.brands,
          items: [],
          itemsLength: 0
        }
      case SET_ALL_BRANDS:
        return {
          ...state,
          allBrands: action.payload.brands
        }
      case CLEAR_ALL_BRANDS:
        return {
          ...state,
          allBrands: []
        }
      case CLEAR_ITEMS:
        return {
          ...state,
          items: [],
          itemsLength: 0,
          oldProductsCount: 0
        }
      case PUSH_OLD_ITEMS:
        return {
          ...state,
          oldProductsCount: action.payload
        }
      default:
        return state;
    }
};
  