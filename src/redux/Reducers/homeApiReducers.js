import { 
  CLEAR_NEWEST_PRODUCTS, SAVE_NEWEST_PRODUCTS,SAVE_ACTIVE_REGION_SUPPLIERS, SAVE_DISCOUNT_PRODUCTS,
  SAVE_REVIEWED_PRODUCTS,SAVE_SOLD_PRODUCTS,CLEAR_SOLD_PRODUCTS, SAVE_FAQ, SAVE_SUGGESTS,
} from '../Types/homeApiTypes';

const initialState = {
  suppliers: {
    suppliersLength: 0,
    validTime: null,
    configData: null
  },
  newestProducts: {
    items: [],
    validTime: null,
    configData: null
  },
  discountProducts: {
    items: [],
    validTime: null,
    configData: null
  },
  soldProducts: {
    items: [],
    validTime: null,
    configData: null
  },
  reviewedProducts: {
    items: [],
    validTime: null,
    configData: null
  },
  suggests: {
    items: [],
    validTime: null,
    configData: null
  },
  faq: {
    items: [],
    validTime: null,
    configData: null
  },
}

export const homeApiReducers = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_ACTIVE_REGION_SUPPLIERS:
        return {
          ...state,
          suppliers: {
            suppliersLength: action.payload.suppliersLength,
            configData: action.payload.configData,
            validTime: Date.now()+(1000*60*15)
          }
        };
      case SAVE_NEWEST_PRODUCTS:
        return {
          ...state,
          newestProducts: {
            items: action.payload.items,
            configData: action.payload.configData,
            validTime: Date.now()+(1000*60*15)
          }
        };
      case CLEAR_NEWEST_PRODUCTS:
        return {
          ...state,
          newestProducts: {
            items: [],
            validTime: null,
            configData: null
          }
        };
      case SAVE_DISCOUNT_PRODUCTS:
        return {
          ...state,
          discountProducts: {
            items: action.payload.items,
            configData: action.payload.configData,
            validTime: Date.now()+(1000*60*15)
          }
        };
      case SAVE_REVIEWED_PRODUCTS:
        return {
          ...state,
          reviewedProducts: {
            items: action.payload.items,
            configData: action.payload.configData,
            validTime: Date.now()+(1000*60*15)
          }
        };
      case SAVE_SOLD_PRODUCTS:
        return {
          ...state,
          soldProducts: {
            items: action.payload.items,
            configData: action.payload.configData,
            validTime: Date.now()+(1000*60*15)
          }
        };
      case CLEAR_SOLD_PRODUCTS:
        return {
          ...state,
          soldProducts: {
            items: [],
            validTime: null,
            configData: null
          }
        }; 
      case SAVE_SUGGESTS:
        return {
          ...state,
          suggests: {
            items: action.payload.items,
            configData: "suggests",
            validTime: Date.now()+(1000*60*15)
          }
        };
      case SAVE_FAQ:
        return {
          ...state,
          faq: {
            items: action.payload.items,
            configData: "faq",
            validTime: Date.now()+(1000*60*15)
          }
        };
      default:
        return state;
    }
};
  