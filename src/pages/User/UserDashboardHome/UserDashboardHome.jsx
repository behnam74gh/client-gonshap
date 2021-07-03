import React from "react";
import LastTicket from "./LastTicket";
import UserInfo from "./UserInfo";
import LastOrder from "./LastOrder";
import "./UserDashboardHome.css";

const UserDashboardHome = () => {
  return (
    <div className="admin-panel-wrapper" id="user_dashboard">
      <h5 className="w-100">اطلاعات شخصی شما</h5>
      <UserInfo />
      <h5 className="w-100">آخرین خرید شما</h5>
      <LastOrder />
      <h5 className="w-100">آخرین تیکت شما</h5>
      <LastTicket />
    </div>
  );
};

export default UserDashboardHome;
