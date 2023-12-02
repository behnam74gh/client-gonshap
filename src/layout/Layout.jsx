import React, { useEffect, useState } from "react";
import Drawer from "../components/Navbar/Drawer";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import SubMenu from "../components/Navbar/SubMenu";
import { closeSubmenu } from "../redux/Actions/subMenu";
import { useLocation } from "react-router-dom";
import axios from "../util/axios";
import Footer from "../components/Footer/Footer";
import Brands from "../components/Brands/Brands";
import Backdrop from "../components/UI/Backdrop/Backdrop";
import { db } from "../util/indexedDB";
import { toast } from "react-toastify";
import OfflineStatus from "../pages/OfflineStatus";
import { SEARCH_QUERY, SUGGEST_CLOSE } from "../redux/Types/searchInputTypes";
import "./Layout.css";

const Layout = (props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [helps, setHelps] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});

  const dispatch = useDispatch();
  const { isSubmenuOpen } = useSelector((state) => state.subMenu);
  const { isOnline, search: { text, dropdown, submited } } = useSelector((state) => state);

  const openDrawerHandler = () => setShowDrawer(!showDrawer);

  const closeDrawerHandler = () => setShowDrawer(false);

  const subMenuHandler = () => {
    if (isSubmenuOpen) {
      dispatch(closeSubmenu());
    }
  };

  const loadAllCategories = () => {
    axios
      .get("/get-all-categories")
      .then((response) => {
        setCategories(response.data.categories);

        db.activeCategories.clear()
        db.activeCategories.bulkPut(response.data.categories)
      })
      .catch((err) => {
        if (err.response) {
          toast.warn(err.response.data.message);
        }
      });
  };
  const loadAllSubcategories = () => {
    axios
      .get("/get-all-subcategories")
      .then((response) => {
        setSubcategories(response.data.subcategories);

        db.subCategories.clear()
        db.subCategories.bulkPut(response.data.subcategories)
      })
      .catch((err) => {
        if (err.response) {
          toast.warn(err.response.data.message);
        }
      });
  };

  const loadCompanyInfo = () => {
    axios
      .get("/read/company-info")
      .then((response) => {
        if (response.data.success) {
          setCompanyInfo(response.data.companyInfo);

          db.companyInformation.clear()
          db.companyInformation.add(response.data.companyInfo)
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.warn(err.response.data.message);
        }
      });
  };

  const loadAllHelps = () =>
    axios
      .get("/fetch/list-of-helps")
      .then((response) => {
        if (response.data.success) {
          setHelps(response.data.helps);

          db.helps.clear()
          db.helps.bulkPut(response.data.helps)
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.warn(err.response.data.message);
        }
      });

  useEffect(() => {
    if(navigator.onLine){
      loadCompanyInfo();
      loadAllCategories();
      loadAllSubcategories();
      loadAllHelps();
    }else{
      db.companyInformation.toArray().then(items => {
        if(items.length > 0) {
          setCompanyInfo(items[0])
        }
      })
      db.activeCategories.toArray().then(items => {
        if(items.length > 0) {
          setCategories(items)
        }
      })
      db.subCategories.toArray().then(items => {
        if(items.length > 0) {
          setSubcategories(items)
        }
      })
      db.helps.toArray().then(items => {
        if(items.length > 0) {
          setHelps(items)
        }
      })
    }

    if(window.innerWidth < 450){
      dispatch({type: "ISMOBILE",payload: true})
    }
  }, [dispatch]);
  
  const { pathname } = useLocation();
  useEffect(() => {
    dispatch({type: "ISONLINE",payload: navigator.onLine})
  }, [dispatch,pathname])
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if(text.length > 0 && !submited && pathname !== "/shop"){
      dispatch({ type: SEARCH_QUERY, payload: { keyword: "" } });
    }
  }, [pathname]);

  const closeDropdownHandler = () => {
    if(dropdown){
      dispatch({type: SUGGEST_CLOSE})
    }
  }

  return (
    <React.Fragment>
      <Navbar
        toggleDrawer={openDrawerHandler}
        categories={categories}
        subcategories={subcategories}
        companyInfo={companyInfo}
        helps={helps}
      />
      <Drawer
        showBackdrop={showDrawer}
        drawerOpen={showDrawer}
        backdropClick={closeDrawerHandler}
        categories={categories}
        subcategories={subcategories}
        companyInfo={companyInfo}
        helps={helps}
      />
      <SubMenu />
      <Backdrop show={isSubmenuOpen} onMouseOver={subMenuHandler} />
      <main className={window.innerWidth < 780 && pathname.includes('/dashboard') ? "w-100 main-body" : "main-body"} onMouseOver={subMenuHandler} onClick={closeDropdownHandler}>
        {isOnline ? props.children : <OfflineStatus />}
      </main>
      <Brands />
      <Footer companyInfo={companyInfo} />
    </React.Fragment>
  );
};

export default Layout;
