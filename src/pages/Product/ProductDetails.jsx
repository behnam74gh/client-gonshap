import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Slider from "react-slick";
import { BsBookmarkFill, BsBookmark,BsShare } from "react-icons/bs";
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
import { db } from "../../util/indexedDB";
import { UPDATE_ALL_BRANDS } from "../../redux/Types/shopProductsTypes";
import { CLEAR_SUPPLIER_PRODUCTS } from "../../redux/Types/supplierProductsTypes";
import { VscLoading } from "react-icons/vsc";

const ProductDetails = ({
  product,
  setStarHandler,
  setStarRatingHandler,
  ratingLoading,
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
    supplierStore,
  } = product;

  const dispatch = useDispatch();
  const { userSignin, ratingModal, cart, favorites,isOnline } = useSelector((state) => ({
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
    if (userInfo?.userId?.length > 0) {
      dispatch({ type: OPEN_STAR_RATING_MODAL });
    } else {
      if(window.confirm("ابتدا باید وارد حساب کاربری خود شوید")){
        history.push({
          pathname: "/signin",
          state: {
            from: `/product/details/${id}`,
          },
        });
      }
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
      if(window.confirm("رفتن به سبد خرید")){
        history.push("/cart");
      }
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

    localStorage.setItem("gonshapPageNumber", JSON.stringify(1));
    db.brands.toArray().then(items => {
      if(items.length > 0){
        const categoryBrands = items.filter((b) => b.backupFor._id === subcategory.parent);
        dispatch({
          type: UPDATE_ALL_BRANDS,
          payload: {
            brands: categoryBrands
          }
        })
      }
    })
  };

  const goToStoreHandler = () => {
    dispatch({type: CLEAR_SUPPLIER_PRODUCTS});
    localStorage.removeItem("gonshapSupplierActiveSub");
    localStorage.removeItem("gonshapSupplierPageNumber");
  }

  const copyUrlToClipBoardHandler = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.info("آدرس محصول کپی شد")
  }

  return (
    <div className="product_details_wrapper">
      <div className="product_images">
        <Slider {...settings}>
          {photos.length > 0 &&
            photos.map((p) => (
              <img
                key={p}
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${p}`}
                alt={title}
                className="carousel_img"
                loading="lazy"
              />
            ))}
        </Slider>
      </div>
      <div className="product_info">
        <div className="product_header_info">
          <h1 className="my-1">{title}</h1>
          <div className="rating_compare_wrapper">
            {ratings && ratings.length > 0 ? (
              <div className="product_rating_wrapper_info">
                {ShowRatingAverage(product)}
              </div>
            ) : (
              <p className="font-sm">امتیازی داده نشده است</p>
            )}
            <div className="d-flex-center-center" style={{gap: "8px"}}>
              <span onClick={copyUrlToClipBoardHandler} className="tooltip" style={{display: "flex"}}>
                <span className="tooltip_text">کپی آدرس محصول</span>
                <BsShare className="text-purple" />
              </span>

              {isOnline &&<Link to={`/compares/${_id}`} className="compare_icon tooltip">
                <span className="tooltip_text">مقایسه</span>
                  <IoIosGitCompare />
              </Link>}
            </div>
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
                starDimension={windoInnerWidth < 450 ? "30px" : "50px"}
                starSpacing={windoInnerWidth < 450 ? "2px" : "5px"}
              />
            </div>
            <div className="rating_modal_btn_wrapper">
              <button
                onClick={setStarRatingHandler}
                className="modal_btn bg-purple"
              >
                {ratingLoading ? <VscLoading className="loader" fontSize={window.innerWidth < 450 ? 14 : 20} /> : "ثبت"}
              </button>
            </div>
          </div>
        </Modal>

        <hr className="my-1" />
        <div className="product_info_wrapper">
          <div className="info_wrapper">
            <span className="question_info">قیمت در بازار : </span>
            <strong className="answer_info text-silver">
              <del className="mx-1">{price.toLocaleString("fa-IR")}</del>
              تومان
            </strong>
          </div>
          <div className="info_wrapper">
            <span className="question_info">با تخفیف :</span>
            <strong className="answer_info">
              <span className="mx-1">{discount}</span>%
            </strong>
          </div>
          <div className="info_wrapper text-purple">
            <strong className="question_info">قیمت فروش در بازارچک : </strong>
            <strong className="answer_info">
              <strong className="mx-1">
                {finallyPrice.toLocaleString("fa-IR")}
              </strong>
              تومان
            </strong>
          </div>
          {!sell && (
            <div className="info_wrapper">
              <span className="question_info">وضعیت ارائه : </span>

              <span className="answer_info">
                <span className="compare_item_not_exist">
                  محصول ارائه نمیشود
                </span>
              </span>
            </div>
          )}
          <div className="info_wrapper">
            <span className="question_info">موجودی انبار : </span>
            {countInStock > 0 ? (
              <strong className="answer_info">
                <strong className="mx-1">{countInStock}</strong>{countInStock > 9 ? "عدد" : "عدد باقی مانده"}
              </strong>
            ) : (
              <span className="answer_info">
                <span className="compare_item_not_exist">ناموجود</span>
              </span>
            )}
          </div>
          <div className="info_wrapper">
            <span className="question_info">برند محصول : </span>
            <span className="answer_info">
              <strong className="mx-1">{brand.brandName}</strong>
            </span>
          </div>
          <div className="info_wrapper">
            <span className="question_info">تعداد فروش : </span>
            <strong className="answer_info">
              <strong className="mx-1">{sold}</strong>عدد
            </strong>
          </div>
          <div className="info_wrapper colors_wrapper">
            <span className="question_info">رنگ ها : </span>
            <div className="answer_info">
              {colors.length > 0 &&
                colors.map((c) => (
                  <span
                    key={c._id}
                    style={{ background: `#${c.colorHex}` }}
                    className="tooltip"
                  >
                    <span className="tooltip_text">{c.colorName}</span>
                  </span>
                ))}
            </div>
          </div>
          {supplierStore && <div className="info_wrapper">
            <span className="question_info">محصول را فروشگاهِ : </span>
            <Link
              to={`/supplier/introduce/${supplierStore.id}`}
              onClick={goToStoreHandler}
              className="answer_info text-blue"
              style={{textDecoration: "underline"}}
            >
              {supplierStore.info}
            </Link>
          </div>}
          <div className="info_wrapper_Attr">
            <strong className="my-1">ویژگی های محصول: </strong>
            <ul className="attr_wrapper">
              {attr1?.length > 0 && <li className="font-sm">{attr1}</li>}
              {attr2?.length > 0 && <li className="font-sm">{attr2}</li>}
              {attr3?.length > 0 && <li className="font-sm">{attr3}</li>}
            </ul>
          </div>
          {isOnline && <div className="info_wrapper">
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
          </div>}
          <div className="products_icon_wrapper">
            <div className="cart_btn_wrapper">
              <button
                className={`d-flex-center-center ${!sell && "disabledBtn"}`}
                onClick={addToCartHandler}
                disabled={!sell}
              >
                {inCart ? "حذف از سبد" : "افزودن به سبد"}
                {inCart ? (
                  <MdRemoveShoppingCart className="mx-2 font-md" />
                ) : (
                  <MdShoppingCart className="mx-2 font-md" />
                )}
              </button>
            </div>
            {isOnline && <div className="rating_btn_wrapper">
              <button
                className="d-flex-center-center"
                onClick={ratingModalHandler}
              >
                امتیاز دهی
                <IoIosStar className="mx-2 font-md" />
              </button>
            </div>}
            <div className="favorite_btn_wrapper">
              <button
                className={`d-flex-center-center ${!sell && "disabledBtn"}`}
                onClick={addToFavoritesHandler}
                disabled={!sell}
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
