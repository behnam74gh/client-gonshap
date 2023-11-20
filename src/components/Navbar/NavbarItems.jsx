import React from "react";
import { Link,useLocation } from "react-router-dom";
import { FaTh } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { openSubMenu, closeSubmenu } from "../../redux/Actions/subMenu";
import { useDispatch, useSelector } from "react-redux";
import { searchByUserFilter } from "../../redux/Actions/shopActions";
import { SUGGEST_CLOSE } from "../../redux/Types/searchInputTypes";
import "./NavbarItems.css";

const NavbarItems = ({ categories, subcategories, helps }) => {
  const dispatch = useDispatch();

  const { subMenu : {isSubmenuOpen},search: { dropdown } } = useSelector((state) => state);
  const { pathname } = useLocation();

  const displaySubMenu = (e, order,count) => {
    const locNavItem = e.target.getBoundingClientRect();
    const centerNavItem = (locNavItem.left + locNavItem.right) / 2;
    const bottomNavItem = locNavItem.bottom;
    const navItemInfo = {
      categories,
      subcategories,
      order,
      count
    };
    dispatch(openSubMenu(navItemInfo, { centerNavItem, bottomNavItem }));
  };

  const subMenuHandler = (e) => {
    if (!e.target.classList.contains("submenu-link") && isSubmenuOpen) {
      dispatch(closeSubmenu());
    }
  };

  return (
    <ul className="nav-items" onMouseOver={subMenuHandler}>
      <li>
        <Link to="/">خانه</Link>
      </li>
      <li>
        <Link to="/shop" onClick={() => pathname !== "/shop" && dispatch(
        searchByUserFilter({
          level: 3,
          order: "createdAt",
        })
      )}>ویترین</Link>
      </li>
      <li>
        <Link to="/stores" className="text-purple">فروشگاه ها</Link>
      </li>
      <li className="submenu-link">
        <FaTh className="submenu-link" style={{ marginLeft: "10px" }} />
        <span
          className="submenu-link"
          onMouseOver={(e) => {
            displaySubMenu(e, "reviewsCount", 1)
            if(dropdown){
              dispatch({type: SUGGEST_CLOSE})
            }
          }}
        >
          دسته بندی کالا
        </span>
      </li>

      <li
        className="submenu-link"
        onMouseOver={(e) => {
          displaySubMenu(e, "createdAt", 2)
          if(dropdown){
            dispatch({type: SUGGEST_CLOSE})
          }
        }}
      >
        جدیدترین ها
      </li>
      <li
        className="submenu-link"
        onMouseOver={(e) => {
          displaySubMenu(e, "sold", 3)
          if(dropdown){
            dispatch({type: SUGGEST_CLOSE})
          }
        }}
      >
        پرفروشترین ها
      </li>
      <li
        className="submenu-link"
        onMouseOver={(e) => {
          displaySubMenu(e, "discount", 4)
          if(dropdown){
            dispatch({type: SUGGEST_CLOSE})
          }
        }}
      >
        تخفیف های ویژه
      </li>
      {helps.length > 0 && (
        <li className="rahnama">
          راهنما
          <MdKeyboardArrowDown />
          <div className="rahnama-dropdown">
            {helps.map((help) => (
              <Link key={help._id} to={`/help/${help._id}`}>
                {help.title}
              </Link>
            ))}
          </div>
        </li>
      )}
    </ul>
  );
};

export default NavbarItems;
