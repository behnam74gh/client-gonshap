import React, { useEffect, useState } from "react";
import LoadingSkeleton from "../../components/UI/LoadingSkeleton/LoadingSkeleton";
import axios from "../../util/axios";
import { Helmet } from "react-helmet-async";
import CompareItem from "./CompareItem";
import Slider from "react-slick";
import "./ComparePage.css";

const ComparePage = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [errorText, setErrorText] = useState("");

  const { id } = match.params;

  useEffect(() => {
    setLoading(true);
    if(navigator.onLine){
      axios.get(`/fetch-products/to-compare/${id}`)
      .then((response) => {
        setLoading(false);
        if (response?.data?.success) {
          const {currentProduct,similarProducts} = response.data;
          setCurrentProduct(currentProduct);
          setSimilarProducts(similarProducts);
  
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
        } else {
          setErrorText(err.response.data.message);
        }
      });
    }else{
      setLoading(false);
      setErrorText("شما به اینترنت دسترسی ندارید")
    }
   
  }, [id]);

  const setting = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    arrows: true,
    autoplay: false,
    lazyLoad: true,
    fade: false,
  };
  
  return (
    <section id="compare_products">
      <Helmet>
        <title>مقایسه محصولات</title>
      </Helmet>
      {currentProduct?._id.length > 0 && (
        <h5 className="my-0">
          مقایسه و بررسی جزئیات{" "}
          <strong className="mx-1 text-blue">
            {currentProduct.subcategory.name}
          </strong>{" "}
          ها با یکدیگر
        </h5>
      )}
      
      {loading ? (
        <LoadingSkeleton />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (currentProduct?._id?.length > 0 && (
          <CompareItem item={currentProduct} comparedId={id} />
        )
      )}
      {navigator.onLine && <p className="my-0 font-sm">محصولات مشابه :</p>}
      {loading ? (
        <React.Fragment>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </React.Fragment>
      ) : similarProducts?.length > 0 ? (
        <Slider {...setting}>
          {similarProducts.map((item) => <CompareItem key={item._id} item={item} />)}
        </Slider>
      ) : navigator.onLine && (
        <p className="w-100 font-sm text-mute">محصول مشابه ای جهت مقایسه ، یافت نشد!</p>
      )}
    </section>
  );
};

export default ComparePage;
