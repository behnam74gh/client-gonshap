import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { IoIosGitCompare } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { MdShoppingCart } from "react-icons/md";
import defPic from "../../../assets/images/def.jpg";
import { ShowRatingAverage } from "./ShowRatingAverage";
import { addToCart, removeFromCart } from "../../../redux/Actions/cartActions";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../../redux/Actions/favoriteActions";
import { toast } from "react-toastify";
import { db } from "../../../util/indexedDB";
import "./ProductCard.css";

const ProductCard = ({ product, showSold, showReviews,showDiscount }) => {
  const [inCart, setInCart] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);

  const {
    title,
    discount,
    finallyPrice,
    photos,
    ratings,
    _id,
    sold,
    countInStock,
    reviewsCount,
  } = product;

  const dispatch = useDispatch();
  const { cart, favorites } = useSelector((state) => ({
    ...state,
  }));

  const { cartItems } = cart;
  const { favoriteItems } = favorites;

  useEffect(() => {
    let inCart;

    if (cartItems && cartItems.length > 0) {
      inCart = cartItems.find((item) => item.id === _id);
      if (inCart) {
        setInCart(true);
      }
    }

    return () => {
      if (inCart) {
        setInCart(false);
      }
    };
  }, [cartItems, _id]);

  useEffect(() => {
    let inFavorites;

    if (favoriteItems && favoriteItems.length > 0) {
      inFavorites = favoriteItems.find((item) => item === _id);
      if (inFavorites) {
        setInFavorites(true);
      }
    }

    return () => {
      if (inFavorites) {
        setInFavorites(false);
      }
    };
  }, [favoriteItems, _id]);

  const addToCartHandler = () => {
    if (inCart) {
      dispatch(removeFromCart(product._id));
      toast.info("محصول از سبد خرید حذف شد!");
      setInCart(false);
    } else {
      dispatch(addToCart(product._id));
      toast.info("محصول به سبد خرید اضافه شد!");
      setInCart(true);
    }
  };

  const addToFavoritesHandler = () => {
    if (inFavorites) {
      dispatch(removeFromFavorites(product._id));
      toast.info("محصول از فهرست علاقه مندی ها حذف شد!");
      setInFavorites(false);
    } else {
      dispatch(addToFavorites(product._id));
      toast.info("محصول به فهرست علاقه مندی ها اضافه شد!");
    }
  };

  const cacheProductDetailsHandler = () => {
     db.productDetailes.clear()
     db.productDetailes.add(product)
  }

  return (
    <div className="product_wrapper">
      <Link to={`/product/details/${_id}`} onClick={cacheProductDetailsHandler} className="product_img_box">
        <figure className="figure_img">
          <img
            src={
              photos.length > 0
                ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${photos[0]}`
                : `${defPic}`
            }
            alt={title}
          />
        </figure>
      </Link>
      <div className="product_info_box">
        <Link to={`/product/details/${_id}`} onClick={cacheProductDetailsHandler}>
          <h3 className={`${(showReviews || showSold || showDiscount) ? "has_Second_att" : "my-0"}`}>
            {title.length > 22 ? `${title.substring(0,22)}...` : title}
          </h3>
        </Link>

        <div className="font-sm mt-2" style={{textAlign: (showReviews || showSold || showDiscount) && "center"}}>
          {finallyPrice.toLocaleString("fa")}
          <span className="mx-1">تومان</span>
        </div>
        <div className="show_ratings_wrapper tooltip">
          {ratings.length > 0 && (
            <span className="tooltip_text">
              از <strong className="mx-1">( {ratings.length} )</strong>امتیاز
            </span>
          )}
          {ratings && ratings.length > 0 ? (
            ShowRatingAverage(product)
          ) : (
            <p className="no_ratings_yet">امتیازی داده نشده</p>
          )}
        </div>
      </div>
      {!showDiscount && discount > 10 && (
        <div className="special_discount">
          <div className="discount_shape">
            <span>
              <strong className="ml-1">%{discount}</strong> off
            </span>
          </div>
        </div>
      )}
      {showSold && (
        <div className="products_sold_count">
          <span className="font-sm">{sold}</span>
          <span>فروش</span>
        </div>
      )}
      {showReviews && (
        <div className="products_sold_count">
          <span className="font-sm">{reviewsCount}</span>
          <span>بازدید</span>
        </div>
      )}
      {showDiscount && (
        <div className="products_sold_count tooltip">
          <span className="tooltip_text">off</span>
          <i className="text-purple">%{discount}</i>
        </div>
      )}
      <div className="products_icons_wrapper">
        <span style={{cursor: "pointer"}} onClick={addToCartHandler}>
          {!inCart ? <IoCartOutline size={18} /> : <MdShoppingCart size={18} />}
        </span>
        <Link to={`/compares/${_id}`} className="text-purple">
          <IoIosGitCompare size={18} />
        </Link>
        <span style={{cursor: "pointer"}} onClick={addToFavoritesHandler}>
          {inFavorites ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
        </span>
      </div>
      <div
        className="products_count"
        style={{ background: !countInStock > 0 && "red" }}
      >
        <span className="font-sm">
          {countInStock > 0 ? countInStock : "ناموجود"}
        </span>
        {countInStock > 0 && <span>موجود</span>}
      </div>
    </div>
  );
};

export default ProductCard;
