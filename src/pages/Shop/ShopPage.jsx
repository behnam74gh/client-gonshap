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
import Section6 from "../../components/Home/Section6/Section6";
import { toast } from "react-toastify";
import InputRange from "react-input-range-rtl";
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
  const [perPage, setPerPage] = useState(16);
  const [activeOrder, setActiveOrder] = useState("none");
  const [activeCategory, setActiveCategory] = useState("none");
  const [activeSubcategory, setActiveSubcategory] = useState("none");
  const [activeBrand, setActiveBrand] = useState("none");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showBrand, setShowBrand] = useState(false);
  const [activeStar, setActiveStar] = useState("none");
  const [rangeValues, setRangeValues] = useState({
    min: 90,
    max: 9000,
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
      setActiveStar("none");
      setActiveBrand("none");
      setLoading(true);
      axios
        .post("/fetch-products/by-user-filter", {
          searchConfig: text,
          page,
          perPage,
        })
        .then((response) => {
          console.log(response.data);
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
        }
      })
      .catch((err) => {
        setLoading(false);
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

    if (window.innerWidth < 780) {
      setOpenMobileFiltering(false);
    }
    if (localStorage.getItem("gonshapSearchConfig")) {
      const { level, order, category, subcategory, brand, stars, prices } =
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
      } else if (level === 5) {
        setActiveStar(stars);
      } else if (level === 6) {
        setRangeValues(prices);
      }
    }
    if (window.innerWidth < 450) {
      setPerPage(8);
    }
  }, []);

  useEffect(() => {
    if (text) {
      searchProductsByTextQuery();
    } else {
      searchProductsBySearchConfig();
    }
  }, [searchProductsByTextQuery, searchProductsBySearchConfig, text]);

  useEffect(() => {
    return () => {
      dispatch(deleteSearchConfig());
      dispatch({ type: UNSUBMIT_QUERY });
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
    setActiveStar("none");
    setActiveBrand("none");
    setActiveOrder("none");
    setRangeValues({
      min: 90,
      max: 9000,
    });

    dispatch({ type: UNSUBMIT_QUERY });

    setActiveSubcategory(e);
    dispatch(
      searchByUserFilter({
        level: 1,
        subcategory: e,
        order: "createdAt",
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
    setActiveCategory(e);
    setActiveSubcategory("none");
    setActiveStar("none");
    setActiveOrder("none");
    setRangeValues({
      min: 90,
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
      setActiveOrder(e);
      return;
    }
    setActiveStar("none");
    setActiveCategory("none");
    setActiveSubcategory("none");
    setActiveBrand("none");
    setShowSub(false);
    setShowBrand(false);
    setRangeValues({
      min: 90,
      max: 9000,
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
    setActiveStar("none");
    setActiveOrder("none");
    setRangeValues({
      min: 90,
      max: 9000,
    });

    dispatch({ type: UNSUBMIT_QUERY });

    setActiveBrand(e);
    dispatch(
      searchByUserFilter({
        level: 4,
        brand: e,
        subcategory: activeSubcategory,
        order: "createdAt",
        category: activeCategory,
      })
    );
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  //filtering by star-ratings level = 5
  const starRatingFilteringHandler = (e) => {
    if (e === "none") {
      return setActiveStar(e);
    }
    setActiveOrder("none");
    setActiveCategory("none");
    setActiveSubcategory("none");
    setActiveBrand("none");
    setShowSub(false);
    setShowBrand(false);
    setRangeValues({
      min: 90,
      max: 9000,
    });

    dispatch({ type: UNSUBMIT_QUERY });

    setActiveStar(e);

    dispatch(
      searchByUserFilter({
        level: 5,
        stars: Number(e),
      })
    );
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  const priceFilteringHandler = () => {
    setActiveOrder("none");
    setActiveCategory("none");
    setActiveSubcategory("none");
    setActiveBrand("none");
    setActiveStar("none");
    setShowSub(false);
    setShowBrand(false);

    dispatch({ type: UNSUBMIT_QUERY });

    dispatch(
      searchByUserFilter({
        level: 6,
        prices: rangeValues,
        order: "sold",
      })
    );

    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  return (
    <section id="shop_page">
      <div className="filtering_wrapper">
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
          <div className="price_filtering_wrapper">
            <span className="range_slider_lable">قیمت :</span>
            <div className="range_slider">
              <InputRange
                maxValue={99999}
                minValue={9}
                step={5}
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
          <div className="rating_filtering_wrapper">
            <select
              value={activeStar}
              onChange={(e) => starRatingFilteringHandler(e.target.value)}
            >
              <option value="none">امتیاز :</option>
              <option value="1">⭐ </option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
            </select>
          </div>
          <div className="multi_filtering_wrapper">
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
        </div>
      </div>
      <div className="shop_products_wrapper">
        {loading ? (
          <LoadingSkeletonCard count={16} />
        ) : errorText.length > 0 ? (
          <p className="warning-message w-100 text-center">{errorText}</p>
        ) : products.length > 0 ? (
          products.map((product, i) => (
            <ProductCard
              key={i}
              product={product}
              showSold={
                searchConfig && searchConfig.order === "sold" ? true : false
              }
              showReviews={
                searchConfig && searchConfig.order === "reviewsCount"
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
      <Section6 />
    </section>
  );
};

export default ShopPage;
