import React from "react";
import { Link } from "react-router-dom";
import { FaTh } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./NavbarItems.css";
import { openSubMenu, closeSubmenu } from "../../redux/Actions/subMenu";
import { useDispatch, useSelector } from "react-redux";

const NavbarItems = ({ categories, subcategories, helps }) => {
  const dispatch = useDispatch();

  const { isSubmenuOpen } = useSelector((state) => state.subMenu);

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
        <Link to="/shop">ویترین</Link>
      </li>
      <li>
        <Link to="/stores" className="text-purple">فروشگاه ها</Link>
      </li>
      <li className="submenu-link">
        <FaTh className="submenu-link" style={{ marginLeft: "10px" }} />
        <span
          className="submenu-link"
          onMouseOver={(e) => displaySubMenu(e, "reviewsCount", 1)}
        >
          دسته بندی کالا
        </span>
      </li>

      <li
        className="submenu-link"
        onMouseOver={(e) => displaySubMenu(e, "createdAt", 2)}
      >
        جدیدترین ها
      </li>
      <li
        className="submenu-link"
        onMouseOver={(e) => displaySubMenu(e, "sold", 3)}
      >
        پرفروشترین ها
      </li>
      <li
        className="submenu-link"
        onMouseOver={(e) => displaySubMenu(e, "discount", 4)}
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
