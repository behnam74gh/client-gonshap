import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { VscLoading } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { Calendar, DateObject } from "react-multi-date-picker";
import { useSelector } from "react-redux";
import axios from "../../../util/axios";
import "./ToDo.css";

const ToDoList = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [todaysDate, setTodaysDate] = useState(new Date());

  const {userInfo : {role}} = useSelector(state => state.userSignin)

  useEffect(() => {
    setLoading(true);
    axios
      .post("/get-todays-tasks", { todaysDate: todaysDate.toISOString() })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setTasks(response.data.todaysTasks);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
          setTasks([]);
        }
      });
  }, [todaysDate]);

  const removeTaskHandler = (id) => {
    if (window.confirm("برای حذف این یادداشت مطئن هستید؟")) {
      axios
        .delete(`/task-delete/${id}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            setTodaysDate(new Date(todaysDate));
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    }
  };

  const setTodaysDateHandler = (value) => {
    if (value instanceof DateObject) value = value.toDate();
    setTodaysDate(value);
  };

  const setDoneThisTaskHandler = (status, id) => {
    let taskStatus = status ? false : true;

    axios
      .put(`/task-status/${id}`, { taskStatus })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setTodaysDate(new Date(todaysDate));
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  };

  return (
    <div className="admin-panel-wrapper">
      <Link to={`/${role === 2 ? "store-admin" : "admin"}/dashboard/create-todo`} className="create-new-slide-link">
        <span className="sidebar-text-link">ایجاد یادداشت</span>
        <GoPlus />
      </Link>
      <hr />
      <p className="font-sm mt-0">
        برای دسترسی به یادداشت های تاریخ دلخواه خود، از تقویم زیر تاریخ مورد نظر
        را انتخاب کنید
      </p>
      <div className="d-flex-center-center">
        <Calendar
          value={todaysDate}
          onChange={setTodaysDateHandler}
          locale="fa"
          calendar="persian"
          className="calendar-margin"
        />
      </div>

      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <p className="mt-0">
          برای تاریخ
          <strong className="text-blue mx-2">
            {todaysDate.toLocaleDateString("fa")}
          </strong>
          تعداد <strong className="text-blue mx-2">{tasks.length}</strong>
          یادداشت وجود دارد!
        </p>
      )}
      <div className="w-100">
        {loading ? (
          <div className="w-100 d-flex-center-center">
            <VscLoading className="loader" />
          </div>
        ) : (
          tasks.length > 0 &&
          tasks.map((t, i) => (
            <div className="task-wrapper" key={i}>
              <span className="font-sm">{t.taskContent}</span>
              <div className="tasks-options-wrapper">
                <span
                  className="d-flex-center-center"
                  onClick={() => removeTaskHandler(t._id)}
                >
                  <MdDelete className="text-red" />
                </span>
                <input
                  type="checkbox"
                  className="check-task-status"
                  value={t.done}
                  checked={t.done ? true : false}
                  onChange={() => setDoneThisTaskHandler(t.done, t._id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ToDoList;
