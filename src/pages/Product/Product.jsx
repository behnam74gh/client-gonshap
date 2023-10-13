import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import axios from "../../util/axios";
import Slider from "react-slick";
import ProductCard from "../../components/Home/Shared/ProductCard";
import LoadingSkeletonCard from "../../components/Home/Shared/LoadingSkeletonCard";
import { useSelector, useDispatch } from "react-redux";
import ProductDetails from "./ProductDetails";
import TabFeature from "./TabFeature";
import Section6 from "../../components/Home/Section6/Section6";
import { toast } from "react-toastify";
import { CLOSE_STAR_RATING_MODAL } from "../../redux/Types/ratingModalType";
import LoadingSkeleton from "../../components/UI/LoadingSkeleton/LoadingSkeleton";
import { db } from "../../util/indexedDB";
import {Helmet} from 'react-helmet'
import { deleteSearchConfig } from "../../redux/Actions/shopActions";
import { UNSUBMIT_QUERY } from "../../redux/Types/searchInputTypes";
import {setCountOfSlidersHandler} from '../../util/customFunctions';
import "../../components/Home/Section3/Section3.css";
import "./Product.css";

const Product = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [recentViewserror, setRecentViewsError] = useState("");
  const [commentsError, setCommentsError] = useState("");
  const [releatedProducts, setReleatedProducts] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentViews, setRecentViews] = useState([]);
  const [numberOfSlides, setNumberOfSlides] = useState(4);
  const [secondNumberOfSlides, setSecondNumberOfSlides] = useState(4);
  const [starValue, setStarValue] = useState({
    star: 0,
    productId: "",
  });

  const productId = match.params.id;
  const { userInfo } = useSelector((state) => state.userSignin);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if(window.innerWidth < 315){
      setNumberOfSlides(1)
      setSecondNumberOfSlides(1)
    }else if (window.innerWidth < 720) {
      setNumberOfSlides(2)
      setSecondNumberOfSlides(2)
    }else if (window.innerWidth < 1000) {
      setNumberOfSlides(3)
      setSecondNumberOfSlides(3)
    }else {
      setNumberOfSlides(4)
      setSecondNumberOfSlides(4)
    }
  } , [])

  const loadCurrentProduct = useCallback(() => {  
    axios
      .get(`/read/current-product/${productId}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setProduct(response.data.thisProduct);
          const produtsLength = response.data.releatedProducts.length;
          setSecondNumberOfSlides(setCountOfSlidersHandler(produtsLength))
          setReleatedProducts(response.data.releatedProducts);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, [productId]);

  useEffect(() => {
    setLoading(true);
    if(navigator.onLine){
      loadCurrentProduct();
    }else{
      setLoading(false)
      db.productDetailes.toArray().then(items => {
        setProduct(items[0])
      })
    }
  }, [loadCurrentProduct,productId]);


  useEffect(() => {
    if(navigator.onLine){
      axios
      .post("/get-all-comments/current-product", { productId })
      .then((res) => {
        if (res.data.success) {
          setCommentList(res.data.allComments);
          setCommentsError("");
        }
      })
      .catch((err) => {
        if (typeof err.response.data.message === "object") {
          setCommentsError(err.response.data.message[0]);
        } else {
          setCommentsError(err.response.data.message);
        }
      });
    }

      return () => {
        setStarValue({
          star: 0,
          productId: "",
        })
        if(!window.location.href.includes('/shop')){
          dispatch(deleteSearchConfig());
          dispatch({ type: UNSUBMIT_QUERY });
        }
      }
  }, [productId,dispatch]);

  useEffect(() => {
    if (userInfo?.userId?.length > 0 && navigator.onLine) {
      setRecentLoading(true);
      axios
        .put(`/current-user/recent-views/upgrade/${userInfo.userId}`, {
          productId,
        })
        .then((response) => {
          setRecentLoading(false);
          const { success, recentViewsProducts } = response.data;
          const activeRecentViewsProducts = recentViewsProducts.filter(
            (p) => p._id !== productId
          );
          if (success) {
            const produtsLength = activeRecentViewsProducts.length;
            setNumberOfSlides(setCountOfSlidersHandler(produtsLength))
            setRecentViews(activeRecentViewsProducts);
            setRecentViewsError("");
          }
        })
        .catch((err) => {
          setRecentLoading(false);
          if (typeof err.response.data.message === "object") {
            setRecentViewsError(err.response.data.message[0]);
          } else {
            setRecentViewsError(err.response.data.message);
          }
        });
    }
  }, [productId, userInfo]);

  const setting = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  const setStarHandler = (newRating, name) => {
    setStarValue({ star: newRating, productId: name });
  };

  const setStarRatingHandler = () => {
    axios
      .put(`/product/ratings-star/${productId}`, {
        star: starValue.star,
      })
      .then((response) => {
        if (response.data.success) {
          dispatch({ type: CLOSE_STAR_RATING_MODAL });
          toast.info("از توجه شما متشکریم ،مدیریت بازارک!");
          loadCurrentProduct();
        }
      })
      .catch((err) => {
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    if (product && product.ratings && userInfo && userInfo.userId) {
      const existRatingObject = product.ratings.find(
        (r) => r.postedBy.toString() === userInfo.userId.toString()
      );

      existRatingObject && setStarValue({ star: existRatingObject.star });
    }
  }, [product, userInfo]);
  
  return (
    <section id="product_details">
      <Helmet>
        <title>{product?.title}</title>
        <meta name="description" content={product?.description} />
      </Helmet>
      {loading ? (
        <React.Fragment>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </React.Fragment>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (product?._id?.length > 0 && (
          <React.Fragment>
            <ProductDetails
              product={product}
              setStarRatingHandler={setStarRatingHandler}
              starValue={starValue}
              setStarHandler={setStarHandler}
            />
            <TabFeature
              descritionContent={product.description}
              commentList={commentList}
              productId={productId}
              productCategory={product.category}
              commentsError={commentsError}
              productDetails={product.details}
            />
            
            {recentViewserror.length > 0 ? (
              <p className="warning-message">{recentViewserror}</p>
            ) : recentLoading ? (
              <LoadingSkeletonCard
                count={numberOfSlides === 1 ? 1 : numberOfSlides}
              />
            ) : (recentViews?.length > 0 && (
              <div className="list_of_products">
                  <h3 className="column_item">بازدید های اخیر</h3>

                  <Slider
                    {...setting}
                    slidesToShow={numberOfSlides}
                    className="custom_slider"
                  >
                    {recentViews.map((p, i) => (
                      <ProductCard
                        key={i}
                        product={p}
                        loading={recentLoading}
                      />
                    ))}
                  </Slider>
                </div>
              )
            )}
          
            <Section6 />
            
            {loading ? (
              <LoadingSkeletonCard
                count={secondNumberOfSlides < 1 ? 1 : secondNumberOfSlides}
              />
            ) : (
              releatedProducts?.length > 0 && (
                <div className="list_of_products">
                  <h4 className="column_item">محصولات مشابه</h4>

                  <Slider
                    {...setting}
                    slidesToShow={secondNumberOfSlides}
                    className="custom_slider"
                  >
                    {releatedProducts.map((p, i) => (
                      <ProductCard key={i} product={p} loading={loading} />
                    ))}
                  </Slider>
                </div>
              )
            )}
          </React.Fragment>
        )
      )}
    </section>
  );
};

export default Product;
