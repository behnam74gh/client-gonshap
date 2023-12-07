import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaStar,
  FaTimesCircle,
} from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import {
  incCountHandler,
  decCountHandler,
  removeFromCart,
  setItemsColors,
} from "../../redux/Actions/cartActions";
import { toast } from "react-toastify";
import defPic from "../../assets/images/def.jpg";
import "./CartItem.css";

const CartItem = ({ product }) => {
  const [currentItem, setCurrentItem] = useState({});
  const [ratingResult, setRatingResult] = useState(0);
  const [activeColors, setActiveColors] = useState([]);

  const { cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const { cartItems } = cart;

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const thisProduct = cartItems.find((item) => item.id === product._id);
      if (thisProduct) {
        setCurrentItem(thisProduct);
      }
      if (
        product.countInStock > 1 &&
        product.countInStock < thisProduct.count
      ) {
        const newCount =
          thisProduct.count - (thisProduct.count - product.countInStock + 1);

        dispatch(incCountHandler(product._id, newCount));
      } else if (product.countInStock < 2 && thisProduct.count > 1) {
        dispatch(incCountHandler(product._id, 1));
      }
    }
  }, [cartItems, product._id, product.countInStock, dispatch]);

  const decCartItemCountHandler = () => {
    if (currentItem.count > 1) {
      dispatch(decCountHandler(product._id));
      let oldActiveColors = activeColors;
      oldActiveColors.splice(
        currentItem.count,
        activeColors.length - currentItem.count
      );
    } else {
      dispatch(removeFromCart(product._id));
      toast.info("محصول از سبد خرید حذف شد");
    }
  };
  const incCartItemCountHandler = () => {
    if (product.countInStock > currentItem.count) {
      dispatch(incCountHandler(product._id));
    } else {
      toast.info("بیشتر از این تعداد ، موجود نمیباشد!");
    }
  };

  useEffect(() => {
    if (product.ratings.length > 0) {
      let ratingsArray = product.ratings;
      let total = [];
      let length = ratingsArray.length;

      ratingsArray.map((r) => total.push(r.star));

      let totalReduced = total.reduce((a, c) => a + c, 0);

      let highest = length * 5;

      let result = (totalReduced * 5) / highest;
      setRatingResult(result.toFixed(2));
    }
  }, [product.ratings]);

  useEffect(() => {
    if (
      currentItem.colors &&
      currentItem.colors.length > 0 &&
      product.colors.length > 0
    ) {
      let oldActiveColors = [];
      currentItem.colors.forEach((item) => {
        const existedColor = product.colors.find((c) => c._id === item);

        if (existedColor) {
          oldActiveColors.push(existedColor._id);
        } else {
          let existingOldColors = currentItem.colors.filter((c) => c !== item);
          dispatch(setItemsColors(product._id, existingOldColors));
        }
      });

      setActiveColors(oldActiveColors);
    }
  }, [currentItem.colors, product, dispatch]);

  const setColorHandler = (e) => {
    if (e === "none") {
      return;
    }
    if (currentItem.count > activeColors.length) {
      setActiveColors([...activeColors, e]);
      dispatch(setItemsColors(product._id, [...activeColors, e]));
    } else {
      return toast.info("به تعداد کالا میتوانید رنگ تعیین کنید!");
    }
  };

  const deleteColorHandler = (id) => {
    let oldColors = activeColors;
    const foundedColorsIndex = oldColors.findIndex((c) => c === id);
    oldColors.splice(foundedColorsIndex, 1);

    setActiveColors(oldColors);
    dispatch(setItemsColors(product._id, oldColors));
  };

  return (
    <div className="cart_item_wrapper">
      <div className="item_img_wrapper">
        <div className="item_rating_wrapper">
          <FaStar
            className={
              ratingResult < 1 ? "text-silver font-md" : "text-orange font-md"
            }
          />
          <span className="font-sm pt-1 mr-1">
            {ratingResult}
            <span className="text-mute mr-1">امتیاز</span>
          </span>
        </div>
        <div className="item_discount_wrapper">
          <span>OFF % {product.discount}</span>
        </div>
        <img
          src={
            !product.photos[0].length
              ? `${defPic}`
              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${product.photos[0]}`
          }
          alt={product.title}
        />
        {product.countInStock < 1 && (
          <div className="out_of_countInStock">
            <p>موجود نیست</p>
          </div>
        )}
      </div>
      <div className="item_info_wrapper">
        <h3 className="my-1">
          <Link to={`/product/details/${product._id}`} className="text-blue">
            {product.title}
          </Link>
        </h3>
        <h6 className="my-0">برند : {product.brand.brandName}</h6>
        {product.supplierStore && <p className="my-0 font-sm text-mute">محصول را فروشگاه : {product.supplierStore.info}</p>}
        {product.countInStock > 0 && <p className="my-0 font-sm text-mute">موجودی : {product.countInStock}</p>}
        {product.attr1?.length > 0 && <p className="my-0 font-sm text-mute">{product.attr1}</p>}
        {product.attr2?.length > 0 &&  <p className="my-0 font-sm text-mute">{product.attr2}</p>}
        {product.attr3?.length > 0 && <p className="my-0 font-sm text-mute">{product.attr3}</p>}
        <span className="cart_item_discount_wrapper">
          تخیف کالا :
          <span className="cart_item_discount">%{product.discount}</span>
        </span>
      </div>
      <div className="item_price_wrapper">
        <div className="cart_item_price_wrapper">
          <span>قیمت کالا در بازار :</span>
          <strong className="cart_item_price_after_discount">
            {product.price.toLocaleString("fa")}
          </strong>
          <span className="font-sm">تومان</span>
        </div>
        <div className="cart_item_price_wrapper">
          <span>{currentItem.count > 1 ? "مجموع تخفیف :" : "مبلغ تخفیف :"}</span>
          <strong className="cart_item_price_after_discount">
            {(
              ((product.price * product.discount) / 100) *
              currentItem.count
            ).toLocaleString("fa")}
          </strong>
          <span className="font-sm">تومان</span>
        </div>

        <div className="cart_item_price_wrapper">
          <span>{currentItem.count > 1 ? "قیمت تعداد کالا :" : "قیمت نهایی :"}</span>
          <strong className="cart_item_price_after_discount">
            {(currentItem.count * product.finallyPrice).toLocaleString("fa")}
          </strong>
          <span className="font-sm">تومان</span>
        </div>
        
        <div className="product_count_btns_wrapper">
          <div className="count_controller_wrapper">
            <span onClick={incCartItemCountHandler}>
              <FaPlus
                className={
                  product.countInStock > currentItem.count
                    ? "text-blue"
                    : "stoped"
                }
              />
            </span>
            <span className="cart_item_count">{currentItem.count}</span>
            <span onClick={decCartItemCountHandler}>
              {currentItem.count > 1 ? (
                <FaMinus className="text-red" />
              ) : (
                <FaTrashAlt className="text-red" />
              )}
            </span>
          </div>
        </div>

      </div>
      <div className="item_color_wrapper">
        <div className="select_color_wrapper">
          <select
            value="none"
            onChange={(e) => setColorHandler(e.target.value)}
          >
            <option value="none">
              {currentItem.count > activeColors.length
                ? `تعداد ${
                    currentItem.count - activeColors.length
                  } رنگ را مشخص کنید`
                : `رنگ ${currentItem.count > 1 ? "های" : ""} کالا مشخص شد${
                    currentItem.count > 1 ? "ند" : ""
                  }`}
            </option>
            {product.colors.length > 0 &&
              product.colors.map((c, i) => (
                <option
                  key={i}
                  style={{
                    color:
                      `#${c.colorHex}` === "#ffffff"
                        ? "#000"
                        : `#${c.colorHex}`,
                  }}
                  value={c._id}
                >
                  {c.colorName}
                </option>
              ))}
          </select>
        </div>
        <div
          className="selected_colors_wrapper"
        >
          {activeColors.length > 0 && (
            activeColors.map((c, i) => {
              const thisColor =
                product.colors.length > 0 &&
                product.colors.find((item) => item._id === c);
              if (thisColor) {
                return (
                  <span
                    key={i}
                    className="active_color_wrapper"
                    style={{
                      backgroundColor: `#${thisColor.colorHex}`,
                      color:
                        `#${thisColor.colorHex}` < "#1f101f"
                          ? "white"
                          : "black",
                    }}
                  >
                    <span>{thisColor.colorName}</span>
                    <span
                      className="d-flex-center-center mr-1"
                      onClick={() => deleteColorHandler(c)}
                    >
                      <FaTimesCircle />
                    </span>
                  </span>
                );
              } else {
                return `به تعداد ${currentItem.count} رنگ انتخاب کنید`;
              }
            })
          )}
          {currentItem.count > activeColors.length ? (
            <span className="d-flex-center-center font-md">
              <HiBadgeCheck className="text-red valid_color" />
            </span>
          ) : (
            <span className="d-flex-center-center font-md">
              <HiBadgeCheck className="text-green valid_color" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
