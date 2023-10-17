import React from "react";
import { useSelector } from "react-redux";
import LastTicket from "./LastTicket";
import UserInfo from "./UserInfo";
import OrderStatus from "./OrderStatus";
import Button from '../../../components/UI/FormElement/Button'
import UserAds from "./UserAds";
import "./UserDashboardHome.css";

const UserDashboardHome = () => {

  const { userInfo : { role } } = useSelector(state => state.userSignin)
  
  return (
    <div className="admin-panel-wrapper" id="user_dashboard">
      <div className="d-flex-between">
        <h5>اطلاعات شخصی شما</h5>
        {role === 2 && <Button to='/store-admin/dashboard/home'>پنل فروشگاه</Button>}
      </div>
      <UserInfo />
      <OrderStatus />
      <UserAds />
      <h5 className="w-100">آخرین تیکت شما</h5>
      <LastTicket />
    </div>
  );
};

export default UserDashboardHome;
