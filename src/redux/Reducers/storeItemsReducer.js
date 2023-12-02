import { SAVE_STORE_ITEMS,CLEAR_STORE_ITEMS } from '../Types/storeItemsTypes';

const initialState = {
  items: [],
  itemsLength: 0,
  validTime: null
}

export const storeItemsReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_STORE_ITEMS:
        return {
          items: action.payload.items,
          itemsLength: action.payload.length,
          validTime: Date.now()+(1000*60*60*2)
        };
      case CLEAR_STORE_ITEMS:
        return {
          items: [],
          itemsLength: 0,
          validTime: null
        };
      default:
        return state;
    }
};
  