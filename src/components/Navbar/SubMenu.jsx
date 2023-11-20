import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchByUserFilter } from "../../redux/Actions/shopActions";
import { closeSubmenu } from "../../redux/Actions/subMenu";
import { Link } from "react-router-dom";
import {MdDiscount} from 'react-icons/md';
import {BsFillRocketTakeoffFill,BsFillCartCheckFill} from 'react-icons/bs';
import {SiHotjar} from 'react-icons/si';
import { UNSUBMIT_QUERY } from "../../redux/Types/searchInputTypes";
import "./SubMenu.css";

const SubMenu = () => {
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [activeSubs, setActiveSubs] = useState([]);

  const dispatch = useDispatch();
  const { isSubmenuOpen, location, navItem } = useSelector(
    (state) => state.subMenu
  );

  const { categories, subcategories, order,count } = navItem;
    
  const subMenuContainer = useRef(null);

  useEffect(() => {
    if (categories && subcategories && subcategories.length > 0) {
      setActiveCategoryName(categories[0].name)
      const subs = subcategories.filter((s) => s.parent === categories[0]._id);
      if (subs.length > 0) {
        setActiveSubs(subs);
      }
    }
  }, [categories, subcategories]);

  useEffect(() => {
    const subMenu = subMenuContainer.current;
    const { centerNavItem,bottomNavItem } = location;
    subMenu.style.left = `${centerNavItem - (subMenu.offsetWidth / 2)}px`;
    subMenu.style.top = `${bottomNavItem + window.scrollY}px`;
  }, [location]);

  const displaySubCategories = (categoryName, _id) => {
    setActiveSubs([])
    setActiveCategoryName(categoryName);

    const subs = subcategories.filter((s) => s.parent === _id);
    if (subs.length > 0) {
      setActiveSubs(subs);
    }
  };

  const submitSearchKeyword = (id, parent) => {
    dispatch(
      searchByUserFilter({
        level: 1,
        order,
        subcategory: id,
        category: parent,
      })
    );
    dispatch(closeSubmenu());
    dispatch({ type: UNSUBMIT_QUERY });
  };

  const setCountTextHandler = (count) => {
    switch (count) {
      case 1:
       return (
        <>
          <MdDiscount className="text-blue" />
          <span className="text-blue font-sm my-1">برچسب های <span>{activeCategoryName}</span></span>
        </>
       );
      case 2:
       return (
        <>
          <BsFillRocketTakeoffFill className="text-blue" />
          <span className="text-blue font-sm my-1">جدیدترین محصولات <span>{activeCategoryName}</span></span>
        </>
       );
      case 3:
       return (
        <>
          <BsFillCartCheckFill className="text-blue" />
          <span className="text-blue font-sm my-1">پرفروش ترین محصولات <span>{activeCategoryName}</span></span>
        </>
       );
      default:
        return (
          <>
            <SiHotjar className="text-blue" />
            <span className="text-blue font-sm my-1">محصولات  <span>{activeCategoryName}</span> با بالاترین تخفیف ها</span>
          </>
         );
    }
  }

  return (
    <aside
      ref={subMenuContainer}
      className={`${isSubmenuOpen ? "submenu show" : "submenu"}`}
    >
      <div className="submenu-wrapper">
        <div className="submenu-col-1">
          <ul>
            {categories?.length > 0 && categories.map((item) => {
                const { name: categoryName, _id } = item;
                return (
                  <li
                    key={_id}
                    onMouseOver={() => displaySubCategories(categoryName, _id)}
                    className={
                      activeCategoryName === categoryName
                        ? "activeCategory"
                        : ""
                    }
                  >
                    {categoryName}
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="submenu-col-2">
          <div className="sub_title_wrapper">
            {setCountTextHandler(count)}
          </div>
          <div className="sub_wrapper">
            {activeSubs?.length > 0 ?
              activeSubs.map((sub) => (
                <Link
                  to="/shop"
                  key={sub._id}
                  className="subcategorylink"
                  onClick={() => submitSearchKeyword(sub._id, sub.parent)}
                >
                  {sub.name}
                </Link>
              )) : <span className="empty_sub_text">دسته بندی 
                <strong className="mx-1"> {activeCategoryName} </strong>
               خالی از محصول است</span>
            }
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SubMenu;
