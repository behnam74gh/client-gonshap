import React from "react";
import { RiLogoutBoxLine, RiLogoutBoxRLine } from "react-icons/ri";
import { FaBars } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { MdShoppingCart } from "react-icons/md";
import { BsFillBookmarkFill, BsBookmarksFill } from "react-icons/bs";
import { MdDashboard, MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSubmenu } from "../../redux/Actions/subMenu";
import NavbarItems from "./NavbarItems";
import { signout } from "../../redux/Actions/authActions";
import SearchInput from "../UI/FormElement/SearchInput";
import "./Navbar.css";

const Navbar = (props) => {
  const dispatch = useDispatch();

  const { subMenu, userSignin, cart, favorites } = useSelector((state) => ({
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
  const signoutHandler = () => {
    dispatch(signout());
  };

  return (
    <header className="c-navbar" id="header">
      <div className="header-wrapper" onMouseOver={subMenuHandler}>
        <Link to="/" className='logo_Img'>
          {props.companyInfo.logo && props.companyInfo.logo.length > 0 ? (
            <img
              src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${props.companyInfo.logo}`}
              alt={props.companyInfo.companyTitle}
              className="company_logo_navbar"
            />
          ) : (
            <h2 className="logo">{props.companyInfo.companyTitle}</h2>
          )}
        </Link>
        <div className="search-input">
          <SearchInput />
        </div>
        <div className="header-feature">
          <ul>
            {userInfo && userInfo.refreshToken ? (
              <li className="logged-user">
                {userInfo.firstName}
                <MdKeyboardArrowDown
                  style={{ color: "#ffffff", alignSelf: "center" }}
                />
                <div className="auth-dropdown">
                  <div className="wrapper-dropdown">
                    <Link
                      to={
                        userInfo.role === 1
                          ? "/admin/dashboard"
                          : userInfo.role === 2 ? "/store-admin/dashboard" : "/user/dashboard"
                      }
                    >
                      <MdDashboard />
                      حساب کاربری
                    </Link>
                    <Link to="/" onClick={signoutHandler}>
                      <RiLogoutBoxRLine />
                      خروج از حساب
                    </Link>
                  </div>
                </div>
              </li>
            ) : null}
            <li>
              <Link to="/cart" className="tooltip">
                <span className="tooltip_text">سبدِ خرید</span>
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

          {!userInfo && <Link to="/register" className="auth-btn">
            ثبت نام
            <AiOutlineUser style={{ marginRight: "5px" }} />
          </Link>}

          {!userInfo && <Link to="/signin" className="auth-btn">
            ورود
            <RiLogoutBoxLine style={{ marginRight: "5px" }} />
          </Link>}
        </div>
      </div>

      <nav className="desktop-only">
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
