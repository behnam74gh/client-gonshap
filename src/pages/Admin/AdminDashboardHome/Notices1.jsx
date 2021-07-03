import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import axios from "../../../util/axios";
import "./Notices.css";

const Notices1 = () => {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [tasksError, setTasksError] = useState("");

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
      <div className="notice_1">
        <span>موجودی فعلی :</span>
        <strong>1200000 تومان</strong>
      </div>
      <div className="notice_1">
        <span>درآمد امروز :</span>
        <strong>200000 تومان</strong>
      </div>
    </div>
  );
};

export default Notices1;
