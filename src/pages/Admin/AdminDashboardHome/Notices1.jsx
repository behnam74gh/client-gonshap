import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import axios from "../../../util/axios";
import "./Notices.css";
import DatePicker,{DateObject} from "react-multi-date-picker";
import { useSelector } from 'react-redux';

const Notices1 = ({date,setParticularDateHandler}) => {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [tasksError, setTasksError] = useState("");
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [errorText, setErrorText] = useState("");

  const {userInfo : {role,supplierFor}} = useSelector(state => state.userSignin)

  useEffect(() => {
    axios
      .get("/get/todays-tasks")
      .then((response) => {
        if (response.data.success) {
          setTodaysTasks(response.data.tasks);
          setTasksError("");
        }
      })
      .catch((err) => {
        if (err.response) setTasksError(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    axios
    .post("/new-orders/count",{category: role === 2 ? supplierFor : null})
    .then((response) => {
      if (response.data.success) {
        setNewOrdersCount(response.data.count);
        setErrorText("");
      }
    })
    .catch((err) => {
      if (err.response) setErrorText(err.response.data.message);
    });
  }, [role,supplierFor])

  
  const setDateHandler = (value) => {
    if (value instanceof DateObject) value = value.toDate();
    setParticularDateHandler(value);
  };

  return (
    <div className="notice1_wrapper">
      <div className="notice_1">
        <span>وظایف امروز :</span>
        <strong>
          {tasksError.length > 0 ? (
            tasksError
          ) : todaysTasks.length > 0 ? (
            <Typewriter
              options={{
                strings: todaysTasks,
                autoStart: true,
                loop: true,
                pauseFor: 5000,
                delay: 100,
              }}
            />
          ) : (
            "یادداشتی ثبت نشده است"
          )}
        </strong>
      </div>

      {errorText.length > 0 ? <p className="warning-message">{errorText}</p> 
        : <div className="notice_1">
            <span>سفارش های جدید :</span>
            <strong>{newOrdersCount}</strong>
          </div>
      }

      <DatePicker
        value={date}
        onChange={setDateHandler}
        placeholder="آمار میزان فروش بر اساس تاریخ"
        calendar="persian"
        locale="fa"
        calendarPosition="bottom-right"
        style={{ height: "40px" }}         
      />
    </div>
  );
};

export default Notices1;
