import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchByUserFilter } from "../../redux/Actions/shopActions";
import { closeSubmenu } from "../../redux/Actions/subMenu";
import { Link } from "react-router-dom";
import "./SubMenu.css";
import { UNSUBMIT_QUERY } from "../../redux/Types/searchInputTypes";

const SubMenu = () => {
  const [activeCategoryName, setActiveCategoryName] = useState("لوازم خانگی");
  const [subMenuImage, setSubMenuImage] = useState();
  const [activeSubs, setActiveSubs] = useState([]);

  const dispatch = useDispatch();
  const { isSubmenuOpen, location, navItem } = useSelector(
    (state) => state.subMenu
  );

  const { image, categories, subcategories, order } = navItem;

  const subMenuContainer = useRef(null);

  useEffect(() => {
    if (categories && subcategories && subcategories.length > 0) {
      const subs = subcategories.filter((s) => s.parent === categories[0]._id);
      if (subs.length > 0) {
        setActiveSubs(subs);
      }
    }
  }, [categories, subcategories]);

  useEffect(() => {
    const subMenu = subMenuContainer.current;
    const { centerNavItem } = location;
    subMenu.style.left = `${centerNavItem - 80}px`;
    setSubMenuImage(image);
  }, [location, image]);

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

  return (
    <aside
      ref={subMenuContainer}
      className={`${isSubmenuOpen ? "submenu show" : "submenu"}`}
    >
      <div className="submenu-wrapper">
        <div className="submenu-col-1">
          <h5>دسته بندی ها</h5>
          <ul>
            {categories &&
              categories.map((item, index) => {
                const { name: categoryName, _id } = item;
                return (
                  <li
                    key={index}
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
          {activeSubs &&
            activeSubs.length > 0 &&
            activeSubs.map((sub, index) => (
              <Link
                to="/shop"
                key={index}
                className="subcategorylink"
                onClick={() => submitSearchKeyword(sub._id, sub.parent)}
              >
                {sub.name}
              </Link>
            ))}
        </div>
        <figure className="submenu-col-3">
          <img src={subMenuImage} alt="subMenu-pic" />
        </figure>
      </div>
    </aside>
  );
};

export default SubMenu;
