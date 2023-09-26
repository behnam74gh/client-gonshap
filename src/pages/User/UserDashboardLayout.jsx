import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";
import { GoPlus } from "react-icons/go";
import { BsCardChecklist } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "../../util/axios";
import { signout } from "../../redux/Actions/authActions";
import UserDefaultPicture from "../../assets/images/pro-8.png";
import { UPDATE_DASHBOARD_IMAGE } from "../../redux/Types/authTypes";
import "../Admin/TemplateAdminDashboard.css";

const UserDashboardLayout = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState("پیشخوان");

  const { userInfo, userImage } = useSelector((state) => state.userSignin);
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    axios
      .get("/users/dashboard/profile-image")
      .then((response) => {
        if (response.data.success) {
          dispatch({
            type: UPDATE_DASHBOARD_IMAGE,
            payload: response.data.usersImage,
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          // toast.warning(err.response.data.message);
        }
      });
  }, [dispatch]);

  useEffect(() => {
    switch (history.location.pathname) {
      case "/user/dashboard/home":
        setActiveRoute("پیشخوان");
        break;
      case "/user/dashboard/orders":
        setActiveRoute("سفارش های من");
        break;
      case "/user/dashboard/tickets":
        setActiveRoute("تیکت ها");
        break;
      case "/user/dashboard/update/profile-info":
        setActiveRoute("ویرایش پروفایل");
        break;
      case "/user/dashboard/update/user-password":
        setActiveRoute("تغییر رمزعبور");
        break;
      default:
        break;
    }
  }, [history]);

  return (
    <div id="admin-dashboard">
      <aside id="sidebar-dashboard">
        <div className="d-flex-center-center my-1">
          <img
            src={
              userInfo && userImage && userImage.length > 0
                ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${userImage}`
                : UserDefaultPicture
            }
            alt="userPicture"
            className="dashboard_photo"
          />
        </div>
        <h3>
          {userInfo && userInfo.firstName ? userInfo.firstName : "نام کاربری"}
        </h3>
        <ul id="side-nav-dashboard">
          <li
            onClick={() => setActiveRoute("پیشخوان")}
            className={activeRoute === "پیشخوان" ? "active" : ""}
          >
            <Link to="/user/dashboard/home">
              <MdDashboard />
              <span className="sidebar-text-link">پیشخوان</span>
            </Link>
          </li>
          <li
            onClick={() => setActiveRoute("سفارش های من")}
            className={activeRoute === "سفارش های من" ? "active" : ""}
          >
            <Link to="/user/dashboard/orders">
              <BsCardChecklist />
              <span className="sidebar-text-link">سفارش های من</span>
            </Link>
          </li>
          <li
            onClick={() => setActiveRoute("تیکت ها")}
            className={activeRoute === "تیکت ها" ? "active" : ""}
          >
            <Link to="/user/dashboard/tickets">
              <TiMessages />
              <span className="sidebar-text-link">تیکت ها</span>
            </Link>
          </li>
          <li
            onClick={() => setActiveRoute("ویرایش پروفایل")}
            className={activeRoute === "ویرایش پروفایل" ? "active" : ""}
          >
            <Link to="/user/dashboard/update/profile-info">
              <GoPlus />
              <span className="sidebar-text-link">ویرایش پروفایل</span>
            </Link>
          </li>
          <li
            onClick={() => setActiveRoute("تغییر رمزعبور")}
            className={activeRoute === "تغییر رمزعبور" ? "active" : ""}
          >
            <Link to="/user/dashboard/update/user-password">
              <RiLockPasswordFill />
              <span className="sidebar-text-link">تغییر رمزعبور</span>
            </Link>
          </li>
          <li onClick={() => dispatch(signout())}>
            <Link to="/">
              <FaSignOutAlt />
              <span className="sidebar-text-link">خروج</span>
            </Link>
          </li>
        </ul>
      </aside>
      <main id="main-dashboard">{children}</main>
    </div>
  );
};

export default UserDashboardLayout;
