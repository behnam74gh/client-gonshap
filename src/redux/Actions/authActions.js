import { USER_SIGNOUT } from "../Types/authTypes";

//signout-action
export const signout = () => (dispatch) => {
  dispatch({ type: USER_SIGNOUT });
  localStorage.removeItem("gonshapUserInfo");
  //cart-items
  //favorites
};
