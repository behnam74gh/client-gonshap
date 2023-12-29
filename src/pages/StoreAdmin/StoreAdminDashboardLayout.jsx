import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FaSignOutAlt,FaProductHunt } from "react-icons/fa";
import { MdDashboard,MdLabel } from "react-icons/md";
import { RiLockPasswordFill,RiTodoLine } from "react-icons/ri";
import { TiMessages } from "react-icons/ti";
// import { GoPlus } from "react-icons/go";
import { SiBrandfolder } from "react-icons/si";
import { IoColorPaletteSharp, IoCreateOutline } from "react-icons/io5";
import { BsCardChecklist } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../util/axios";
import UserDefaultPicture from "../../assets/images/pro-8.png";
import { UPDATE_DASHBOARD_IMAGE, USER_SIGNOUT } from "../../redux/Types/authTypes";
import { db } from "../../util/indexedDB";
import { VscLoading } from "react-icons/vsc";
import { RiSettings3Fill } from "react-icons/ri";
import { LEAVE_DASHBOARD } from "../../redux/Types/ttlDataTypes";
import "../Admin/TemplateAdminDashboard.css";

const StoreAdminDashboardLayout = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState("پیشخوان");
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(false);

  const { userInfo, userImage, phoneNumber } = useSelector((state) => state.userSignin);
  const { currentSupplier : { data } } = useSelector(state => state.ttlDatas);

  const dispatch = useDispatch();

  const history = useHistory();
  
  useEffect(() => {
    db.supplierList.toArray().then(items => {
      if(items.length > 0 && phoneNumber?.length > 0){
        const stores = items.filter(s => s.backupFor._id === userInfo.supplierFor);
        if(stores?.length > 0){
          const store = stores.find(s => s.phoneNumber === phoneNumber)
          setStoreId(store._id)
        }
      }
    })
  }, [phoneNumber,userInfo.supplierFor]);

  useEffect(() => {
    const ac = new AbortController();
    axios
      .get("/users/dashboard/profile-image",{signal: ac.signal})
      .then((response) => {
        if (response.data.success) {
          dispatch({
            type: UPDATE_DASHBOARD_IMAGE,
            payload: response.data.usersImage,
          });
        }
      })

      return () => {
        ac.abort()
      }
  }, [dispatch])
  
  useEffect(() => {
    switch (history.location.pathname) {
      case "/store-admin/dashboard/home":
        setActiveRoute("پیشخوان");
        break;
      case "/store-admin/dashboard/orders":
        setActiveRoute("سفارش ها");
        break;
      case "/store-admin/dashboard/products":
        setActiveRoute("محصولات");
        break;
      case "/store-admin/dashboard/create-product":
        setActiveRoute("ایجاد محصول");
        break;
        case "/store-admin/dashboard/subcategories":
        setActiveRoute("برچسب ها");
        break;
      case "/store-admin/dashboard/brands":
        setActiveRoute("برند ها");
        break;
      case "/store-admin/dashboard/colors":
        setActiveRoute("رنگ ها");
        break;
      case "/store-admin/dashboard/todo":
        setActiveRoute("یادداشت ها");
        break;
      case "/store-admin/dashboard/tickets":
        setActiveRoute("تیکت ها");
        break;
      case "/store-admin/dashboard/carousel-update/:id":
        setActiveRoute("ویرایش پنل");
        break;
      case "/store-admin/dashboard/update/user-password":
        setActiveRoute("تغییر رمزعبور");
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

    setLoading(true);
    axios.get('/sign-out/user').then(res => {
      setLoading(false);
      if(res.status === 200){
        dispatch({type: USER_SIGNOUT});
        dispatch({type: LEAVE_DASHBOARD});
        localStorage.removeItem("storeOwnerPhoneNumber");
        localStorage.removeItem('dashProductsConf');
        localStorage.removeItem('otherFilterDashPage');
        history.push('/')
      }
    }).catch(err => {
      setLoading(false);
      if(err.response.status !== 401){
        toast.warn('خروج ناموفق بود')
      }
    })
  }

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
        <h3 style={{marginBottom: "5px"}}>
          {data?.title?.length > 0 ? data.title : userInfo?.firstName ? userInfo.firstName : "نام کاربری"}
        </h3>
        <ul id="side-nav-dashboard">
          <li
            onClick={() => setActiveRoute("پیشخوان")}
            className={activeRoute === "پیشخوان" ? "active" : ""}
          >
            <Link to="/store-admin/dashboard/home">
              <MdDashboard />
              <span className="sidebar-text-link">پیشخوان</span>
            </Link>
          </li>
          <li
              onClick={() => setActiveRoute("سفارش ها")}
              className={activeRoute === "سفارش ها" ? "active" : ""}
            >
              <Link to="/store-admin/dashboard/orders">
                <BsCardChecklist />
                <span className="sidebar-text-link">سفارش ها</span>
              </Link>
            </li>
          <li
              onClick={() => setActiveRoute("محصولات")}
              className={activeRoute === "محصولات" ? "active" : ""}
            >
              <Link to="/store-admin/dashboard/products">
                <FaProductHunt />
                <span className="sidebar-text-link">محصولات</span>
              </Link>
            </li>
          <li
              onClick={() => setActiveRoute("ایجاد محصول")}
              className={activeRoute === "ایجاد محصول" ? "active" : ""}
            >
              <Link to="/store-admin/dashboard/create-product">
                <IoCreateOutline />
                <span className="sidebar-text-link">ایجاد محصول</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("برچسب ها")}
              className={activeRoute === "برچسب ها" ? "active" : ""}
            >
              <Link to="/store-admin/dashboard/subcategories">
                <MdLabel />
                <span className="sidebar-text-link">برچسب ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("برند ها")}
              className={activeRoute === "برند ها" ? "active" : ""}
            >
              <Link to="/store-admin/dashboard/brands">
                <SiBrandfolder />
                <span className="sidebar-text-link">برند ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("رنگ ها")}
              className={activeRoute === "رنگ ها" ? "active" : ""}
            >
              <Link to="/store-admin/dashboard/colors">
                <IoColorPaletteSharp />
                <span className="sidebar-text-link">رنگ ها</span>
              </Link>
            </li>
            <li
              onClick={() => setActiveRoute("یادداشت ها")}
              className={activeRoute === "یادداشت ها" ? "active" : ""}
            >
              <Link to="/store-admin/dashboard/todo">
                <RiTodoLine />
                <span className="sidebar-text-link">یادداشت ها</span>
              </Link>
            </li>
          <li
            onClick={() => setActiveRoute("تیکت ها")}
            className={activeRoute === "تیکت ها" ? "active" : ""}
          >
            <Link to="/store-admin/dashboard/tickets">
              <TiMessages />
              <span className="sidebar-text-link">تیکت ها</span>
            </Link>
          </li>
         {storeId.length > 0 && <li
            onClick={() => setActiveRoute("ویرایش پنل")}
            className={activeRoute === "ویرایش پنل" ? "active" : ""}
          >
            <Link to={`/store-admin/dashboard/carousel-update/${storeId}`}>
              <RiSettings3Fill />
              <span className="sidebar-text-link">ویرایش پنل</span>
            </Link>
          </li>}
          <li
            onClick={() => setActiveRoute("تغییر رمزعبور")}
            className={activeRoute === "تغییر رمزعبور" ? "active" : ""}
          >
            <Link to="/store-admin/dashboard/update/user-password">
              <RiLockPasswordFill />
              <span className="sidebar-text-link">تغییر رمزعبور</span>
            </Link>
          </li>
          <li onClick={signoutHandler}>
            <b>
              {loading ? <VscLoading className="loader" /> : <FaSignOutAlt />}
              <span className="sidebar-text-link">خروج</span>
            </b>
          </li>
        </ul>
      </aside>
      <main id="main-dashboard">{children}</main>
    </div>
  );
};

export default StoreAdminDashboardLayout;
