import React, { useEffect, useState } from 'react';
import axios from "../../util/axios";
import { useSelector } from 'react-redux';
import LoadingSkeletonCard from '../../components/Home/Shared/LoadingSkeletonCard';
import { setCountOfSlidersHandler } from '../../util/customFunctions';
import Slider from 'react-slick';
import ProductCard from '../../components/Home/Shared/ProductCard';
import { useInView } from "react-intersection-observer";
import "../../components/Home/Section3/Section3.css";
import "./Product.css";

const RecentViews = ({productId,numberOfSlides,setNumberOfSlides}) => {
  const [recentViewserror, setRecentViewsError] = useState("");
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentViews, setRecentViews] = useState([]);
  const [isViewed,setIsviewed] = useState(false);

  const { userInfo } = useSelector((state) => state.userSignin);
  const {ref, inView} = useInView({threshold: 0});

  useEffect(() => {
    if (userInfo?.userId?.length > 0 && navigator.onLine && inView && !isViewed) {
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

        setIsviewed(true);
    }

    return () => {
      setIsviewed(false);
      setNumberOfSlides(4);
    }
  }, [productId, userInfo,setNumberOfSlides,inView]);

  
  const setting = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  let showIt = recentViews.length > 0 && navigator.onLine;
  return (
    <div ref={ref} style={{minHeight: showIt ? "150px" : "0"}} className="list_of_products">
        {showIt && <h3 className="column_item">بازدید های اخیر</h3>}
        {recentLoading ? (
            <LoadingSkeletonCard count={numberOfSlides === 1 ? 1 : numberOfSlides}/>
        ) : recentViews?.length > 0 ? (
            <Slider
                {...setting}
                slidesToShow={numberOfSlides}
                className="custom_slider"
            >
            {recentViews.map((p) => <ProductCard key={p._id} product={p} />)}
            </Slider>
        ) : recentViewserror.length > 0 && (
            <p className="warning-message">{recentViewserror}</p>
        )}
        
    </div>
  )
}

export default RecentViews