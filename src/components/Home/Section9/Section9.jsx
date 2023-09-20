import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import { VscArrowLeft } from "react-icons/vsc";
import Slider from "react-slick";
import ProductCard from "../Shared/ProductCard";
import LoadingSkeletonCard from "../Shared/LoadingSkeletonCard";
import { Link } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { searchByUserFilter } from "../../../redux/Actions/shopActions";
import { db } from "../../../util/indexedDB";
import "../Section3/Section3.css";

const Section9 = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(4);

  const isOnline = useSelector((state) => state.isOnline)
  const dispatch = useDispatch();

  useEffect(() => {
    const bodyWidth = window.innerWidth;
    setLoading(true);
    axios
      .post("/find/products/by-category-and/order", {
        order: "reviewsCount",
        activeCategory: null,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          const { foundedProducts } = response.data;
          const produtsLength = foundedProducts.length;
          if (bodyWidth > 1350 && produtsLength >= 4) {
            setNumberOfSlides(4);
          } else if (bodyWidth > 1350 && produtsLength < 4) {
            setNumberOfSlides(produtsLength);
          } else if (bodyWidth < 1350 && bodyWidth > 910 && produtsLength > 1) {
            setNumberOfSlides(3);
          } else if (
            bodyWidth < 1350 &&
            bodyWidth > 910 &&
            produtsLength === 1
          ) {
            setNumberOfSlides(1);
          }else if (bodyWidth < 910 && bodyWidth > 450 && produtsLength > 1) {
            setNumberOfSlides(2);
          } else if (
            bodyWidth < 910 &&
            bodyWidth > 450 &&
            produtsLength === 1
          ) {
            setNumberOfSlides(1);
          }else if (bodyWidth < 450 && bodyWidth > 320 && produtsLength > 1) {
            setNumberOfSlides(2)
          }else{
            setNumberOfSlides(1)
          }
          setProducts(foundedProducts);
          setErrorText("");

          db.reviewedProducts.clear()
          db.reviewedProducts.bulkPut(foundedProducts)

        }
      })
      .catch((err) => {
        setLoading(false)
        db.reviewedProducts.toArray()
        .then(items => {
          if(items?.length > 0){
            setProducts(items)
          }else{
            if (typeof err.response.data.message === "object") {
              setErrorText(err.response.data.message[0]);
              setProducts([]);
              } else {
                setErrorText(err.response.data.message);
              }
          }
        })
      });
  }, []);

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
    <section className="list_of_products">
      <h1 className="d-flex-center-center my-1 singleTitle">پربازدیدترین محصولات</h1>
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : loading ? (
        <LoadingSkeletonCard count={numberOfSlides < 1 ? 1 : numberOfSlides} />
      ) : products && products.length > 0 ? (
        <Slider
          {...setting}
          slidesToShow={numberOfSlides}
          className="custom_slider"
        >
          {products.map((p, i) => (
            <ProductCard
              key={i}
              product={p}
              loading={loading}
              showReviews={true}
            />
          ))}
        </Slider>
      ) : (
        <p className="warning-message">محصولی وجود ندارد!</p>
      )}
      {(isOnline && products.length > 0) && <div className="column_item">
        <Link
          to={`/shop?all-discounts`}
          onClick={() =>
            dispatch(
              searchByUserFilter({
                level: 3,
                order: "reviewsCount",
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

export default Section9;
