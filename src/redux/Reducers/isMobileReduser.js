export const isMobileReducer = (state = false, action) => {
    switch (action.type) {
      case "ISMOBILE":
        return action.payload;
      default:
        return state;
    }
};
  