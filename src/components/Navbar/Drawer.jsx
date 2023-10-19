import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchByUserFilter } from "../../redux/Actions/shopActions";
import Backdrop from "../UI/Backdrop/Backdrop";
import { UNSUBMIT_QUERY } from "../../redux/Types/searchInputTypes";
import "./Drawer.css";

const Drawer = (props) => {
  const [activeCategory, setActiveCategory] = useState("");
  const [activeOrder, setActiveOrder] = useState("");
  const [activeSubcategories, setActiveSubcategories] = useState([]);

  const dispatch = useDispatch();

  const setActiveOrderHandler = (order) => {
    setActiveOrder(order);
    setActiveSubcategories([]);
    setActiveCategory("");
  };

  const setSubcategoriesHandler = (category) => {
    setActiveCategory(category._id);
    const activeSubs =
      props.subcategories.length > 0 &&
      props.subcategories.filter((s) => s.parent === category._id);
    setActiveSubcategories(activeSubs);
  };

  const submitSearchKeyword = (sub) => {
    dispatch(
      searchByUserFilter({
        level: 1,
        order: activeOrder,
        subcategory: sub._id,
        category: sub.parent,
      })
    );

    dispatch({ type: UNSUBMIT_QUERY });
    setActiveCategory("");
    setActiveOrder("");
    setActiveSubcategories([]);
    props.backdropClick();
  };

  const unMountDrawerHandler = () => {
    setActiveCategory('')
    setActiveOrder('')
    setActiveSubcategories([])
    props.backdropClick()
  }

  return (
    <>
      <Backdrop show={props.showBackdrop} onClick={unMountDrawerHandler} />
      <div
        className={
          props.drawerOpen ? "drawer openDrawer" : "drawer closeDrawer"
        }
      >
        <div className="drawer-wrapper">
          <div className="drawer-logo">
            <Link to="/" onClick={props.backdropClick}>
              {props.companyInfo.logo && props.companyInfo.logo.length > 0 ? (
                <img
                  src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${props.companyInfo.logo}`}
                  alt={props.companyInfo.companyTitle}
                  className="company_logo_drawer"
                />
              ) : (
                <h2 className="logo">{props.companyInfo.companyTitle}</h2>
              )}
            </Link>
            <span onClick={unMountDrawerHandler}>
              <IoClose />
            </span>
          </div>

          <div className="drawer-main-wrapper">
            <ul className="drawer-items">
              <li onClick={props.backdropClick}>
                <Link to="/">
                  <FaHome className="text-blue" style={{verticalAlign: "bottom"}} />
                </Link>
              </li>
              <li onClick={props.backdropClick}>
                <Link to="/shop">ویترین</Link>
              </li>
              <li
                className={
                  activeOrder === "reviewsCount"
                    ? "submenu-drawer-link active"
                    : "submenu-drawer-link"
                }
                onClick={() => setActiveOrderHandler("reviewsCount")}
              >
                دسته بندی کالاها
                <MdKeyboardArrowLeft />
              </li>
              <li
                className={
                  activeOrder === "createdAt"
                    ? "submenu-drawer-link active"
                    : "submenu-drawer-link"
                }
                onClick={() => setActiveOrderHandler("createdAt")}
              >
                تازه ها
                <MdKeyboardArrowLeft />
              </li>
              <li
                className={
                  activeOrder === "sold"
                    ? "submenu-drawer-link active"
                    : "submenu-drawer-link"
                }
                onClick={() => setActiveOrderHandler("sold")}
              >
                پرفروشترین ها
                <MdKeyboardArrowLeft />
              </li>
              <li
                className={
                  activeCategory === "discount"
                    ? "submenu-drawer-link active"
                    : "submenu-drawer-link"
                }
                onClick={() => setActiveOrderHandler("discount")}
              >
                تخفیف های ویژه
                <MdKeyboardArrowLeft />
              </li>
              <li className="rahnama-in-drawer">
                راهنما
                <MdKeyboardArrowDown />
                <div className="rahnama-in-drawer-dropdown">
                  {props.helps.map((help, i) => (
                    <Link
                      key={i}
                      to={`/help/${help._id}`}
                      onClick={props.backdropClick}
                    >
                      {help.title}
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
            <div className="drawer-categories">
              {activeOrder.length > 0 &&
                props.categories.length > 0 &&
                props.categories.map((c, i) => {
                  return (
                    <div
                      className={
                        activeCategory === c._id
                          ? "drawer-category-name active"
                          : "drawer-category-name"
                      }
                      key={i}
                      onClick={() => setSubcategoriesHandler(c)}
                    >
                      {c.name}
                    </div>
                  );
                })}
            </div>
            <div className="drawer-subCategories_wrapper">
              <div className="drawer-subCategories">
                {activeSubcategories.length > 0 &&
                  activeSubcategories.map((s, i) => (
                    <Link
                      key={i}
                      to="/shop"
                      className="drawer-sublinks"
                      onClick={() => submitSearchKeyword(s)}
                    >
                      {s.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
