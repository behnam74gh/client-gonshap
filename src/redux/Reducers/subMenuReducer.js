import { OPEN_SUBMENU, CLOSE_SUBMENU } from "../Types/subMenu";

const initialState = {
  isSubmenuOpen: false,
  location: {},
  navItem: {},
};

export const subMenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SUBMENU:
      return {
        ...state,
        isSubmenuOpen: true,
        location: action.location,
        navItem: {
          order: action.navItemInfo.order,
          image: action.navItemInfo.image,
          categories: action.navItemInfo.categories,
          subcategories: action.navItemInfo.subcategories,
        },
      };
    case CLOSE_SUBMENU:
      return {
        ...state,
        isSubmenuOpen: false,
      };
    default:
      return state;
  }
};
