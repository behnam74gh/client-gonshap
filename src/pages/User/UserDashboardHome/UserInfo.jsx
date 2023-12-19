import React, { useEffect, useState } from "react";
import LoadingOrderSkeleton from "../../../components/UI/LoadingSkeleton/LoadingOrderSkeleton";
import axios from "../../../util/axios";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_DASHBOARD_IMAGE } from "../../../redux/Types/authTypes";
import { CUSTOMER_INFO } from "../../../redux/Types/ttlDataTypes";

const UserInfo = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const { customerInfo } = useSelector(state => state.ttlDatas);
  const dispatch = useDispatch();

  useEffect(() => {
    if(Date.now() > customerInfo.ttlTime){
      setLoading(true);
      axios
        .get("/get/current-user/info")
        .then((response) => {
          setLoading(false);
          if (response.data.success) {
            setUser(response.data.wantedUser);
            setErrorText("");
            if(response.data.wantedUser?.image){
              dispatch({ type: UPDATE_DASHBOARD_IMAGE, payload: response.data.wantedUser.image });
            }
            dispatch({
              type: CUSTOMER_INFO,
              payload: {
                ttlTime : Date.now()+(1000*60*60*24),
                data: response.data.wantedUser
              }
            })
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            setErrorText(err.response.data.message);
          }
        });
    }else{
      if(customerInfo.data !== null){
        setUser(customerInfo.data);
        if(customerInfo.data?.image){
          dispatch({ type: UPDATE_DASHBOARD_IMAGE, payload: customerInfo.data.image });
        }
      }
    }
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <div className="w-100" style={{background: "#FFF"}}>
          <LoadingOrderSkeleton count={1} />
        </div>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        user &&
        user.firstName.length > 0 && (
          <div className="user-info-wrapper">
            <h6 className="user_dashboard_name">
              نام کاربری:
              <strong className="text-blue mx-1">{`${user.firstName}  ${user.lastName}`}</strong>
            </h6>
            <h6 className="user_dashboard_phoneNumber">
              شماره ثبت شده:
              <strong className="text-blue mx-1">{user.phoneNumber}</strong>
            </h6>
            <h6 className="user_dashboard_address">
              آدرس ارسال کالا:
              <strong className="text-blue mx-1">
                {user.address && user.address.length > 0
                  ? user.address
                  : "ثبت نکرده اید"}
              </strong>
            </h6>
            {user.isBanned && <h6 className="user_dashboard_status">
              وضعیت:
              <strong className="text-blue mx-1">
                مسدود
              </strong>
            </h6>}
          </div>
        )
      )}
    </React.Fragment>
  );
};

export default UserInfo;
