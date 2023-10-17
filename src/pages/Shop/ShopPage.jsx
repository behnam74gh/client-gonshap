import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteSearchConfig,
  searchByUserFilter,
} from "../../redux/Actions/shopActions";
import { UNSUBMIT_QUERY } from "../../redux/Types/searchInputTypes";
import axios from "../../util/axios";
import ProductCard from "../../components/Home/Shared/ProductCard";
import LoadingSkeletonCard from "../../components/Home/Shared/LoadingSkeletonCard";
import Pagination from "../../components/UI/Pagination/Pagination";
import Section13 from "../../components/Home/Section13/Section13";
import { toast } from "react-toastify";
import { db } from "../../util/indexedDB";
import InputRange from "react-input-range-rtl";
import { Helmet } from "react-helmet-async";
import "react-input-range-rtl/lib/css/index.css";
import "./ShopPage.css";

const ShopPage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [productsLength, setProductsLength] = useState();
  const [page, setPage] = useState(
    JSON.parse(localStorage.getItem("gonshapPageNumber")) || 1
  );
  const [perPage, setPerPage] = useState(40);
  const [activeOrder, setActiveOrder] = useState("createdAt");
  const [activeCategory, setActiveCategory] = useState("none");
  const [activeSubcategory, setActiveSubcategory] = useState("none");
  const [activeBrand, setActiveBrand] = useState("none");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showBrand, setShowBrand] = useState(false);
  const [rangeValues, setRangeValues] = useState({
    min: 10,
    max: 5000,
  });
  const [openMobileFiltering, setOpenMobileFiltering] = useState(true);

  const dispatch = useDispatch();
  const { search, shopConfig } = useSelector((state) => ({ ...state }));

  const { text, submited } = search;
  const { searchConfig } = shopConfig;

  const searchProductsByTextQuery = useCallback(() => {
    if (submited) {
      setShowSub(false);
      setShowBrand(false);
      setActiveOrder("none");
      setActiveCategory("none");
      setActiveSubcategory("none");
      setActiveBrand("none");
      setLoading(true);
      axios
        .post("/fetch-products/by-user-filter", {
          searchConfig: text,
          page,
          perPage,
        })
        .then((response) => {
          setLoading(false);
          const { success, foundedProducts, allCount } = response.data;
          if (success) {
            setProducts(foundedProducts);
            setProductsLength(allCount);
            setErrorText("");
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            setErrorText(err.response.data.message);
          }
        });
    }
  }, [page, perPage, submited, text]);

  const searchProductsBySearchConfig = useCallback(() => {
    setLoading(true);
    axios
      .post("/fetch-products/by-user-filter", {
        searchConfig:
          searchConfig && searchConfig.level
            ? searchConfig
            : !submited && {
                level: 3,
                order: "createdAt",
              },
        page,
        perPage,
      })
      .then((response) => {
        setLoading(false);
        const { success, foundedProducts, allCount } = response.data;
        if (success) {
          setProducts(foundedProducts);
          setProductsLength(allCount);
          setErrorText("");

          db.shopPage.clear()
          db.shopPage.bulkPut(foundedProducts)
        }
      })
      .catch((err) => {
        setLoading(false);
        setProducts([])
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, [page, perPage, searchConfig, submited]);

  useEffect(() => {
    axios
      .get("/get-all-categories")
      .then((response) => {
        if (response.data.success) {
          const activeCategories = response.data.categories.filter(c => c.storeProvider !== null)
          setCategories(activeCategories);
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });

    if (localStorage.getItem("gonshapSearchConfig")) {
      if (window.innerWidth < 780) {
        setOpenMobileFiltering(true);
      }

      const { level, order, category, subcategory, brand, prices,lastConfig } =
        JSON.parse(localStorage.getItem("gonshapSearchConfig"));
        
      if (level === 1) {
        setShowSub(true);
        setActiveCategory(category);
        setActiveSubcategory(subcategory);
        fetchSubsByParentHandler(category);
        fetchBrandsByParentHandler(subcategory);
      } else if (level === 2) {
        setActiveCategory(category);
        fetchSubsByParentHandler(category);
      } else if (level === 3) {
        setActiveOrder(order);
      } else if (level === 4) {
        setActiveCategory(category);
        fetchSubsByParentHandler(category);
        setActiveSubcategory(subcategory);
        fetchBrandsByParentHandler(subcategory);
        setActiveBrand(brand);
      } else if (level === 6) {
        setRangeValues(prices);
        
        if(lastConfig.level === 1){
          setShowSub(true);
          setActiveCategory(lastConfig.category);
          setActiveSubcategory(lastConfig.subcategory);
          fetchSubsByParentHandler(lastConfig.category);
          fetchBrandsByParentHandler(lastConfig.subcategory);
        }  
        if(lastConfig.level === 2) {
          setActiveCategory(lastConfig.category);
          fetchSubsByParentHandler(lastConfig.category)
        }
        if(lastConfig.level === 3) {
          setActiveOrder(lastConfig.order);
        }
        if(lastConfig.level === 4){
          setActiveCategory(lastConfig.category);
          fetchSubsByParentHandler(lastConfig.category);
          setActiveSubcategory(lastConfig.subcategory);
          fetchBrandsByParentHandler(lastConfig.subcategory);
          setActiveBrand(lastConfig.brand);
        }
      }
    }else{
      if (window.innerWidth < 780) {
        setOpenMobileFiltering(false);
      }
    }
    if (window.innerWidth < 450) {
      setPerPage(20);
    }
  }, []);

  useEffect(() => {
    if(navigator.onLine){
      if (text) {
        searchProductsByTextQuery();
      } else {
        searchProductsBySearchConfig();
      }
    }else{
      db.shopPage.toArray().then(items => {
        setProducts(items)
      })
    }
  }, [searchProductsByTextQuery, searchProductsBySearchConfig, text]);

  useEffect(() => {
    return () => {
      if(!window.location.href.includes('/product/details/')){
        dispatch(deleteSearchConfig());
        dispatch({ type: UNSUBMIT_QUERY });
      }
    };
  }, [dispatch]);

  //filtering by subcategory level = 1
  const fetchBrandsByParentHandler = (e) => {
    axios
      .get(`/get/list-of-brands/by-parent/${e}`)
      .then((response) => {
        if (response.data.success) {
          setBrands(response.data.brands);
          setShowBrand(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  const subcategoryFilteringHandler = (e, parent) => {
    if (e === "none") {
      return
    }
    setActiveBrand("none");
    setActiveOrder("none");
    setRangeValues({
      min: 10,
      max: 5000,
    });

    dispatch({ type: UNSUBMIT_QUERY });

    setActiveSubcategory(e);
    dispatch(
      searchByUserFilter({
        level: 1,
        subcategory: e,
        category: parent,
      })
    );
    fetchBrandsByParentHandler(e);
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  //filtering by category level = 2
  const fetchSubsByParentHandler = (e) =>
    axios
      .get(`/category/subs/${e}`)
      .then((response) => {
        if (response.data.success) {
          setSubcategories(response.data.subcategories);
          setShowSub(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });

  const categoryFilteringHandler = (e) => {
    if (e === "none") {
      return
    }
    setActiveCategory(e);
    setActiveSubcategory("none");
    setActiveOrder("none");
    setRangeValues({
      min: 10,
      max: 9000,
    });

    dispatch({ type: UNSUBMIT_QUERY });

    setShowSub(false);
    setShowBrand(false);
    dispatch(
      searchByUserFilter({
        level: 2,
        category: e,
      })
    );
    fetchSubsByParentHandler(e);
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  //base filtering with level = 3
  const baseFilteringHandler = (e) => {
    if (e === "none") {
      return;
    }
    setActiveCategory("none");
    setActiveSubcategory("none");
    setActiveBrand("none");
    setShowSub(false);
    setShowBrand(false);
    setRangeValues({
      min: 10,
      max: 5000,
    });

    dispatch({ type: UNSUBMIT_QUERY });

    setActiveOrder(e);
    dispatch(
      searchByUserFilter({
        level: 3,
        order: e,
      })
    );
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  //filtering by brand level = 4

  const brandFilteringHandler = (e) => {
    if (e === "none") {
      return
    }
    setActiveOrder("none");
    setRangeValues({
      min: 10,
      max: 5000,
    });

    dispatch({ type: UNSUBMIT_QUERY });

    setActiveBrand(e);
    dispatch(
      searchByUserFilter({
        level: 4,
        brand: e,
        subcategory: activeSubcategory,
        category: activeCategory,
      })
    );
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  const priceFilteringHandler = () => {
    dispatch({ type: UNSUBMIT_QUERY });

    dispatch(
      searchByUserFilter({
        level: 6,
        prices: rangeValues,
        lastConfig: searchConfig?.level !== 6 ? searchConfig : searchConfig.lastConfig,
      })
    );

    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  return (
    <section id="shop_page">
      <Helmet>
        <title>ویترین محصولات</title>
      </Helmet>
      {navigator.onLine && <div className="filtering_wrapper">
        <div className="base_filtering_wrapper">
          <span
            className="filter_btn"
            onClick={() => setOpenMobileFiltering(!openMobileFiltering)}
          >
            فیلترینگ
          </span>

          <select
            value={activeOrder}
            onChange={(e) => baseFilteringHandler(e.target.value)}
          >
            <option value="none">مرتب سازی کلی :</option>
            <option value="createdAt">جدیدترین محصولات</option>
            <option value="sold">پرفروش ترین محصولات</option>
            <option value="discount">بالاترین تخفیف ها</option>
            <option value="reviewsCount">پربازدیدترین محصولات</option>
          </select>
        </div>

        <div
          className="desktop_only_filtering"
          style={{ display: openMobileFiltering ? "flex" : "none" }}
        >
          <div className="multi_filtering_wrapper" style={{flex: !showSub && "10% 1"}}>
            <div className="category_filtering_wrapper">
              <select
                value={activeCategory}
                onChange={(e) => categoryFilteringHandler(e.target.value)}
              >
                <option value="none">دسته بندی :</option>
                {categories.length > 0 &&
                  categories.map((c, i) => (
                    <option key={i} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            {showSub && (
              <div className="subcategory_filtering_wrapper">
                <select
                  value={activeSubcategory}
                  onChange={(e) =>
                    subcategoryFilteringHandler(
                      e.target.value,
                      subcategories[0].parent
                    )
                  }
                >
                  <option value="none">برچسب :</option>
                  {subcategories.length > 0 &&
                    subcategories.map((s, i) => (
                      <option key={i} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {showBrand && (
              <div className="brand_filtering_wrapper">
                <select
                  value={activeBrand}
                  onChange={(e) => brandFilteringHandler(e.target.value)}
                >
                  <option value="none">برند :</option>
                  {brands.length > 0 &&
                    brands.map((b, i) => (
                      <option key={i} value={b._id}>
                        {b.brandName}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          <div className="price_filtering_wrapper">
            <span className="range_slider_lable">قیمت :</span>
            <div className="range_slider">
              <InputRange
                maxValue={99999}
                minValue={10}
                step={1}
                direction="rtl"
                draggableTrack={false}
                onChange={(value) => {
                  setRangeValues(value);
                }}
                value={rangeValues}
                formatLabel={(value) => {
                  const newValue = value + "000";

                  return `${Number(newValue).toLocaleString("fa")} تومان`;
                }}
              />
            </div>
            <button
              className="range_slider_btn"
              type="button"
              onClick={priceFilteringHandler}
            >
              ثبت
            </button>
          </div>
        </div>
      </div>}
      <div className="shop_products_wrapper">
        {loading ? (
          <LoadingSkeletonCard count={16} />
        ) : errorText.length > 0 ? (
          <p className="warning-message w-100 text-center">{errorText}</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showSold={
                (searchConfig?.order || searchConfig?.lastConfig?.order) === "sold" ? true : false
              }
              showReviews={
                (searchConfig?.order || searchConfig?.lastConfig?.order) === "reviewsCount"
                  ? true
                  : false
              }
              showDiscount={
                (searchConfig?.order || searchConfig?.lastConfig?.order) === "discount"
                  ? true
                  : false
              }
            />
          ))
        ) : (
          <div className="d-flex-center-center w-100 h-50">
            <p className="text-center w-100 font-sm">
              براساس این جستوجو محصولی یافت نشد!
            </p>
          </div>
        )}
      </div>
      {productsLength > perPage && (
        <Pagination
          perPage={perPage}
          productsLength={productsLength}
          setPage={setPage}
          page={page}
          isShopPage={true}
        />
      )}
      <Section13 />
    </section>
  );
};

export default ShopPage;
