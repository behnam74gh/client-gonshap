import { TASKS,ORDERS_COUNT,CURRENT_SUPPLIER,AREA_CHART,CUSTOMER_ADS,CUSTOMER_INFO,CUSTOMER_LAST_ORDERS,CUSTOMER_LAST_TICKETS,LEAVE_DASHBOARD } from '../Types/ttlDataTypes';

const initialState = {
  tasks: {
    ttlTime: 0,
    data: null
  },
  ordersCount: {
    ttlTime: 0,
    data: null
  },
  currentSupplier: {
    ttlTime: 0,
    data: null
  },
  areaChart: {
    ttlTime: 0,
    data: null
  },
  customerLastOrders: {
    ttlTime: 0,
    data: null
  },
  customerAds: {
    ttlTime: 0,
    data: null
  },
  customerLastTicket: {
    ttlTime: 0,
    data: null
  },
  customerInfo: {
    ttlTime: 0,
    data: null
  },
}

export const ttlDataReducers = (state = initialState, action) => {
    switch (action.type) {
      case TASKS:
        return {
          ...state,
          tasks : {
            ttlTime: action.payload.ttlTime,
            data: action.payload.data
          }
        };
      case ORDERS_COUNT:
        return {
          ...state,
          ordersCount : {
            ttlTime: action.payload.ttlTime,
            data: action.payload.data
          }
        };
      case CURRENT_SUPPLIER:
        return {
          ...state,
          currentSupplier : {
            ttlTime: action.payload.ttlTime,
            data: action.payload.data
          }
        };
      case AREA_CHART:
        return {
          ...state,
          areaChart : {
            ttlTime: action.payload.ttlTime,
            data: action.payload.data
          }
        };
      case CUSTOMER_LAST_TICKETS:
        return {
          ...state,
          customerLastTicket : {
            ttlTime: action.payload.ttlTime,
            data: action.payload.data
          }
        };
      case CUSTOMER_LAST_ORDERS:
        return {
          ...state,
          customerLastOrders : {
            ttlTime: action.payload.ttlTime,
            data: action.payload.data
          }
        };
      case CUSTOMER_ADS:
      return {
        ...state,
        customerAds : {
          ttlTime: action.payload.ttlTime,
          data: action.payload.data
        }
      };
      case CUSTOMER_INFO:
      return {
        ...state,
        customerInfo : {
          ttlTime: action.payload.ttlTime,
          data: action.payload.data
        }
      };
      case LEAVE_DASHBOARD:
        return {
          tasks: {
            ttlTime: 0,
            data: null
          },
          ordersCount: {
            ttlTime: 0,
            data: null
          },
          currentSupplier: {
            ttlTime: 0,
            data: null
          },
          areaChart: {
            ttlTime: 0,
            data: null
          },
          customerLastOrders: {
            ttlTime: 0,
            data: null
          },
          customerAds: {
            ttlTime: 0,
            data: null
          },
          customerLastTicket: {
            ttlTime: 0,
            data: null
          },
          customerInfo: {
            ttlTime: 0,
            data: null
          },
        }
      default:
        return state;
    }
};
  