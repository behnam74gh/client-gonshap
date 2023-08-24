import React, { useEffect, useState } from "react";
import LoadingOrderSkeleton from "../../../components/UI/LoadingSkeleton/LoadingOrderSkeleton";
import axios from "../../../util/axios";

const UserInfo = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/get/current-user/info")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setUser(response.data.wantedUser);
          setErrorText("");
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
              نام و نام خانوادگی:
              <strong className="text-blue mx-1">{`${user.firstName}  ${user.lastName}`}</strong>
            </h6>
            <h6 className="user_dashboard_phoneNumber">
              تلفن تماس:
              <strong className="text-blue mx-1">{user.phoneNumber}</strong>
            </h6>
            <h6 className="user_dashboard_address">
              آدرس:
              <strong className="text-blue mx-1">
                {user.address && user.address.length > 0
                  ? user.address
                  : "ثبت نکرده اید"}
              </strong>
            </h6>
            <h6 className="user_dashboard_status">
              وضعیت:
              <strong className="text-blue mx-1">
                {!user.isBanned ? "فعال" : "مسدود"}
              </strong>
            </h6>
          </div>
        )
      )}
    </React.Fragment>
  );
};

export default UserInfo;
