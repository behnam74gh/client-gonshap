import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Slider from "react-slick";
import { BsBookmarkFill, BsBookmark } from "react-icons/bs";
import { MdLabel, MdRemoveShoppingCart, MdShoppingCart } from "react-icons/md";
import { IoIosStar, IoIosGitCompare } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import StarRating from "react-star-ratings";
import { ShowRatingAverage } from "../../components/Home/Shared/ShowRatingAverage";
import Modal from "../../components/UI/Modal/Modal";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/Actions/cartActions";
import { searchByUserFilter } from "../../redux/Actions/shopActions";
import {
  addToFavorites,
  removeFromFavorites,
} from "../../redux/Actions/favoriteActions";
import {
  CLOSE_STAR_RATING_MODAL,
  OPEN_STAR_RATING_MODAL,
} from "../../redux/Types/ratingModalType";
import "../Admin/CommentsList/CommentsList.css";
import "./ProductDetails.css";

const ProductDetails = ({
  product,
  setStarHandler,
  setStarRatingHandler,
  starValue,
}) => {
  const [windoInnerWidth, setWindowInnerWidth] = useState();
  const [inCart, setInCart] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);

  const {
    _id,
    photos,
    title,
    ratings,
    price,
    sell,
    discount,
    finallyPrice,
    countInStock,
    colors,
    brand,
    subcategory,
    category,
    sold,
    attr1,
    attr2,
    attr3,
  } = product;

  const dispatch = useDispatch();
  const { userSignin, ratingModal, cart, favorites } = useSelector((state) => ({
    ...state,
  }));
  const history = useHistory();
  const { id } = useParams();

  const { userInfo } = userSignin;
  const { cartItems } = cart;
  const { favoriteItems } = favorites;

  useEffect(() => {
    setWindowInnerWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    let inCart;

    if (cartItems.length > 0) {
      inCart = cartItems.find((item) => item.id === id);
    }
    if (inCart) {
      setInCart(true);
    }
  }, [cartItems, id]);

  useEffect(() => {
    let inFavorites;

    if (favoriteItems.length > 0) {
      inFavorites = favoriteItems.find((item) => item === id);
    }
    if (inFavorites) {
      setInFavorites(true);
    }
  }, [favoriteItems, id]);

  const settings = {
    customPaging: function (i) {
      return (
        <a href="!#">
          <img
            src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${photos[i]}`}
            alt={title}
            className="carousel_img_icons"
          />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1,
  };

  const ratingModalHandler = () => {
    if (userInfo && userInfo.refreshToken.length > 0) {
      dispatch({ type: OPEN_STAR_RATING_MODAL });
    } else {
      history.push({
        pathname: "/signin",
        state: {
          from: `/product/details/${id}`,
        },
      });
    }
  };

  const addToCartHandler = () => {
    if (inCart) {
      dispatch(removeFromCart(product._id));
      toast.info("محصول از سبد خرید حذف شد!");
      setInCart(false);
    } else {
      dispatch(addToCart(product._id));
      toast.info("محصول به سبد خرید اضافه شد!");
      history.push("/cart");
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

  const submitSearchKeyword = () => {
    dispatch(
      searchByUserFilter({
        level: 1,
        order: "createdAt",
        subcategory: subcategory._id,
        category: category,
      })
    );
  };

  return (
    <div className="product_details_wrapper">
      <div className="product_images">
        <Slider {...settings}>
          {photos.length > 0 &&
            photos.map((p, i) => (
              <img
                key={i}
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${p}`}
                alt={title}
                className="carousel_img"
              />
            ))}
        </Slider>
      </div>
      <div className="product_info">
        <div className="product_header_info">
          <h1>{title}</h1>
          <div className="rating_compare_wrapper">
            {ratings && ratings.length > 0 ? (
              <div className="product_rating_wrapper_info">
                {ShowRatingAverage(product)}
                <span className="mr-1 font-sm d-flex-center-center">
                  از<span className="mx-1">({ratings.length})</span>امتیاز
                </span>
              </div>
            ) : (
              <p className="font-sm">امتیازی داده نشده است</p>
            )}
            <Link to={`/compares/${_id}`} className="compare_icon tooltip">
              <span className="tooltip_text">مقایسه</span>
              <IoIosGitCompare />
            </Link>
          </div>
        </div>

        <Modal
          open={ratingModal.modalOpen}
          closeHandler={() => dispatch({ type: CLOSE_STAR_RATING_MODAL })}
        >
          <div className="rating_modal_wrapper">
            <FaTimesCircle
              className="close_Rating_modal"
              onClick={() => dispatch({ type: CLOSE_STAR_RATING_MODAL })}
            />
            <div className="rating_stars_wrapper">
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={starValue.star}
                changeRating={setStarHandler}
                isSelectable={true}
                starRatedColor="var(--secondColorPalete)"
                starDimension={windoInnerWidth < 450 ? "15px" : "50px"}
                starSpacing={windoInnerWidth < 450 ? "2px" : "5px"}
              />
            </div>
            <div className="rating_modal_btn_wrapper">
              <button
                onClick={setStarRatingHandler}
                className="modal_btn bg-purple"
              >
                ثبت
              </button>
            </div>
          </div>
        </Modal>

        <hr className="my-1" />
        <div className="product_info_wrapper">
          <div className="info_wrapper">
            <span className="question_info">پایین ترین نرخ قیمت بازار : </span>
            <strong className="answer_info text-silver">
              <del className="mx-1">{price.toLocaleString("fa-IR")}</del>
              تومان
            </strong>
          </div>
          <div className="info_wrapper">
            <span className="question_info">تخفیف :</span>
            <strong className="answer_info text-purple">
              <span className="mx-1">{discount}</span>%
            </strong>
          </div>
          <div className="info_wrapper text-purple">
            <strong className="question_info">قیمت نهاییِ گُنشاپ : </strong>
            <strong className="answer_info">
              <strong className="mx-1">
                {finallyPrice.toLocaleString("fa-IR")}
              </strong>
              تومان
            </strong>
          </div>
          {!sell && (
            <div className="info_wrapper">
              <span className="question_info">وضعیت ارائه محصول : </span>

              <span className="answer_info">
                <span className="compare_item_not_exist">
                  محصول از رده خارج شده است
                </span>
              </span>
            </div>
          )}
          <div className="info_wrapper">
            <span className="question_info">موجودی : </span>
            {countInStock > 0 ? (
              <strong className="answer_info text-purple">
                <strong className="mx-1">{countInStock}</strong>عدد
              </strong>
            ) : (
              <span className="answer_info">
                <span className="compare_item_not_exist">ناموجود</span>
              </span>
            )}
          </div>
          <div className="info_wrapper">
            <span className="question_info">برند : </span>
            <span className="answer_info">
              <strong className="mx-1 text-purple">{brand.brandName}</strong>
            </span>
          </div>
          <div className="info_wrapper">
            <span className="question_info">تعدادِ فروش : </span>
            <strong className="answer_info text-purple">
              <strong className="mx-1">{sold}</strong>عدد
            </strong>
          </div>
          <div className="info_wrapper colors_wrapper">
            <span className="question_info">رنگ ها : </span>
            <div className="answer_info">
              {colors.length > 0 &&
                colors.map((c, i) => (
                  <span
                    key={i}
                    style={{ background: `#${c.colorHex}` }}
                    className="tooltip"
                  >
                    <span className="tooltip_text">{c.colorName}</span>
                  </span>
                ))}
            </div>
          </div>
          <div className="info_wrapper_Attr">
            <strong className="my-1">برترین ویژگی هایِ محصول: </strong>
            <ul className="attr_wrapper">
              <li>{attr1}</li>
              <li>{attr2}</li>
              <li className="font-sm">{attr3}</li>
            </ul>
          </div>
          <div className="info_wrapper">
            <span className="question_info text-purple">
              <MdLabel className="font-md ml-1" />
              برچسب :
            </span>
            <span className="answer_info">
              <Link
                to="/shop"
                onClick={submitSearchKeyword}
                className="mx-1 products_subcategory_btn"
              >
                {subcategory.name}
              </Link>
            </span>
          </div>
          <div className="products_icon_wrapper">
            <div className="cart_btn_wrapper">
              <button
                className="d-flex-center-center"
                onClick={addToCartHandler}
              >
                {inCart ? "حذف از سبد خرید" : "افزودن به سبد خرید"}
                {inCart ? (
                  <MdRemoveShoppingCart className="mx-2 font-md" />
                ) : (
                  <MdShoppingCart className="mx-2 font-md" />
                )}
              </button>
            </div>
            <div className="rating_btn_wrapper">
              <button
                className="d-flex-center-center tooltip"
                onClick={ratingModalHandler}
              >
                {!userInfo && (
                  <span
                    className="tooltip_text"
                    style={{
                      visibility: windoInnerWidth < 450 && "visible",
                      opacity: windoInnerWidth < 450 && "0.8",
                    }}
                  >
                    ورود جهت امتیازدهی
                  </span>
                )}
                امتیاز دهید
                <IoIosStar className="mx-2 font-md" />
              </button>
            </div>
            <div className="favorite_btn_wrapper">
              <button
                className="d-flex-center-center"
                onClick={addToFavoritesHandler}
              >
                علاقه مندی
                {inFavorites ? (
                  <BsBookmarkFill className="mx-2 font-md" />
                ) : (
                  <BsBookmark className="mx-2 font-md" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;