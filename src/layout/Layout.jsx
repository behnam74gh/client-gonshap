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
import "./Layout.css";

const Layout = (props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [helps, setHelps] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({});

  const dispatch = useDispatch();
  const { isSubmenuOpen } = useSelector((state) => state.subMenu);

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
        const activeCategories = response.data.categories.filter(c => c.storeProvider !== null)
        setCategories(activeCategories);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.message);
        }
      });
  };
  const loadAllSubcategories = () => {
    axios
      .get("/get-all-subcategories")
      .then((response) => {
        setSubcategories(response.data.subcategories);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.message);
        }
      });
  };

  const loadCompanyInfo = () => {
    axios
      .get("/read/company-info")
      .then((response) => {
        if (response.data.success) {
          setCompanyInfo(response.data.companyInfo);
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.message);
        }
      });
  };

  const loadAllHelps = () =>
    axios
      .get("/fetch/list-of-helps")
      .then((response) => {
        if (response.data.success) {
          setHelps(response.data.helps);
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.message);
        }
      });

  useEffect(() => {
    loadCompanyInfo();
    loadAllCategories();
    loadAllSubcategories();
    loadAllHelps();
    if(window.innerWidth < 450){
      dispatch({type: "ISMOBILE",payload: true})
    }
  }, [dispatch]);

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
      <main className="main-body" onMouseOver={subMenuHandler}>
        {props.children}
      </main>
      <Brands />
      <Footer companyInfo={companyInfo} />
    </React.Fragment>
  );
};

export default Layout;
