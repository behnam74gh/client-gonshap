import React,{useState} from "react";
import Notices1 from "./Notices1";
import AreaChartComponent from "./AreaChart";
import PieChartComponent from "./PieChart";

const AdminDashboardHome = () => {
  const [date, setDate] = useState(new Date());

  const setParticularDateHandler = (date) => {
    setDate(date)
  }

  return (
    <div className="admin-panel-wrapper">
      <Notices1 date={date} setParticularDateHandler={setParticularDateHandler} />
      <AreaChartComponent date={date} />
      <PieChartComponent />
    </div>
  );
};

export default AdminDashboardHome;
