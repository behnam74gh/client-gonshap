import React from "react";
import { Link } from "react-router-dom";
import { FaTh } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./NavbarItems.css";
import { openSubMenu, closeSubmenu } from "../../redux/Actions/subMenu";
import { useDispatch, useSelector } from "react-redux";
import sm1 from "../../assets/images/submenu-pic/sm1.jpg";
import sm2 from "../../assets/images/submenu-pic/sm2.jpg";
import sm3 from "../../assets/images/submenu-pic/sm3.jpg";
import sm4 from "../../assets/images/submenu-pic/sm4.jpg";

const NavbarItems = ({ categories, subcategories, helps }) => {
  const dispatch = useDispatch();

  const { isSubmenuOpen } = useSelector((state) => state.subMenu);

  const displaySubMenu = (e, order, image) => {
    const locNavItem = e.target.getBoundingClientRect();
    const centerNavItem = (locNavItem.left + locNavItem.right) / 2;
    const bottomNavItem = locNavItem.bottom - 10;
    const navItemInfo = {
      categories,
      subcategories,
      order,
      image,
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
      <li className="submenu-link">
        <FaTh className="submenu-link" style={{ marginLeft: "10px" }} />
        <span
          className="submenu-link"
          onMouseOver={(e) => displaySubMenu(e, "reviewsCount", `${sm1}`)}
        >
          دسته بندی کالاها
        </span>
      </li>

      <li
        className="submenu-link"
        onMouseOver={(e) => displaySubMenu(e, "createdAt", `${sm2}`)}
      >
        تازه ها
      </li>
      <li
        className="submenu-link"
        onMouseOver={(e) => displaySubMenu(e, "sold", `${sm3}`)}
      >
        پرفروشترین ها
      </li>
      <li
        className="submenu-link"
        onMouseOver={(e) => displaySubMenu(e, "discount", `${sm4}`)}
      >
        تخفیف های ویژه
      </li>
      {helps.length > 0 && (
        <li className="rahnama">
          راهنما
          <MdKeyboardArrowDown />
          <div className="rahnama-dropdown">
            {helps.map((help, i) => (
              <Link key={i} to={`/help/${help._id}`}>
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
