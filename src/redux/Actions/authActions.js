import { USER_SIGNOUT } from "../Types/authTypes";

export const kickOut = () => (dispatch) => {
  dispatch({ type: USER_SIGNOUT });
  localStorage.removeItem("BZ_User_Info");
};
