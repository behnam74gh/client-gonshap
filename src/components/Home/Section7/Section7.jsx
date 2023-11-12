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
import { useInView } from "react-intersection-observer";
import "../Section3/Section3.css";

const Section7 = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [categoryErrorText, setCategoryErrorText] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(4);
  const [isViewed,setIsviewed] = useState(false);

  const isOnline = useSelector((state) => state.isOnline)
  const dispatch = useDispatch();
  const {ref, inView} = useInView({threshold: 0});

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
    const ac = new AbortController();
    let mounted = true;
    if(inView && !isViewed){
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
                setCategories(categories);
                setActiveCategory(categories[0]._id);
                setCategoryErrorText("");
              }
            }
          })
          .catch((err) => {
            if (err.response && mounted) {
              setCategoryErrorText(err.response.data.message);
            }
          });
        }
      })
    }

    return () => {
      ac.abort()
      mounted = false;
    }
  }, [inView]);

  
  useEffect(() => {
    if(inView && !isViewed && !navigator.onLine){
      db.soldProducts.toArray()
      .then(items => {
        if(items?.length > 0){
          setProducts(items)
        }
      })
  }
  }, [inView])

  useEffect(() => {
    if (!activeCategory.length > 0 || !navigator.onLine) {
      return;
    }
    if(inView){
      setLoading(true);
      axios
      .post("/find/products/by-category-and/order", {
        order: "sold",
        activeCategory,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          const { foundedProducts } = response.data;
          const produtsLength = foundedProducts.length;
          setNumberOfSlides(setCountOfSlidersHandler(produtsLength));
          setProducts(foundedProducts);
          setErrorText("");

          db.soldProducts.clear()
          db.soldProducts.bulkPut(foundedProducts)

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
      });

      setIsviewed(true);
    }
  }, [activeCategory,inView]);

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
    <section ref={ref} className="list_of_products">

      <div className="column_item">
        <h1>پرفروشترین محصولات</h1>
        {categoryErrorText.length > 0 && (
          <p className="warning-message">{categoryErrorText}</p>
        )}
        {isOnline && <select className="categories_wrapper_select" onChange={(e) => changeCategoryHandler(e.target.value)}>
          {categories?.length > 0 && categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>}
      </div>
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
            <ProductCard
              key={p._id}
              product={p}
              showSold={true}
            />
          ))}
        </Slider>
      ) : (
        <p className="warning-message">محصولی یافت نشد!</p>
      )}
      {(isOnline && products.length > 0) && <div className="column_item">
        <Link
          to="/shop"
          onClick={() =>
            dispatch(
              searchByUserFilter({
                level: 2,
                order: "sold",
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

export default Section7;
