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
import { VscLoading } from "react-icons/vsc";
import { db } from "../../util/indexedDB";
import {Helmet} from 'react-helmet-async'
import { deleteSearchConfig } from "../../redux/Actions/shopActions";
import { UNSUBMIT_QUERY } from "../../redux/Types/searchInputTypes";
import {setCountOfSlidersHandler} from '../../util/customFunctions';
import RecentViews from "./RecentViews";
import "../../components/Home/Section3/Section3.css";
import "./Product.css";

const Product = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [commentsError, setCommentsError] = useState("");
  const [releatedProducts, setReleatedProducts] = useState([]);
  const [commentList, setCommentList] = useState([]);
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

      if(!window.location.href.includes('/supplier/introduce')){
        localStorage.removeItem("gonshapSupplierActiveSub");
        localStorage.removeItem("gonshapSupplierPageNumber");
      }
    }
  }, [productId,dispatch]);


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
          toast.info("از توجه شما متشکریم ،مدیریت بازارچک!");
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

  let showIt = releatedProducts.length > 0 && navigator.onLine;
  
  return (
    <section id="product_details">
      <Helmet>
        <title>{product?.title}</title>
        <meta name="description" content={product?.description} />
      </Helmet>
      {loading ? (
       <div className="loader_wrapper">
        <VscLoading className="loader" fontSize={window.innerWidth < 450 ? 20 : 40} />
       </div>
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
            
            <RecentViews numberOfSlides={numberOfSlides} productId={productId} setNumberOfSlides={setNumberOfSlides} />

            <Section6 />
  
            <div style={{minHeight: showIt ? "150px" : "0"}} className="list_of_products">
              {showIt && <h4 className="column_item">محصولات مشابه</h4>}
              {
                loading ? (
                  <LoadingSkeletonCard
                    count={secondNumberOfSlides < 1 ? 1 : secondNumberOfSlides}
                  />
                ) : releatedProducts?.length > 0 ? (
                  <Slider
                    {...setting}
                    slidesToShow={secondNumberOfSlides}
                    className="custom_slider"
                  >
                    {releatedProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </Slider>
                ) : null
              }
            </div>
          </React.Fragment>
        )
      )}
    </section>
  );
};

export default Product;
