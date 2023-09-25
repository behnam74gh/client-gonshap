import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  UPDATE_DASHBOARD_IMAGE,
  USER_SIGNOUT,
} from "../Types/authTypes";

const initialState = {
  userInfo: localStorage.getItem("gonshapUserInfo")
    ? JSON.parse(localStorage.getItem("gonshapUserInfo"))
    : {
      firstName: "",
      isAdmin: null,
      userId: "",
      role: null,
      isBan: null,
      supplierFor: null,
    },
  loading: false,
  userImage: "",
};

export const userSigninReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return { loading: true };
    case USER_SIGNIN_SUCCESS:
      return {
        loading: false,
        userInfo: {
          firstName: action.payload.firstName,
          isAdmin: action.payload.isAdmin,
          userId: action.payload.userId,
          role: action.payload.role,
          isBan: action.payload.isBan,
          supplierFor: action.payload.supplierFor
        },
      };
    case USER_SIGNIN_FAIL:
      return { loading: false };
    case UPDATE_DASHBOARD_IMAGE:
      return {
        ...state,
        userImage: action.payload,
      };
    case USER_SIGNOUT:
      return {
        userInfo : {
          firstName: "",
          isAdmin: null,
          userId: "",
          role: null,
          isBan: null,
          supplierFor: null,
        },
        loading: false,
        userImage: ""
      };
    default:
      return state;
  }
};
