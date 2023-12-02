import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  FaUsers,
  FaProductHunt,
  FaLayerGroup,
  FaRegComments,
  FaCommentMedical,
  FaSignOutAlt
} from "react-icons/fa";
import { MdDashboard, MdLabel } from "react-icons/md";
import { IoCreateOutline, IoHelp } from "react-icons/io5";
import { RiTodoLine, RiLockPasswordFill } from "react-icons/ri";
import { BiCarousel } from "react-icons/bi";
import { TiMessages } from "react-icons/ti";
import { SiBrandfolder } from "react-icons/si";
import { IoColorPaletteSharp } from "react-icons/io5";
import { GoMail, GoPlus } from "react-icons/go";
import { BsCardChecklist, BsFillQuestionCircleFill,BsInfoCircleFill } from "react-icons/bs";
import { HiSpeakerphone, HiLocationMarker } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "../../util/axios";
import UserDefaultPicture from "../../assets/images/pro-8.png";
import { UPDATE_DASHBOARD_IMAGE, USER_SIGNOUT } from "../../redux/Types/authTypes";
import "./TemplateAdminDashboard.css";

const AdminDashboardLayout = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState("پیشخوان");

  const { userInfo, userImage } = useSelector((state) => state.userSignin);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    axios.get("/users/dashboard/profile-image")
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
        toast.warning(err.response.data.message);
      }
    });
    
  }, [dispatch,]);

  useEffect(() => {
    switch (history.location.pathname) {
      case "/admin/dashboard/home":
        setActiveRoute("پیشخوان");
        break;
      case "/admin/dashboard/users":
        setActiveRoute("کاربران");
        break;
      case "/admin/dashboard/products":
        setActiveRoute("محصولات");
        break;
      case "/admin/dashboard/create-product":
        setActiveRoute("ایجاد محصول");
        break;
      case "/admin/dashboard/categories":
        setActiveRoute("دسته بندی ها");
        break;
      case "/admin/dashboard/subcategories":
        setActiveRoute("برچسب ها");
        break;
      case "/admin/dashboard/brands":
        setActiveRoute("برند ها");
        break;
      case "/admin/dashboard/colors":
        setActiveRoute("رنگ ها");
        break;
      case "/admin/dashboard/carousel":
        setActiveRoute("اسلایدشو");
        break;
      case "/admin/dashboard/create-carousel":
        setActiveRoute("فروشگاه");
        break;
      case "/admin/dashboard/todo":
        setActiveRoute("یادداشت ها");
        break;
      case "/admin/dashboard/ads":
        setActiveRoute("تبلیغات");
        break;
      case "/admin/dashboard/create-advertise":
        setActiveRoute("تبلیغات");
        break;
      case "/admin/dashboard/suggests":
        setActiveRoute("پیشنهادها");
        break;
      case "/admin/dashboard/orders":
        setActiveRoute("سفارش ها");
        break;
      case "/admin/dashboard/tickets":
        setActiveRoute("تیکت ها");
        break;
      case "/admin/dashboard/comments":
        setActiveRoute("نظرات");
        break;
      case "/admin/dashboard/send-sms":
        setActiveRoute("ارسال پیامک");
        break;
      case "/admin/dashboard/one":
        setActiveRoute("ارسال پیامک");
        break;
      case "/admin/dashboard/many":
        setActiveRoute("ارسال پیامک");
        break;
      case "/admin/dashboard/to-all":
        setActiveRoute("ارسال پیامک");
        break;
      case "/admin/dashboard/faq":
        setActiveRoute("سوالات متداول");
        break;
      case "/admin/dashboard/update/profile-info":
        setActiveRoute("ویرایش پروفایل");
        break;
      case "/admin/dashboard/update/user-password":
        setActiveRoute("تغییر رمزعبور");
        break;
      case "/admin/dashboard/info":
        setActiveRoute("مشخصات");
        break;
      case "/admin/dashboard/region":
        setActiveRoute("منطقه");
        break;
      case "/admin/dashboard/help":
        setActiveRoute("راهنما");
        break;
      default:
        break;
    }
  }, [history.location.pathname]);

  const signoutHandler = () => {
    if(!navigator.onLine){
      toast.warn('شما آفلاین هستید')
      return;
    }

    axios.get('/sign-out/user').then(res => {
      if(res.status === 200){
        dispatch({type: USER_SIGNOUT});
        localStorage.removeItem("storeOwnerPhoneNumber");
        history.push('/')
      }
    }).catch(err => {
      if(err.response.status !== 401){
        toast.warn('خروج ناموفق بود')
      }
    })
  }

  return (
    <div id="admin-dashboard">
      <aside id="sidebar-dashboard">
        <div className="sidebar-Wrapper">
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
              <Link to="/admin/dashboard/home">
                <MdDashboard />
                <span className="sidebar-text-link">پیشخوان</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("کاربران")}
              className={activeRoute === "کاربران" ? "active" : ""}
            >
              <Link to="/admin/dashboard/users">
                <FaUsers />
                <span className="sidebar-text-link">کاربران</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("محصولات")}
              className={activeRoute === "محصولات" ? "active" : ""}
            >
              <Link to="/admin/dashboard/products">
                <FaProductHunt />
                <span className="sidebar-text-link">محصولات</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("اسلایدشو")}
              className={activeRoute === "اسلایدشو" ? "active" : ""}
            >
              <Link to="/admin/dashboard/carousel">
                <BiCarousel />
                <span className="sidebar-text-link">فروشگاه</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("تبلیغات")}
              className={activeRoute === "تبلیغات" ? "active" : ""}
            >
              <Link to="/admin/dashboard/ads">
                <HiSpeakerphone />
                <span className="sidebar-text-link">تبلیغات</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("سفارش ها")}
              className={activeRoute === "سفارش ها" ? "active" : ""}
            >
              <Link to="/admin/dashboard/orders">
                <BsCardChecklist />
                <span className="sidebar-text-link">سفارش ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("دسته بندی ها")}
              className={activeRoute === "دسته بندی ها" ? "active" : ""}
            >
              <Link to="/admin/dashboard/categories">
                <FaLayerGroup />
                <span className="sidebar-text-link">دسته بندی ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("تیکت ها")}
              className={activeRoute === "تیکت ها" ? "active" : ""}
            >
              <Link to="/admin/dashboard/tickets">
                <TiMessages />
                <span className="sidebar-text-link">تیکت ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("نظرات")}
              className={activeRoute === "نظرات" ? "active" : ""}
            >
              <Link to="/admin/dashboard/comments">
                <FaRegComments />
                <span className="sidebar-text-link">نظرات</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("ارسال پیامک")}
              className={activeRoute === "ارسال پیامک" ? "active" : ""}
            >
              <Link to="/admin/dashboard/send-sms">
                <GoMail />
                <span className="sidebar-text-link">ارسال پیامک</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("پیشنهادها")}
              className={activeRoute === "پیشنهادها" ? "active" : ""}
            >
              <Link to="/admin/dashboard/suggests">
                <FaCommentMedical />
                <span className="sidebar-text-link">پیشنهادها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("ایجاد محصول")}
              className={activeRoute === "ایجاد محصول" ? "active" : ""}
            >
              <Link to="/admin/dashboard/create-product">
                <IoCreateOutline />
                <span className="sidebar-text-link">ایجاد محصول</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("یادداشت ها")}
              className={activeRoute === "یادداشت ها" ? "active" : ""}
            >
              <Link to="/admin/dashboard/todo">
                <RiTodoLine />
                <span className="sidebar-text-link">یادداشت ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("برچسب ها")}
              className={activeRoute === "برچسب ها" ? "active" : ""}
            >
              <Link to="/admin/dashboard/subcategories">
                <MdLabel />
                <span className="sidebar-text-link">برچسب ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("برند ها")}
              className={activeRoute === "برند ها" ? "active" : ""}
            >
              <Link to="/admin/dashboard/brands">
                <SiBrandfolder />
                <span className="sidebar-text-link">برند ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("رنگ ها")}
              className={activeRoute === "رنگ ها" ? "active" : ""}
            >
              <Link to="/admin/dashboard/colors">
                <IoColorPaletteSharp />
                <span className="sidebar-text-link">رنگ ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("سوالات متداول")}
              className={activeRoute === "سوالات متداول" ? "active" : ""}
            >
              <Link to="/admin/dashboard/faq">
                <BsFillQuestionCircleFill />
                <span className="sidebar-text-link">سوالات متداول</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("منطقه")}
              className={activeRoute === "منطقه" ? "active" : ""}
            >
              <Link to="/admin/dashboard/region">
                <HiLocationMarker />
                <span className="sidebar-text-link">منطقه</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("مشخصات")}
              className={activeRoute === "مشخصات" ? "active" : ""}
            >
              <Link to="/admin/dashboard/info">
                <BsInfoCircleFill />
                <span className="sidebar-text-link">مشخصات</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("راهنما")}
              className={activeRoute === "راهنما" ? "active" : ""}
            >
              <Link to="/admin/dashboard/help">
                <IoHelp />
                <span className="sidebar-text-link">راهنما</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("ویرایش پروفایل")}
              className={activeRoute === "ویرایش پروفایل" ? "active" : ""}
            >
              <Link to="/admin/dashboard/update/profile-info">
                <GoPlus />
                <span className="sidebar-text-link">ویرایش پروفایل</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("تغییر رمزعبور")}
              className={activeRoute === "تغییر رمزعبور" ? "active" : ""}
            >
              <Link to="/admin/dashboard/update/user-password">
                <RiLockPasswordFill />
                <span className="sidebar-text-link">تغییر رمزعبور</span>
              </Link>
            </li>
            <li onClick={signoutHandler}>
              <b>
                <FaSignOutAlt />
                <span className="sidebar-text-link">خروج</span>
              </b>
            </li>
          </ul>
        </div>
      </aside>
      <main id="main-dashboard">{children}</main>
    </div>
  );
};

export default AdminDashboardLayout;
