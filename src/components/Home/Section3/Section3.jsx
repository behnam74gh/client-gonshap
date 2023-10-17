import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "../../../util/axios";
import { VscArrowLeft } from "react-icons/vsc";
import Slider from "react-slick";
import ProductCard from "../Shared/ProductCard";
import LoadingSkeletonCard from "../Shared/LoadingSkeletonCard";
import { searchByUserFilter } from "../../../redux/Actions/shopActions";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { db } from "../../../util/indexedDB";
import {setCountOfSlidersHandler} from '../../../util/customFunctions';
import "./Section3.css";

const Section3 = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(4);

  const isOnline = useSelector((state) => state.isOnline)
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
  } , [])

  useEffect(() => {
    setLoading(true)
    if(!navigator.onLine){
      db.newestProducts.toArray()
      .then(items => {
        if(items?.length > 0){
          setProducts(items)
        }
      }) 
    }
    const ac = new AbortController();
    let mounted = true;
    db.activeCategories.toArray().then(items => {
      if(items.length > 0 && mounted){
        setCategories(items);
        setActiveCategory(items[0]._id);
      }else{
        axios.get("/get-all-categories",{signal: ac.signal})
        .then((response) => {
          if (response.data.success && mounted) {
            const { categories } = response.data;
            if (categories?.length > 0) {
              const activeCategories = categories.filter(c => c.storeProvider !== null)
              setCategories(activeCategories);
              setActiveCategory(activeCategories[0]._id);
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
    if (!activeCategory.length > 0) {
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
          setNumberOfSlides(setCountOfSlidersHandler(produtsLength))
          setProducts(foundedProducts);
          setErrorText("");
          foundedProducts.length === 0 && setShowEmptyMessage(true)

          db.newestProducts.clear()
          db.newestProducts.bulkPut(foundedProducts)

        }
      })
      .catch((err) => {
        setLoading(false)
        setProducts([])
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
          setProducts([]);
          } else {
            setErrorText(err.response.data.message);
          }
      })
  }, [activeCategory]);
  
  const changeCategoryHandler = (id) => {
    setActiveCategory(id);
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
      {categories?.length > 0 && navigator.onLine && <div className="column_item">
        <h1>جدیدترین محصولات</h1>
        <select className="categories_wrapper_select" onChange={(e) => changeCategoryHandler(e.target.value)}>
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
            <ProductCard key={p._id} product={p} loading={loading} />
          ))}
        </Slider>
      ) : showEmptyMessage && (
        <p className="warning-message">محصولی یافت نشد!</p>
      )}
      {(isOnline && products.length > 4) && <div className="column_item">
        <Link
          to="/shop"
          onClick={() =>
            dispatch(
              searchByUserFilter({
                level: 2,
                order: "createdAt",
                category: activeCategory,
              })
            )
          }
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
