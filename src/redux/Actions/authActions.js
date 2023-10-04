import { USER_SIGNOUT } from "../Types/authTypes";
import axios from '../../util/axios';
import { toast } from "react-toastify";

//signout-action
export const signout = () => (dispatch) => {
  axios.get('/sign-out/user').then(res => {
    if(res.status === 200){
      dispatch({type: USER_SIGNOUT});
      localStorage.removeItem("gonshapUserInfo");
    }
  }).catch(err => {
    if(err.response.status !== 401){
      toast.warn('خروج ناموفق بود،اتصال به اینترنت را بررسی کنید')
    }
  })
};
export const kickOut = () => (dispatch) => {
  dispatch({ type: USER_SIGNOUT });
  localStorage.removeItem("gonshapUserInfo");
};
