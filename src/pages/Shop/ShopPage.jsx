import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
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
import { Helmet } from "react-helmet-async";
import RangeValues from "../../components/UI/FormElement/RangeValues";
import { POP_RANGE_VALUES, PUT_RANGE_VALUES } from "../../redux/Types/rangeInputTypes";
import { CLEAR_ALL_BRANDS, CLEAR_SHOP_PRODUCTS, PUSH_OLD_ITEMS, SAVE_SHOP_PRODUCTS, SET_ALL_BRANDS } from "../../redux/Types/shopProductsTypes";
import "react-input-range-rtl/lib/css/index.css";
import "./ShopPage.css";

const ShopPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(
    JSON.parse(localStorage.getItem("gonshapPageNumber")) || 1
  );
  const [perPage] = useState(window.innerWidth < 450 ? 20 : 40);
  const [activeOrder, setActiveOrder] = useState("createdAt");
  const [activeCategory, setActiveCategory] = useState("none");
  const [activeSubcategory, setActiveSubcategory] = useState("none");
  const [activeBrand, setActiveBrand] = useState("none");
  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [brands, setBrands] = useState([]);
  const [showBrand, setShowBrand] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [openMobileFiltering, setOpenMobileFiltering] = useState(true);
  const { search, shopConfig,rangeValues,shopProducts: { items, itemsLength, allBrands,oldProductsCount} } = useSelector((state) => ({ ...state }));
  const [products, setProducts] = useState(items || []);
  const [productsLength, setProductsLength] = useState(itemsLength || 0);

  const dispatch = useDispatch();
   
  const { text, submited, searchByText } = search;
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
      !openMobileFiltering && setOpenMobileFiltering(true);
      axios
        .post("/fetch-products/by-user-filter", {
          searchConfig: text,
          page: JSON.parse(localStorage.getItem("gonshapPageNumber")) || page,
          perPage,
        })
        .then((response) => {
          setLoading(false);
          const { success, foundedProducts, allCount } = response.data;
          if (success) {
            setProductsLength(allCount);
            setProducts(foundedProducts);
            setErrorText("");
            dispatch({
              type: PUSH_OLD_ITEMS,
              payload: foundedProducts.length
            })
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            setErrorText(err.response.data.message);
          }
        });
    }
  }, [page,perPage,submited]);

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
        page: JSON.parse(localStorage.getItem("gonshapPageNumber")) || page,
        perPage,
      })
      .then((response) => {
        setLoading(false);
        const { success, foundedProducts, allCount } = response.data;
        if (success) {
          setProductsLength(allCount);
          setProducts(foundedProducts);
          setErrorText("");
          dispatch({
            type: PUSH_OLD_ITEMS,
            payload: foundedProducts.length
          })
        }
      })
      .catch((err) => {
        setLoading(false);
        setProducts([])
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, [page,perPage,searchConfig, submited]);

  useLayoutEffect(() => {
    if(text.length > 0 && searchByText && !submited){
      dispatch({type: UNSUBMIT_QUERY})
    }

    if(items?.length > 0 && firstLoad){
      setFirstLoad(false);
    }

    return () => {
      if(!window.location.href.includes('/product/details/') && text.length > 1){
        dispatch({ type: UNSUBMIT_QUERY });
      }
    }
  }, [])

  useEffect(() => {
    if(products.length > 0){
      dispatch({
        type: SAVE_SHOP_PRODUCTS,
        payload: {
          items: products,
          length: productsLength
        } 
      })
    }
  }, [products])

  useEffect(() => {
    db.activeCategories.toArray().then(items => {
      if(items.length > 0){
        setCategories(items);
      }else{
        axios
        .get("/get-all-categories")
        .then((response) => {
          if (response.data.success) {
            setCategories(response.data.categories);
          }
        })
        .catch((err) => {
          if (err.response) {
            setErrorText(err.response.data.message);
          }
        });
      }
    }) 

    db.subCategories.toArray().then(items => {
      if(items.length > 0) {
        setAllSubcategories(items)
      }
    })
    
    const executeCondition = items.length > 0 ? localStorage.getItem("gonshapSearchConfig") : (localStorage.getItem("gonshapSearchConfig") && !firstLoad)
  
    if (executeCondition) {
      if (window.innerWidth < 780) {
        setOpenMobileFiltering(false);
      }

      const { level, order, category, subcategory, brand, prices,lastConfig } =
        JSON.parse(localStorage.getItem("gonshapSearchConfig"));
     
      if (level === 1) {
        setShowSub(true);
        setActiveCategory(category);
        setActiveOrder(order)
        setActiveSubcategory(subcategory);
        fetchSubsByParentHandler(category);
        fetchBrandsByParentHandler(subcategory);
        dispatch({type: POP_RANGE_VALUES});
        setActiveBrand("none");
      } else if (level === 2) {
        setActiveOrder(order)
        setActiveCategory(category);
        setActiveSubcategory("none");
        setShowBrand(false);
        fetchSubsByParentHandler(category);
      } else if (level === 3) {
        setActiveOrder(order);
      } else if (level === 4) {
        setActiveCategory(category);
        fetchSubsByParentHandler(category);
        setActiveSubcategory(subcategory);
        fetchBrandsByParentHandler(subcategory);
        setActiveBrand(brand);
        setActiveOrder(order);
        dispatch({type: POP_RANGE_VALUES});
      } else if (level === 6) {
        dispatch({
          type: PUT_RANGE_VALUES,
          payload: {
              min: prices.min,
              max: prices.max
          }
        })
        
        if(lastConfig.level === 1){
          setShowSub(true);
          setActiveCategory(lastConfig.category);
          setActiveSubcategory(lastConfig.subcategory);
          fetchSubsByParentHandler(lastConfig.category);
          fetchBrandsByParentHandler(lastConfig.subcategory);
          setActiveOrder(lastConfig.order);
        }  
        if(lastConfig.level === 2) {
          setActiveCategory(lastConfig.category);
          fetchSubsByParentHandler(lastConfig.category);
          setActiveOrder(lastConfig.order);
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
          setActiveOrder(lastConfig.order);
        }
      }

    }else{
      if (window.innerWidth < 780) {
        text.length < 1 && !submited && setOpenMobileFiltering(false);
      }
    }
  }, [submited,searchByText,products]);

  useEffect(() => {
    const firstLoadCondition = (items.length === products.length && firstLoad && (searchConfig?.level && ![1,2,3,4,6].includes(searchConfig.level)) && text?.length < 1)
    if((items.length > 0 && products.length > 0) || firstLoadCondition){
      return;
    } 

    setFirstLoad(false);

    if (text && submited && searchByText) {
      searchProductsByTextQuery();
    } else if(!searchByText || !text) {
    searchProductsBySearchConfig();
    }
  }, [searchProductsByTextQuery, searchProductsBySearchConfig, submited,items]);
  
  useEffect(() => {
    return () => {
      if(!window.location.href.includes('/shop') && items.length > 0 && oldProductsCount < 1){
        dispatch(deleteSearchConfig());
        dispatch({ type: CLEAR_SHOP_PRODUCTS });
        dispatch({ type: CLEAR_ALL_BRANDS});
      } 
    };
  }, [oldProductsCount]);

  //filtering by subcategory level = 1
  const subcategoryFilteringHandler = (e, parent) => {
    if (e === "none") {
      return
    }
    setActiveBrand("none");
    dispatch({type: POP_RANGE_VALUES});

    dispatch({ type: UNSUBMIT_QUERY });

    setActiveSubcategory(e);
    dispatch(
      searchByUserFilter({
        level: 1,
        subcategory: e,
        category: parent,
        order: activeOrder
      })
    );
    fetchBrandsByParentHandler(e);
    setProducts([]);
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  //filtering by category level = 2
  const fetchSubsByParentHandler = (e) => {
    if(allSubcategories.length < 1){
      db.subCategories.toArray().then(items => {
        if(items.length > 0) {
          const filteredSubs = items.filter(sub => sub.parent === e);
          setShowSub(true);
          setSubcategories(filteredSubs);
        }else{
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
        }
      });
    }else{
      const filteredSubs = allSubcategories.filter(sub => sub.parent === e);
      setShowSub(true);
      setSubcategories(filteredSubs);
    }
  }

  const categoryFilteringHandler = (e) => {
    if (e === "none") {
      return
    }
   
    setActiveSubcategory("none");
    setActiveCategory(e);
    setActiveOrder("createdAt");
    dispatch({type: POP_RANGE_VALUES});

    dispatch({ type: UNSUBMIT_QUERY });
    setProducts([]);

    setShowSub(false);
    setShowBrand(false);
    setBrands([]);
    dispatch(
      searchByUserFilter({
        level: 2,
        category: e,
        order: "createdAt"
      })
    );
    fetchSubsByParentHandler(e);
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");

    db.brands.toArray().then(items => {
      if(items.length > 0){
        const categoryBrands = items.filter((b) => b.backupFor._id === e);
        dispatch({
          type: SET_ALL_BRANDS,
          payload: {
            brands: categoryBrands
          }
        })
      }
    })
    
  };

  //base filtering with level = 3
  const baseFilteringHandler = (e) => {
    if (e === "none") {
      setActiveCategory("none");
      setActiveSubcategory("none");
      setActiveBrand("none");
      setShowSub(false);
      setShowBrand(false);
      setProducts([]);
      dispatch({type: POP_RANGE_VALUES});
      dispatch(
        searchByUserFilter({
          level: 3,
          order: "createdAt",
        })
      );
      setActiveOrder("createdAt")
      return;
    }
    
    dispatch({ type: UNSUBMIT_QUERY });
    setProducts([]);
    setBrands([]);

    setActiveOrder(e);
    if(searchConfig?.level !== 3){
      let config = {...searchConfig};
      if(searchConfig?.level === 6){
        config.lastConfig.order = e;
      }else{
        config.order = e;
      }

      dispatch(
        searchByUserFilter(config)
      );
    }else{
      setActiveCategory("none");
      setActiveSubcategory("none");
      setActiveBrand("none");
      setShowSub(false);
      setShowBrand(false);
      dispatch({type: POP_RANGE_VALUES});

      dispatch(
        searchByUserFilter({
          level: 3,
          order: e,
        })
      );
    }
  
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  //filtering by brand level = 4
  const fetchBrandsByParentHandler = (e) => {
    if(allBrands.length < 1){
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
    }else{
      let correctBrands = [];
      for(let i = 0; i < allBrands.length; i++){
        if(allBrands[i].parents?.length > 0){
          const foundBrand = allBrands[i].parents.find(p => p._id === e);
          if(foundBrand){
            correctBrands.push(allBrands[i])
          }
        }
      }

      setBrands(correctBrands);
      setShowBrand(true);
    }
 
  };
  const brandFilteringHandler = (e) => {
    if (e === "none") {
      return
    }

    dispatch({ type: UNSUBMIT_QUERY });

    setActiveBrand(e);
    setProducts([]);

    let config = {};
    if(searchConfig?.level === 6){
      config = {...searchConfig};
      config.lastConfig.level = 4;
      config.lastConfig.brand = e;
    }else{
      config = {
        level: 4,
        brand: e,
        subcategory: activeSubcategory,
        category: activeCategory,
        order: activeOrder
      }
    }
    dispatch(
      searchByUserFilter(config)
    );
    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  // filtering by price level = 6
  const priceFilteringHandler = () => {
    dispatch({ type: UNSUBMIT_QUERY });

    dispatch(
      searchByUserFilter({
        level: 6,
        prices: rangeValues,
        lastConfig: searchConfig?.level !== 6 ? searchConfig : searchConfig.lastConfig,
      })
    );
    setProducts([]);

    setPage(1);
    localStorage.removeItem("gonshapPageNumber");
  };

  return (
    <section id="shop_page">
      <Helmet>
        <title>ویترین محصولات</title>
        <meta
          name="description"
          content="صفحه ویترین مرکز جستوجوی محصولات در بازارچک است، کاربران میتوانند با فیلترینگ مختلف، محصولات مد نظر خود را  پیدا کنند"
        />
        <link rel="canonical" href="/shop" />
      </Helmet>
      {navigator.onLine && <div className="filtering_wrapper">
        <div className="base_filtering_wrapper">
          {text.length < 1 && searchConfig && (searchConfig.order || searchConfig.level) && <span
            className="filter_btn"
            onClick={() => setOpenMobileFiltering(!openMobileFiltering)}
          >
            {openMobileFiltering ? "بستن قیمت" : "باز کردن قیمت"}
          </span>}

          <select
            value={activeOrder}
            onChange={(e) => baseFilteringHandler(e.target.value)}
          >
            <option value="none">مرتب سازی کلی :</option>
            <option value="createdAt">جدیدترین محصولات</option>
            <option value="sold">پرفروش ترین محصولات</option>
            <option value="discount">بالاترین تخفیف ها</option>
            <option value="reviewsCount">پربازدید ترین محصولات</option>
            <option value="expensive">گران ترین محصولات</option>
            <option value="cheap">ارزان ترین محصولات</option>
          </select>
        </div>

        <div
          className="desktop_only_filtering"
          style={{ display: "flex" }}
        >
          <div className="multi_filtering_wrapper" style={{flex: !showSub && "10% 1"}}>
            <div className="category_filtering_wrapper">
              <select
                value={activeCategory}
                onChange={(e) => categoryFilteringHandler(e.target.value)}
              >
                <option value="none">دسته بندی :</option>
                {categories.length > 0 &&
                  categories.map((c) => (
                    <option key={c._id} value={c._id}>
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
                    subcategories.map((s) => (
                      <option key={s._id} value={s._id}>
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
                    brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.brandName}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {text.length > 0 && openMobileFiltering ? (
            <div className="price_filtering_wrapper">
              <span className="font-sm text-mute">
                {`محصولات با عنوان ${text} :`}
              </span>
            </div>
          ) : openMobileFiltering && searchConfig && (searchConfig.order || searchConfig.level) && <div className="price_filtering_wrapper">
            <span className="range_slider_lable">قیمت :</span>
            <div className="range_slider">
              <RangeValues />
            </div>
            <button
              className="range_slider_btn"
              type="button"
              onClick={priceFilteringHandler}
            >
              ثبت
            </button>
          </div>}
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
            />
          ))
        ) : (
          <div className="d-flex-center-center w-100 h-50">
            <p className="text-center w-100 font-sm">
              براساس این جستوجو محصولی یافت نشد
            </p>
          </div>
        )}
      </div>
      {productsLength > perPage && (
        <Pagination
          perPage={perPage}
          productsLength={productsLength}
          setPage={setPage}
          page={JSON.parse(localStorage.getItem("gonshapPageNumber")) || page}
          isShopPage={true}
        />
      )}
      <Section13 />
    </section>
  );
};

export default ShopPage;
