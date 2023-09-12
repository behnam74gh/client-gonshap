export const isOnlineReducer = (state = false, action) => {
    switch (action.type) {
      case "ISONLINE":
        return action.payload;
      default:
        return state;
    }
};
  