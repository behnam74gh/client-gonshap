import { ADS_REQUEST,ADS_SUCCESS,ADS_FAIL } from "../Types/advertise";

const initialState = {
  loading: false,
  adsLevelOne: [],
  adsLevelTwo: [],
  adsLevelThree: [],
  adsLevelFour: [],
  adsLevelFive: [],
}

export const advertiseReducer = (state = initialState, action) => {
  const {type,payload} = action;
  switch (type) {
    case ADS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADS_SUCCESS:
      return {
        loading: false,
        adsLevelOne: payload.firstLevelAds,
        adsLevelTwo: payload.secondLevelAds,
        adsLevelThree: payload.thirdLevelAds,
        adsLevelFour: payload.fourthLevelAds,
        adsLevelFive: payload.fifthLevelAds,
      };
    case ADS_FAIL:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
