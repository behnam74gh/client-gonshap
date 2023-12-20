import React, { useState } from "react";
import { RiLogoutBoxLine, RiLogoutBoxRLine } from "react-icons/ri";
import { FaBars } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { MdShoppingCart } from "react-icons/md";
import { BsFillBookmarkFill, BsBookmarksFill } from "react-icons/bs";
import { MdDashboard, MdKeyboardArrowDown } from "react-icons/md";
import { Link,useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSubmenu } from "../../redux/Actions/subMenu";
import NavbarItems from "./NavbarItems";
import axios from "../../util/axios";
import SearchInput from "../UI/FormElement/SearchInput";
import { USER_SIGNOUT } from "../../redux/Types/authTypes";
import { toast } from "react-toastify";
import altenativeLogo from '../../assets/images/logo-alternative.png'
import { VscLoading } from "react-icons/vsc";
import { SUGGEST_CLOSE } from "../../redux/Types/searchInputTypes";
import "./Navbar.css";

const Navbar = (props) => {
  const [ loading,setLoading ] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory()

  const { subMenu, userSignin, cart, favorites,isOnline,search: { dropdown } } = useSelector((state) => ({
    ...state,
  }));

  const { isSubmenuOpen } = subMenu;
  const { userInfo } = userSignin;
  const { cartItems } = cart;
  const { favoriteItems } = favorites;

  const subMenuHandler = () => {
    if (isSubmenuOpen) {
      dispatch(closeSubmenu());
    }
  };
  const goToPanelHandler = () => {
    if(!navigator.onLine){
      toast.warn('شما آفلاین هستید')
      return;
    }
    
    const url =  userInfo.role === 1 ? "/admin/dashboard/home"
    : userInfo.role === 2 ? "/store-admin/dashboard/home" : "/user/dashboard/home"
    history.push(url)
  }
  const signoutHandler = () => {
    if(!navigator.onLine){
      toast.warn('شما آفلاین هستید')
      return;
    }
    setLoading(true)
    axios.get('/sign-out/user').then(res => {
      setLoading(false)
      if(res.status === 200){
        dispatch({type: USER_SIGNOUT});
        localStorage.removeItem("storeOwnerPhoneNumber");
        localStorage.removeItem('dashProductsConf');
        localStorage.removeItem('otherFilterDashPage');
        history.push('/')
      }
    }).catch(err => {
      setLoading(false)
      if(err.response.status !== 401){
        toast.warning('خروج ناموفق بود')
      }
    })
  };

  return (
    <header className="c-navbar" id="header">
      <div className="header-wrapper" onMouseOver={subMenuHandler}>
        <Link to="/" className='logo_Img' onClick={() => dropdown && dispatch({type: SUGGEST_CLOSE})}>
          <img
            src={(isOnline && props?.companyInfo?.logo?.length > 0) ?
              `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${props.companyInfo.logo}` :
              altenativeLogo
            }
            alt={props.companyInfo.companyTitle}
            className="company_logo_navbar"
          />
        </Link>
        <div className="search-input">
          <SearchInput />
        </div>
        <div className="header-feature" onClick={() => dropdown && dispatch({type: SUGGEST_CLOSE})}>
          <ul>
            {userInfo?.userId?.length > 0 ? (
              <li className="logged-user">
                {userInfo.firstName}
                <MdKeyboardArrowDown
                  style={{ color: "#ffffff", alignSelf: "center" }}
                />
                <div className="auth-dropdown">
                  <div className="wrapper-dropdown">
                    <span onClick={goToPanelHandler}>
                      <MdDashboard />
                      حساب کاربری
                    </span>
                    <span onClick={signoutHandler}>
                      <RiLogoutBoxRLine />
                      {loading ? <VscLoading className="loader" /> : "خروج از حساب"}
                    </span>
                  </div>
                </div>
              </li>
            ) : null}
            <li>
              <Link to="/cart" className="tooltip">
                <span className="tooltip_text">سبد خرید</span>
                <span className="cart-badge">
                  {" "}
                  {cartItems && cartItems.length}
                </span>
                <MdShoppingCart className="font-md text-white" />
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="tooltip">
                <span className="tooltip_text">علاقه مندی ها</span>
                {favoriteItems.length > 0 ? (
                  <BsBookmarksFill className="text-white" />
                ) : (
                  <BsFillBookmarkFill className="text-white" />
                )}
              </Link>
            </li>
          </ul>

          {(userInfo?.userId?.length < 1 && isOnline) && <Link to="/register" className="auth-btn">
            ثبت نام
            <AiOutlineUser style={{ marginRight: "5px" }} />
          </Link>}

          {(userInfo?.userId?.length < 1 && isOnline) && <Link to="/signin" className="auth-btn">
            ورود
            <RiLogoutBoxLine style={{ marginRight: "5px" }} />
          </Link>}
        </div>
      </div>

      <nav className="desktop-only" onClick={() => dropdown && dispatch({type: SUGGEST_CLOSE})}>
        <NavbarItems
          categories={props.categories}
          subcategories={props.subcategories}
          helps={props.helps}
        />
      </nav>

      <div className="toggle-btn" onClick={props.toggleDrawer}>
        <FaBars />
      </div>
    </header>
  );
};

export default Navbar;
