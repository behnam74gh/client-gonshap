
export const AbortReducer = (state = false, action) => {
  switch (action.type) {
    case "ABORT_HOME":
      return action.payload;
    default:
      return state;
  }
};
