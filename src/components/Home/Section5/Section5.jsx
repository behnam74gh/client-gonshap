import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "../../../util/axios";
import { VscArrowLeft } from "react-icons/vsc";
import Slider from "react-slick";
import ProductCard from "../Shared/ProductCard";
import LoadingSkeletonCard from "../Shared/LoadingSkeletonCard";
import { Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { searchByUserFilter } from "../../../redux/Actions/shopActions";
import {setCountOfSlidersHandler} from '../../../util/customFunctions';
import { useInView } from "react-intersection-observer";
import { CLEAR_SHOP_PRODUCTS } from "../../../redux/Types/shopProductsTypes";
import { POP_RANGE_VALUES } from "../../../redux/Types/rangeInputTypes";
import { SAVE_DISCOUNT_PRODUCTS } from "../../../redux/Types/homeApiTypes";
import "../Section3/Section3.css";

const Section5 = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(4);
  const [isViewed,setIsviewed] = useState(false);

  const { isOnline, cachedHomeApis: { discountProducts: {items,validTime} } } = useSelector((state) => state)
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
      if(items.length > 0 && Date.now() < validTime){
        setLoading(false);
        const produtsLength = items.length;
        setNumberOfSlides(setCountOfSlidersHandler(produtsLength))
        setProducts(items);

        setIsviewed(true);
      }else{
        axios
        .post("/find/products/by-category-and/order", {
          order: "discount",
          activeCategory: null,
        },{signal: ac.signal})
        .then((response) => {
          if (response.data.success && mounted) {
            setLoading(false);
            const { foundedProducts } = response.data;
            const produtsLength = foundedProducts.length;
            setNumberOfSlides(setCountOfSlidersHandler(produtsLength));
            setProducts(foundedProducts);
            setErrorText("");
            dispatch({
              type: SAVE_DISCOUNT_PRODUCTS,
              payload: {
                items: foundedProducts,
                configData: "discount" 
              }
            })
  
            setIsviewed(true);
          }
        })
        .catch((err) => {
          if(mounted){
            setLoading(false)
            setProducts([]);
            if (typeof err.response.data.message === "object") {
              setErrorText(err.response.data.message[0]);
            } else {
              setErrorText(err.response.data.message);
            }
          }
        });
      }
    }

    return () => {
      ac.abort()
      mounted = false;
    }
  }, [inView]);
  
  const showAllHandler = () => {
    dispatch(
      searchByUserFilter({
        level: 3,
        order: "discount",
      })
    )
    dispatch({type: POP_RANGE_VALUES});
    localStorage.setItem("gonshapPageNumber", JSON.stringify(1));
    dispatch({ type: CLEAR_SHOP_PRODUCTS })
  }

  const setting = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  return (
    <section ref={ref} className="list_of_products">
      <h2 className="d-flex-center-center my-1 singleTitle">فروش ویژه</h2>
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : loading ? (
        <LoadingSkeletonCard count={numberOfSlides === 1 ? 1 : numberOfSlides} />
      ) : products && products.length > 0 ? (
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
        <p className="warning-message">محصولی وجود ندارد!</p>
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

export default Section5;
