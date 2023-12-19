import React,{useState,useEffect} from 'react';
import axios from "../../../util/axios";
import defPic from "../../../assets/images/def.jpg";
import LoadingSkeleton from "../../../components/UI/LoadingSkeleton/LoadingSkeleton";
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMER_ADS } from '../../../redux/Types/ttlDataTypes';
import "./UserAds.css";

const UserAds = () => {
    const [loading,setLoading] = useState(false)
    const [ads,setAds] = useState([])
    const [errorText,setErrorText] = useState('')

    const { customerAds } = useSelector(state => state.ttlDatas);
    const dispatch = useDispatch();

    useEffect(() => {
        if(Date.now() > customerAds.ttlTime){
            setLoading(true)
            axios.get('/user-ads')
            .then(res => {
                setLoading(false)
                if(res.data?.success){
                    setAds(res.data.userAds)
                    setErrorText("")
                    dispatch({
                        type: CUSTOMER_ADS,
                        payload: {
                            ttlTime : Date.now()+(1000*60*15),
                            data: res.data.userAds
                        }
                    })
                }
            })
            .catch(err => {
                setLoading(false)
                if(err.response){
                    setErrorText(err.response.data.message)
                }
            })
        }else{
            if(customerAds.data !== null){
                setAds(customerAds.data);
            }
        }
    }, []);

  return ads.length > 0 && (
    <div className='user_ads_container'>
        <h5 className='w-100'>فهرست تبلیغات شما</h5>
        {loading ? <LoadingSkeleton /> : errorText.length > 0 ? (
            <p className='warning-message'>{errorText}</p>
        ) : (
            <div className='user_ads_wrapper'>
                {ads.length > 0 && (
                    <table className='user_ad_table'>
                        <thead>
                            <tr>
                                <th>عکس</th>
                                <th>عنوان</th>
                                <th>از تاریخ</th>
                                <th>تا تاریخ</th>
                                <th>تعداد روز</th>
                                <th>نرخ روزانه</th>
                                <th>هزینه کل</th>
                                <th>وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ads.map(ad => (
                                <tr key={ad._id}>
                                    <td>
                                        <div className="d-flex-center-center">
                                            <img
                                                className="table_img"
                                                src={
                                                ad.photos?.length > 0 ?
                                                 `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ad.photos[0]}`
                                                : `${defPic}`
                                                }
                                                alt={ad.title}
                                            />
                                        </div>
                                    </td>
                                    <td>{ad.title}</td>
                                    <td>{new Date(ad.dateFrom).toLocaleDateString("fa")}</td>
                                    <td>{new Date(ad.dateTo).toLocaleDateString("fa")}</td>
                                    <td>{ad.days}</td>
                                    <td>
                                        <strong className='mx-1'>{ad.baseCost.toLocaleString("fa")}</strong>تومان
                                    </td>
                                    <td>
                                    <strong className='mx-1'>{ad.advertisesCost.toLocaleString("fa")}</strong>تومان
                                    </td>
                                    <td>
                                        {ad.status === "reserve" ? "رزرو است" :
                                            ad.status === "active" ? "فعال است" :
                                            ad.status === "done" ? "اتمام تبلیغ" : "لغو شده است"
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}
    </div>
  )
}

export default UserAds