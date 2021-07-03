import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { upgradeFavoriteItems } from "../../redux/Actions/favoriteActions";
import { FaTimes } from "react-icons/fa";
import ProductCard from "../../components/Home/Shared/ProductCard";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import defPic from "../../assets/images/def.jpg";
import LoadingSkeletonCard from "../../components/Home/Shared/LoadingSkeletonCard";
import Section11 from "../../components/Home/Section11/Section11";
import Section5 from "../../components/Home/Section5/Section5";
import "./MyFavoritePage.css";

const MyFavoritePage = () => {
  const [showDeprecatedItems, setShowDeprecatedItems] = useState(false);

  const {
    favoriteItems,
    loading,
    errorText,
    favoriteItemsInfo,
    deprecatedFavoriteItems,
  } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(upgradeFavoriteItems());
  }, [dispatch]);

  useEffect(() => {
    if (deprecatedFavoriteItems && deprecatedFavoriteItems.length > 0) {
      setShowDeprecatedItems(true);
    }
  }, [deprecatedFavoriteItems]);

  const closeDeprecatedItemsHandler = () => setShowDeprecatedItems(false);

  return (
    <section id="favorites_page">
      <h2 className="text-purple">صفحه علاقه مندی های من</h2>

      <div className="my_favorites_wrapper">
        {loading ? (
          <LoadingSkeletonCard count={favoriteItems.length} />
        ) : errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : (
          favoriteItemsInfo &&
          favoriteItemsInfo.length > 0 &&
          favoriteItemsInfo.map((item, i) => (
            <ProductCard key={i} product={item} loading={loading} />
          ))
        )}
      </div>
      <Section11 />
      <Section5 />
      <Backdrop
        show={showDeprecatedItems}
        onClick={closeDeprecatedItemsHandler}
      />
      {showDeprecatedItems && deprecatedFavoriteItems.length > 0 && (
        <div className="deprecated_items_wrapper">
          <div className="deprecated_second_wrapper">
            <div className="deprecated_item">
              <h6 className="deprecated_header">
                این محصولات دیگر ارائه نمیشوند :
              </h6>
            </div>
            {deprecatedFavoriteItems &&
              deprecatedFavoriteItems.length > 0 &&
              deprecatedFavoriteItems.map((product, i) => (
                <div key={i} className="deprecated_item">
                  <p className="deprecated_item_title">{product.title}</p>

                  <img
                    src={
                      !product.photos[0].length
                        ? `${defPic}`
                        : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${product.photos[0]}`
                    }
                    className="deprecated_img"
                    alt={product.title}
                  />
                </div>
              ))}
            <span
              className="deprecated_close"
              onClick={closeDeprecatedItemsHandler}
            >
              <FaTimes />
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyFavoritePage;
