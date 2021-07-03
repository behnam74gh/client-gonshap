import React from "react";
import Notices1 from "./Notices1";
import AreaChartComponent from "./AreaChart";
import PieChartComponent from "./PieChart";

const AdminDashboardHome = () => {
  return (
    <div className="admin-panel-wrapper">
      <Notices1 />
      <AreaChartComponent />
      <PieChartComponent />
    </div>
  );
};

export default AdminDashboardHome;
