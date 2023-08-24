import React,{useState} from 'react'
import AreaChartComponent from '../../Admin/AdminDashboardHome/AreaChart'
import Notices1 from '../../Admin/AdminDashboardHome/Notices1';

const StoreDashboardHome = () => {
  const [date, setDate] = useState(new Date());

  const setParticularDateHandler = (date) => {
    setDate(date)
  }
  return (
    <div className="admin-panel-wrapper">
      <Notices1 date={date} setParticularDateHandler={setParticularDateHandler} />
      <AreaChartComponent date={date} />
    </div>
  )
}

export default StoreDashboardHome