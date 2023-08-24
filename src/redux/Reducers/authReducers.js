import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  UPDATE_USERS_TOKENS,
  UPDATE_DASHBOARD_IMAGE,
  USER_SIGNOUT,
} from "../Types/authTypes";

const initialState = {
  userInfo: localStorage.getItem("gonshapUserInfo")
    ? JSON.parse(localStorage.getItem("gonshapUserInfo"))
    : null,
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
          refreshToken: action.payload.refreshToken,
          userId: action.payload.userId,
          role: action.payload.role,
          supplierFor: action.payload.supplierFor
        },
      };
    case USER_SIGNIN_FAIL:
      return { loading: false };
    case UPDATE_USERS_TOKENS:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          refreshToken: action.payload,
        },
      };
    case UPDATE_DASHBOARD_IMAGE:
      return {
        ...state,
        userImage: action.payload,
      };
    case USER_SIGNOUT:
      return {};
    default:
      return state;
  }
};
