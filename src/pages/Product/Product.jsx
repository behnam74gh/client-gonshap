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
import {setCountOfSlidersHandler} from '../../util/customFunctions';
import RecentViews from "./RecentViews";
import { POP_ITEM } from "../../redux/Types/searchedItemTypes";
import { POP_STORE_ITEM } from "../../redux/Types/supplierItemTypes";
import "../../components/Home/Section3/Section3.css";
import "./Product.css";

const Product = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [releatedLoading, setReleatedLoading] = useState(false);
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
  const { userSignin : {userInfo},searchedItem: {productItem} } = useSelector((state) => state);
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

  const loadReleatedProducts = useCallback(() => {
    if(!product?.subcategory?._id){
      return;
    }
    axios.get(`/current-product/releateds/${productId}`,{ params:{ sub: product?.subcategory?._id }}).then((response) => {
      setReleatedLoading(false);
      if (response.data.success) {
        const produtsLength = response.data.releatedProducts.length;
        setSecondNumberOfSlides(setCountOfSlidersHandler(produtsLength))
        setReleatedProducts(response.data.releatedProducts);
      }
    })
    .catch((err) => {
      setReleatedLoading(false);
      if (err.response) {
        return;
      }
    });
  }, [productId,product])

  useEffect(() => {
    setLoading(true);
    if(navigator.onLine){
      if(productItem && productItem !== null){
        setProduct(productItem);
        setLoading(false);
      }else{
        loadCurrentProduct();
      }
    }else{
      setLoading(false)
      db.productDetailes.toArray().then(items => {
        setProduct(items[0])
      })
    }
  }, [loadCurrentProduct,productId,productItem]);

  useEffect(() => {
    if(product && productId === product?._id){
      setReleatedLoading(true)
      loadReleatedProducts();
    }else{
      return;
    }
  }, [product,loadReleatedProducts,productId])

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
      if(!window.location.href.includes('/product/details/')){
        dispatch({ type: POP_ITEM })
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
    setRatingLoading(true);
    axios
      .put(`/product/ratings-star/${productId}`, {
        star: starValue.star,
      })
      .then((response) => {
        setRatingLoading(false);
        if (response.data.success) {
          dispatch({ type: CLOSE_STAR_RATING_MODAL });
          toast.info("از توجه شما متشکریم ،مدیریت بازارچک!");
          loadCurrentProduct();
        }
      })
      .catch((err) => {
        setRatingLoading(false);
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
              ratingLoading={ratingLoading}
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
            <div style={{minHeight: showIt ? "150px" : "0",marginBottom: "10px"}} className="list_of_products">
              {showIt && <h4 className="w-100 text-center mt-0">محصولات مشابه</h4>}
              {
                releatedLoading ? (
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
            <Section6 />
            <RecentViews numberOfSlides={numberOfSlides} productId={productId} setNumberOfSlides={setNumberOfSlides} />
          </React.Fragment>
        )
      )}
    </section>
  );
};

export default Product;
