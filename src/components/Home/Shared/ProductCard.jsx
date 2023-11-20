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
import { PUSH_ITEM } from "../../../redux/Types/searchedItemTypes";

const ProductCard = ({ product, showSold, showReviews }) => {
  const [inCart, setInCart] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);

  const {
    title,
    discount,
    price,
    finallyPrice,
    photos,
    ratings,
    _id,
    sold,
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
    dispatch({
      type: PUSH_ITEM,
      payload: product
    })
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
          <h3 className={`${window.innerWidth < 450 && (showReviews || showSold) ? "has_Second_att" : "my-0"}`}>
            {title.length > 22 ? `${title.substring(0,22)}...` : title}
          </h3>
        </Link>

        <div className="product_card_title" style={{textAlign: window.innerWidth < 450 && (showReviews || showSold) && "center"}}>
          {finallyPrice.toLocaleString("fa")}
          <span className="mx-1">تومان</span>
          <del className="deleted_price">{price.toLocaleString("fa-IR")}</del>
        </div>
        <div className="show_ratings_wrapper">
          {ratings && ratings.length > 0 ? (
            ShowRatingAverage(product)
          ) : (
            <p className="no_ratings_yet">امتیازی ثبت نشده</p>
          )}
        </div>
      </div>
      {discount > 10 && (
        <div className="special_discount">
          <div className="discount_shape">
            <span>
              فروش ویژه
            </span>
          </div>
        </div>
      )}
      {showSold && (
        <div className="products_sold_count">
          <span className="font-sm">{sold}</span>
          <span className="f_s_title">فروش</span>
        </div>
      )}
      {showReviews && (
        <div className="products_sold_count">
          <span className="font-sm">{reviewsCount}</span>
          <span className="f_s_title">بازدید</span>
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
      >
        <span style={{fontSize: "14px"}}>
        %{discount}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
