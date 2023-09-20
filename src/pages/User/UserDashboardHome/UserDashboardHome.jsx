import React from "react";
import { useSelector } from "react-redux";
import LastTicket from "./LastTicket";
import UserInfo from "./UserInfo";
import LastOrder from "./LastOrder";
import Button from '../../../components/UI/FormElement/Button'
import "./UserDashboardHome.css";

const UserDashboardHome = () => {

  const { userInfo : { role } } = useSelector(state => state.userSignin)
  
  return (
    <div className="admin-panel-wrapper" id="user_dashboard">
      <h5 className="w-100">اطلاعات شخصی شما</h5>
      <UserInfo />
      <h5 className="w-100">آخرین خرید شما</h5>
      <LastOrder />
      <h5 className="w-100">آخرین تیکت شما</h5>
      <LastTicket />
      {role === 2 && <Button to='/store-admin/dashboard/home'>پنل فروشگاه</Button>}
    </div>
  );
};

export default UserDashboardHome;
