import React,{useState} from 'react'
import AreaChartComponent from '../../Admin/AdminDashboardHome/AreaChart'
import Notices1 from '../../Admin/AdminDashboardHome/Notices1';
import Button from '../../../components/UI/FormElement/Button'

const StoreDashboardHome = () => {
  const [date, setDate] = useState(new Date());

  const setParticularDateHandler = (date) => {
    setDate(date)
  }
  return (
    <div className="admin-panel-wrapper">
      <Notices1 date={date} setParticularDateHandler={setParticularDateHandler} />
      <AreaChartComponent date={date} />
      <Button to='/user/dashboard/home'>پنل شخصی</Button>
    </div>
  )
}

export default StoreDashboardHome