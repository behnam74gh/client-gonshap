import { CLOSE_SUBMENU, OPEN_SUBMENU } from "../Types/subMenu";

export const openSubMenu = (navItemInfo, coordinate) => (dispatch) => {
  dispatch({
    type: OPEN_SUBMENU,
    location: coordinate,
    navItemInfo: navItemInfo,
  });
};

export const closeSubmenu = () => (dispatch) => {
  dispatch({
    type: CLOSE_SUBMENU,
  });
};
