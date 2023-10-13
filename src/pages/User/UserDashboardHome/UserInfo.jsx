import React, { useEffect, useState } from "react";
import LoadingOrderSkeleton from "../../../components/UI/LoadingSkeleton/LoadingOrderSkeleton";
import axios from "../../../util/axios";
import { useDispatch } from "react-redux";
import { UPDATE_DASHBOARD_IMAGE } from "../../../redux/Types/authTypes";

const UserInfo = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/get/current-user/info")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setUser(response.data.wantedUser);
          setErrorText("");
          dispatch({ type: UPDATE_DASHBOARD_IMAGE, payload: response.data.wantedUser?.image });
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <LoadingOrderSkeleton count={1} />
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
