import React, { useCallback, useEffect, useState } from "react";
import axios from "../../util/axios";
import Slider from "react-slick";
import ProductCard from "../../components/Home/Shared/ProductCard";
import LoadingSkeletonCard from "../../components/Home/Shared/LoadingSkeletonCard";
import { useSelector, useDispatch } from "react-redux";
import ProductDetails from "./ProductDetails";
import TabFeature from "./TabFeature";
import Section2 from "../../components/Home/Section2/Section2";
import { toast } from "react-toastify";
import { CLOSE_STAR_RATING_MODAL } from "../../redux/Types/ratingModalType";
import LoadingSkeleton from "../../components/UI/LoadingSkeleton/LoadingSkeleton";
import "../../components/Home/Section3/Section3.css";
import "./Product.css";

const Product = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
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

  const loadCurrentProduct = useCallback(() => {
    const bodyWidth = window.innerWidth;
    if (bodyWidth < 450) {
      setSecondNumberOfSlides(1);
    }
    axios
      .get(`/read/current-product/${productId}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setProduct(response.data.thisProduct);
          const produtsLength = response.data.releatedProducts.length;
          if (bodyWidth > 1060 && produtsLength >= 4) {
            setSecondNumberOfSlides(4);
          } else if (bodyWidth > 1060 && produtsLength < 4) {
            setSecondNumberOfSlides(produtsLength);
          } else if (bodyWidth < 1060 && bodyWidth > 450 && produtsLength > 1) {
            setSecondNumberOfSlides(2);
          } else if (bodyWidth < 450 && produtsLength >= 4) {
          } else if (
            bodyWidth < 1060 &&
            bodyWidth > 450 &&
            produtsLength === 1
          ) {
            setSecondNumberOfSlides(1);
          }
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
    loadCurrentProduct();
  }, [loadCurrentProduct]);

  useEffect(() => {
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
  }, [productId]);

  useEffect(() => {
    if (userInfo && userInfo.userId && userInfo.userId.length > 0) {
      const bodyWidth = window.innerWidth;
      if (bodyWidth < 450) {
        setNumberOfSlides(1);
      }
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
            if (bodyWidth > 1060 && produtsLength >= 4) {
              setNumberOfSlides(4);
            } else if (bodyWidth > 1060 && produtsLength < 4) {
              setNumberOfSlides(produtsLength);
            } else if (
              bodyWidth < 1060 &&
              bodyWidth > 450 &&
              produtsLength > 1
            ) {
              setNumberOfSlides(2);
            } else if (bodyWidth < 450 && produtsLength >= 4) {
            } else if (
              bodyWidth < 1060 &&
              bodyWidth > 450 &&
              produtsLength === 1
            ) {
              setNumberOfSlides(1);
            }
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
          toast.info("از توجه شما متشکریم ،مدیریت گُنشاپ!");
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
      {loading ? (
        <React.Fragment>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </React.Fragment>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        product &&
        product._id.length > 0 && (
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
              commentsError={commentsError}
            />
            <div className="list_of_products">
              {recentViewserror.length > 0 ? (
                <p className="warning-message">{recentViewserror}</p>
              ) : recentLoading ? (
                <LoadingSkeletonCard
                  count={numberOfSlides < 1 ? 1 : numberOfSlides}
                />
              ) : (
                recentViews &&
                recentViews.length > 0 && (
                  <React.Fragment>
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
                  </React.Fragment>
                )
              )}
            </div>
            <Section2 />
            <div className="list_of_products">
              {loading ? (
                <LoadingSkeletonCard
                  count={secondNumberOfSlides < 1 ? 1 : secondNumberOfSlides}
                />
              ) : (
                releatedProducts &&
                releatedProducts.length > 0 && (
                  <React.Fragment>
                    <h3 className="column_item">محصولات مشابه</h3>

                    <Slider
                      {...setting}
                      slidesToShow={secondNumberOfSlides}
                      className="custom_slider"
                    >
                      {releatedProducts.map((p, i) => (
                        <ProductCard key={i} product={p} loading={loading} />
                      ))}
                    </Slider>
                  </React.Fragment>
                )
              )}
            </div>
          </React.Fragment>
        )
      )}
    </section>
  );
};

export default Product;
