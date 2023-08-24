import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import { VscArrowLeft } from "react-icons/vsc";
import Slider from "react-slick";
import ProductCard from "../Shared/ProductCard";
import LoadingSkeletonCard from "../Shared/LoadingSkeletonCard";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchByUserFilter } from "../../../redux/Actions/shopActions";
import "../Section3/Section3.css";

const Section7 = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [categoryErrorText, setCategoryErrorText] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(4);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("/get-all-categories")
      .then((response) => {
        if (response.data.success) {
          const { categories } = response.data;
          if (categories && categories.length > 0) {
            const activeCategories = categories.filter(c => c.storeProvider !== null)
            setCategories(activeCategories);
            setActiveCategory(activeCategories[0]._id);
            setCategoryErrorText("");
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          setCategoryErrorText(err.response.data.message);
        }
      });
  }, []);

  useEffect(() => {
    if (!activeCategory.length > 0) {
      return;
    }
    const bodyWidth = window.innerWidth;
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
        }
      })
      .catch((err) => {
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
          setProducts([]);
        } else {
          setErrorText(err.response.data.message);
        }
      });
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

      <div className="column_item">
        <h1>پرفروشترین محصولات :</h1>
        {categoryErrorText.length > 0 && (
          <p className="warning-message">{categoryErrorText}</p>
        )}
        <select className="categories_wrapper_select" onChange={(e) => changeCategoryHandler(e.target.value)}>
          {categories?.length > 0 && categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
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
              showSold={true}
            />
          ))}
        </Slider>
      ) : (
        <p className="warning-message">محصولی وجود ندارد!</p>
      )}
      {products.length > 0 && <div className="column_item">
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
