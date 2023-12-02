import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "../../../util/axios";
import { VscArrowLeft } from "react-icons/vsc";
import Slider from "react-slick";
import ProductCard from "../Shared/ProductCard";
import LoadingSkeletonCard from "../Shared/LoadingSkeletonCard";
import { Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { searchByUserFilter } from "../../../redux/Actions/shopActions";
import { db } from "../../../util/indexedDB";
import {setCountOfSlidersHandler} from '../../../util/customFunctions';
import { UPDATE_ALL_BRANDS } from "../../../redux/Types/shopProductsTypes";
import { POP_RANGE_VALUES } from "../../../redux/Types/rangeInputTypes";
import { CLEAR_NEWEST_PRODUCTS, SAVE_NEWEST_PRODUCTS } from "../../../redux/Types/homeApiTypes";
import "./Section3.css";

const Section3 = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(4);
  const { isOnline, cachedHomeApis: { newestProducts: {items,validTime,configData} } } = useSelector((state) => state);
  const [activeCategory, setActiveCategory] = useState(configData || "");
  const [firstLoad,setFirstLoad] = useState(true);

  const dispatch = useDispatch();
  
  useLayoutEffect(() => {
    if(window.innerWidth < 315){
      setNumberOfSlides(1)
    }else if (window.innerWidth < 720) {
      setNumberOfSlides(2)
    }else if (window.innerWidth < 1000) {
      setNumberOfSlides(3)
    }else {
      setNumberOfSlides(4)
    }

    if(firstLoad && items.length > 0 && Date.now() < validTime){
      const produtsLength = items.length;
      setNumberOfSlides(setCountOfSlidersHandler(produtsLength));
      setProducts(items);
      loading && setLoading(false);
    }
  } , []);

  useEffect(() => {
    if(products.length > 0 && activeCategory?.length > 0 && !firstLoad){
      dispatch({
        type: SAVE_NEWEST_PRODUCTS,
        payload: {
          items: products,
          configData: activeCategory 
        }
      })
    }
    if(products.length > 0 && firstLoad){
      setFirstLoad(false);
    }
  }, [products])

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;
    db.activeCategories.toArray().then(oldCategories => {
      if(oldCategories.length > 0 && mounted){
        setCategories(oldCategories);
        if(items.length > 0 && configData?.length > 0){
          setActiveCategory(configData)
        }else{
          setActiveCategory(oldCategories[0]._id);
        }
      }else{
        axios.get("/get-all-categories",{signal: ac.signal})
        .then((response) => {
          if (response.data.success && mounted) {
            const { categories } = response.data;
            if (categories?.length > 0) {
              setCategories(categories);
              setActiveCategory(categories[0]._id);
            }
          }
        })
        .catch(err => {
          if(err){
            return;
          };
        })
      }
    })
    
    return () => {
      ac.abort()
      mounted = false;
    }
  }, []);
  
  useEffect(() => {
    if (!activeCategory.length > 0 || (items.length > 0 && Date.now() < validTime)) {
      return;
    }
    setLoading(true);
    axios
      .post("/find/products/by-category-and/order", {
        order: "createdAt",
        activeCategory,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          const { foundedProducts } = response.data;
          const produtsLength = foundedProducts.length;
          setNumberOfSlides(setCountOfSlidersHandler(produtsLength));
          setFirstLoad(false);
          setProducts(foundedProducts);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false)
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
          setProducts([]);
          } else {
            setErrorText(err.response.data.message);
          }
      })
  }, [activeCategory,items]);
  
  const changeCategoryHandler = (id) => {
    setActiveCategory(id);
    dispatch({type: CLEAR_NEWEST_PRODUCTS});
  };

  const showAllHandler = () => {
    dispatch(
      searchByUserFilter({
        level: 2,
        order: "createdAt",
        category: activeCategory,
      })
    )
    localStorage.setItem("gonshapPageNumber", JSON.stringify(1));
    dispatch({type: POP_RANGE_VALUES});
    db.brands.toArray().then(items => {
      if(items.length > 0){
        const categoryBrands = items.filter((b) => b.backupFor._id === activeCategory);
        dispatch({
          type: UPDATE_ALL_BRANDS,
          payload: {
            brands: categoryBrands
          }
        })
      }
    })
  };

  const setting = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  return (
    <section className="list_of_products">
      {categories?.length > 0 && navigator.onLine && <div className="column_item" style={{justifyContent: products.length < 1 && "center"}}>
        <h1>جدیدترین محصولات</h1>
        <select className="categories_wrapper_select" value={activeCategory} onChange={(e) => changeCategoryHandler(e.target.value)}>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>}
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : loading ? (
        <LoadingSkeletonCard count={numberOfSlides === 1 ? 1 : numberOfSlides} />
      ) : products?.length > 0 ? (
        <Slider
          {...setting}
          slidesToShow={numberOfSlides}
          className="custom_slider"
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </Slider>
      ) : (
        <p className="warning-message">محصولی یافت نشد!</p>
      )}
      {(isOnline && products.length > 4) && <div className="column_item">
        <Link
          to="/shop"
          onClick={showAllHandler}
        >
          <span className="d-flex-center-center text-blue">
            مشاهده همه
            <VscArrowLeft className="mr-1" />
          </span>
        </Link>
      </div>}
    </section>
  );
};

export default Section3;
