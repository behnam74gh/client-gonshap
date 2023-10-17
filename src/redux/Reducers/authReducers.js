import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  UPDATE_DASHBOARD_IMAGE,
  UPDATE_USER_INFO,
  USER_SIGNOUT,
} from "../Types/authTypes";
import { getCookie } from '../../util/customFunctions';

const savedInfoData = getCookie('userInfoBZ');

const initialState = {
  userInfo: {
      firstName: savedInfoData?.firstName || "",
      userId: savedInfoData?.userId || "",
      role: savedInfoData?.role || null,
      isBan: savedInfoData?.isBan || null,
      supplierFor: savedInfoData?.supplierFor || null,
      csrfToken: savedInfoData?.csrfToken || null
    },
  loading: false,
  userImage: savedInfoData?.avatar || "",
};

export const userSigninReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return { ...state, loading: true };
    case USER_SIGNIN_SUCCESS:
      return {
        loading: false,
        userInfo: {
          firstName: action.payload.firstName,
          userId: action.payload.userId,
          role: action.payload.role,
          isBan: action.payload.isBan,
          supplierFor: action.payload.supplierFor,
          csrfToken: action.payload.csrfToken
        },
      };
    case USER_SIGNIN_FAIL:
      return { ...state,loading: false };
    case UPDATE_USER_INFO:
      return {
        loading: false,
        userInfo: {
          ...state.userInfo,
          firstName: action.payload.firstName,
          userId: action.payload.userId,
          role: action.payload.role,
          isBan: action.payload.isBan,
          supplierFor: action.payload.supplierFor,
        },
      }
    case UPDATE_DASHBOARD_IMAGE:
      return {
        ...state,
        userImage: action.payload,
      };
    case USER_SIGNOUT:
      return {
        userInfo : {
          firstName: "",
          userId: "",
          role: null,
          isBan: null,
          supplierFor: null,
          csrfToken: null
        },
        loading: false,
        userImage: ""
      };
    default:
      return state;
  }
};
