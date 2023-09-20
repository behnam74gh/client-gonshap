import {ADS_REQUEST,ADS_SUCCESS,ADS_FAIL} from '../Types/advertise';
import axios from '../../util/axios';
import { db } from '../../util/indexedDB';

export const fetchActiveAdsHandler = () => (dispatch) => {
    dispatch({ type: ADS_REQUEST })

    try {
        axios.get("/all-active/ads")
        .then((response) => {
            if (response.data.success) {
                const { activeAds } = response.data;
                const firstLevelAds = activeAds.filter((ad) => ad.level === 1);
                const secondLevelAds = activeAds.filter((ad) => ad.level === 2);
                const thirdLevelAds = activeAds.filter((ad) => ad.level === 3);
                const fourthLevelAds = activeAds.filter((ad) => ad.level === 4);
                const fifthLevelAds = activeAds.filter((ad) => ad.level === 5);
                
                dispatch({
                    type: ADS_SUCCESS,
                    payload: {
                        firstLevelAds,
                        secondLevelAds,
                        thirdLevelAds,
                        fourthLevelAds,
                        fifthLevelAds
                    }
                })

                db.ads.clear()
                db.ads.bulkPut(activeAds)
            }
        })
        .catch(err => {
            dispatch({type: ADS_FAIL})
        })
    } catch (error) {
        dispatch({type: ADS_FAIL})
    }
}