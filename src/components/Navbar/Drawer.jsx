import React, { useState } from "react";
// import { FaHome } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from "react-icons/md";
import { Link,useLocation } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { searchByUserFilter } from "../../redux/Actions/shopActions";
import Backdrop from "../UI/Backdrop/Backdrop";
import { UNSUBMIT_QUERY } from "../../redux/Types/searchInputTypes";
import { SET_ALL_BRANDS, UPDATE_ALL_BRANDS } from "../../redux/Types/shopProductsTypes";
import { db } from "../../util/indexedDB";
import "./Drawer.css";

const Drawer = (props) => {
  const [activeCategory, setActiveCategory] = useState({
    id: "",
    name: ""
  });
  const [activeOrder, setActiveOrder] = useState({
    config: "",
    title: "",
  });
  const [activeSubcategories, setActiveSubcategories] = useState([]);

  const { pathname } = useLocation();
  const { shopProducts: { items } } = useSelector((state) => state);

  const dispatch = useDispatch();

  const setActiveOrderHandler = (order,title) => {
    setActiveOrder({
      config: order,
      title 
    });
    setActiveSubcategories([]);
    setActiveCategory({
      id: "",
      name: ""
    });
  };

  const setSubcategoriesHandler = (category) => {
    setActiveCategory({
      id: category._id,
      name: category.name
    });
    const activeSubs =
      props.subcategories.length > 0 &&
      props.subcategories.filter((s) => s.parent === category._id);
    setActiveSubcategories(activeSubs);
  };

  const submitSearchKeyword = (sub) => {
    dispatch(
      searchByUserFilter({
        level: 1,
        order: activeOrder.config,
        subcategory: sub._id,
        category: sub.parent,
      })
    );

    dispatch({ type: UNSUBMIT_QUERY });
    setActiveCategory({
      id: "",
      name: ""
    });
    setActiveOrder({
      config: "",
      title: ""
    });
    setActiveSubcategories([]);
    localStorage.setItem("gonshapPageNumber", JSON.stringify(1));
    const currentType = items.length > 0 ? UPDATE_ALL_BRANDS : SET_ALL_BRANDS;
    db.brands.toArray().then(items => {
      if(items.length > 0){
        const categoryBrands = items.filter((b) => b.backupFor._id === sub.parent);
        dispatch({
          type: currentType,
          payload: {
            brands: categoryBrands
          }
        })
      }
    })
    props.backdropClick();
  };

  const unMountDrawerHandler = () => {
    setActiveCategory({
      id: "",
      name: ""
    })
    setActiveOrder({
      config: "",
      title: ""
    })
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
            <ul className="drawer-items pt-2">
              {/* <li onClick={props.backdropClick}>
                <Link to="/">
                  <FaHome className="text-blue" style={{verticalAlign: "bottom"}} />
                </Link>
              </li> */}
              <li onClick={props.backdropClick}>
                <Link to="/shop" onClick={() => pathname !== "/shop" && items.length < 1 && dispatch(
                searchByUserFilter({
                  level: 3,
                  order: "createdAt",
                })
              )}>ویترین</Link>
              </li>
              <li onClick={props.backdropClick}>
                <Link to="/stores">فروشگاه ها</Link>
              </li>
              <li
                className={
                  activeOrder.config === "reviewsCount"
                    ? "submenu-drawer-link active"
                    : "submenu-drawer-link"
                }
                onClick={() => setActiveOrderHandler("reviewsCount","دسته بندی کالاها")}
              >
                دسته بندی کالاها
                <MdKeyboardArrowLeft />
              </li>
              <li
                className={
                  activeOrder.config === "createdAt"
                    ? "submenu-drawer-link active"
                    : "submenu-drawer-link"
                }
                onClick={() => setActiveOrderHandler("createdAt","تازه ها")}
              >
                تازه ها
                <MdKeyboardArrowLeft />
              </li>
              <li
                className={
                  activeOrder.config === "sold"
                    ? "submenu-drawer-link active"
                    : "submenu-drawer-link"
                }
                onClick={() => setActiveOrderHandler("sold","پرفروشترین ها")}
              >
                پرفروشترین ها
                <MdKeyboardArrowLeft />
              </li>
              <li
                className={
                  activeCategory.id === "discount"
                    ? "submenu-drawer-link active"
                    : "submenu-drawer-link"
                }
                onClick={() => setActiveOrderHandler("discount","تخفیف های ویژه")}
              >
                تخفیف های ویژه
                <MdKeyboardArrowLeft />
              </li>
              <li className="rahnama-in-drawer" onClick={() => setActiveOrderHandler("","")}>
                راهنما
                <MdKeyboardArrowDown />
                <div className="rahnama-in-drawer-dropdown">
                  {props.helps.map((help) => (
                    <Link
                      key={help._id}
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
              {activeOrder.config.length > 0 && <div className="drawer-category-name" style={{color: "var(--thirdColorPalete)",background: "none",fontWeight: 600}}>براساس {activeOrder.title}</div>}
              {activeOrder.config.length > 0 &&
                props.categories.length > 0 &&
                props.categories.map((c) => {
                  return (
                    <div
                      className={
                        activeCategory.id === c._id
                          ? "drawer-category-name active"
                          : "drawer-category-name"
                      }
                      key={c._id}
                      onClick={() => setSubcategoriesHandler(c)}
                    >
                      {c.name}
                    </div>
                  );
                })}
            </div>
            {activeOrder.config.length > 0 && <div className="drawer-subCategories_wrapper">
              <div className="drawer-subCategories">
                <span className="drawer-sublinks" style={{color: "var(--thirdColorPalete)",background: "none",fontWeight: 600}}>
                  {activeCategory.id?.length > 0 ? `برچسب های ${activeCategory.name} :` : "برچسب ها"}
                </span>
                {activeSubcategories.length > 0 &&
                  activeSubcategories.map((s) => (
                    <Link
                      key={s._id}
                      to="/shop"
                      className="drawer-sublinks"
                      onClick={() => submitSearchKeyword(s)}
                    >
                      {s.name}
                    </Link>
                  ))}
              </div>
            </div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;
