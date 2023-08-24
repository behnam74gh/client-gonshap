import axios from "axios";
import { store } from "../redux/store";
import { UPDATE_USERS_TOKENS } from "../redux/Types/authTypes";
import { signout } from "../redux/Actions/authActions";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_GONSHAP_BASE_URL}`,
});

instance.interceptors.request.use((config) => {
  const { userInfo } = store.getState().userSignin;

  const RToken =
    userInfo && userInfo.refreshToken ? userInfo.refreshToken : null;

  config.headers["authorization"] = `bearer ${RToken}`;
  
  return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response.data.tokenConfig && response.data.tokenConfig.userId) {
      const { refreshToken } = response.data.tokenConfig;

      store.dispatch({
        type: UPDATE_USERS_TOKENS,
        payload: refreshToken,
      });

      const {
        firstName,
        userId,
        isAdmin,
        role,
        supplierFor,
        refreshToken: oldRefreshToken,
      } = localStorage.getItem("gonshapUserInfo")
        ? JSON.parse(localStorage.getItem("gonshapUserInfo"))
        : null;

      if (firstName.length > 0 && oldRefreshToken.length > 0) {
        localStorage.setItem(
          "gonshapUserInfo",
          JSON.stringify({ firstName,userId,role,supplierFor, isAdmin, refreshToken })
        );
      }
      return response;
    } else {
      return response;
    }
  },
  (error) => {
    // console.log(error.response);
    if (
      !error.response.data.tokenConfig ||
      !error.response.data.tokenConfig.userId
    ) {
      if (error.response.status === 401) {
        store.dispatch(signout());
        throw error;
      }
      throw error;
    } else {
      const { refreshToken } = error.response.data.tokenConfig;

      store.dispatch({
        type: UPDATE_USERS_TOKENS,
        payload: refreshToken,
      });

      const {
        firstName,
        userId,
        isAdmin,
        role,
        supplierFor,
        refreshToken: oldRefreshToken,
      } = localStorage.getItem("gonshapUserInfo")
        ? JSON.parse(localStorage.getItem("gonshapUserInfo"))
        : null;

      if (
        firstName.length > 0 &&
        oldRefreshToken.length > 0 &&
        userId.length > 0
      ) {
        localStorage.setItem(
          "gonshapUserInfo",
          JSON.stringify({ firstName, isAdmin,role,supplierFor, refreshToken, userId })
        );
      }
      throw error;
    }
  }
);

export default instance;
