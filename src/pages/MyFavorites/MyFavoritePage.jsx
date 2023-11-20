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
import { db } from "../../util/indexedDB";
import { Helmet } from "react-helmet-async";
import {ReactComponent as EmptyFavoriteSvg} from '../../assets/images/empty_favorites.svg'
import "./MyFavoritePage.css";

const MyFavoritePage = () => {
  const [showDeprecatedItems, setShowDeprecatedItems] = useState(false);
  const [oldFavoriteItemsInfo,setOldFavoriteItemsInfo] = useState([])

  const {favorites,isOnline} = useSelector((state) => ({...state}))

  const dispatch = useDispatch();

  const {
    favoriteItems,
    loading,
    errorText,
    favoriteItemsInfo,
    deprecatedFavoriteItems,
  } = favorites;
  
  useEffect(() => {
    if (isOnline && navigator.onLine){
      dispatch(upgradeFavoriteItems());
    }else{
      db.favoriteItems.toArray()
      .then(items => {
        if(items?.length > 0){
          setOldFavoriteItemsInfo(items)
        }
      })
    }
   
  }, [dispatch,isOnline,favoriteItems]);

  useEffect(() => {
    if (deprecatedFavoriteItems && deprecatedFavoriteItems.length > 0) {
      setShowDeprecatedItems(true);
    }
  }, [deprecatedFavoriteItems]);

  const closeDeprecatedItemsHandler = () => setShowDeprecatedItems(false);

  const activeFavoriteItems = favoriteItemsInfo?.length === favoriteItems.length ? favoriteItemsInfo : oldFavoriteItemsInfo?.length === favoriteItems.length ? oldFavoriteItemsInfo : [];
  return (
    <section id="favorites_page">
      <Helmet>
        <title>مورد پسند های من</title>
      </Helmet>
      <h2 className="text-purple">مورد پسندهای من</h2>
      <div className="w-100 d-flex-center-center">
        {favoriteItems?.length < 1 && <EmptyFavoriteSvg style={{maxWidth: "250px"}} />}
      </div>
      {favoriteItems?.length > 0 ?
        <span style={{display: "block",fontSize: "12px"}}>شما تعداد {favoriteItems.length} محصول را پسندیده اید</span> :
        <span style={{display: "block"}} className="warning-message">شما محصولی را پسند نکرده اید</span>
      }
      <div className="my_favorites_wrapper">
        {loading ? (
          <LoadingSkeletonCard count={favoriteItems.length} />
        ) : errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : (
          activeFavoriteItems?.length > 0 &&
          activeFavoriteItems.map((item) => (
            <ProductCard key={item._id} product={item} />
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
              deprecatedFavoriteItems.map((product) => (
                <div key={product._id} className="deprecated_item">
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
