import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "../../../util/axios";
import LoadingSkeleton from "../../UI/LoadingSkeleton/LoadingSkeleton";
import { db } from "../../../util/indexedDB";
import { useDispatch,useSelector } from "react-redux";
import { PUSH_STORE_ITEM } from "../../../redux/Types/supplierItemTypes";
import { CLEAR_SUPPLIER_PRODUCTS } from "../../../redux/Types/supplierProductsTypes";
import { SAVE_ACTIVE_REGION_SUPPLIERS } from "../../../redux/Types/homeApiTypes";

const SupplierSlider = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [errorText, setErrorText] = useState("");

  const { cachedHomeApis: {suppliers: { suppliersLength,validTime } } } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;

    const getAllSuppliersListHandler = () => {
      axios
      .get('/region-suppliers/all',{signal: ac.signal})
      .then((response) => {
        if (response.data.success && mounted) {
          setLoading(false);
          setErrorText("");
          let activeRegionSuppliers = [];

          if(localStorage.getItem("activeRegion") && localStorage.getItem("activeRegion") !== 'all'){
            activeRegionSuppliers = response.data.allSuppliers.filter(supplier => supplier.region._id === localStorage.getItem("activeRegion")); 
            if(activeRegionSuppliers.length > 0){
              setSuppliers(activeRegionSuppliers);
            }else{
              setSuppliers(response.data.allSuppliers);
            }
          }else{
            setSuppliers(response.data.allSuppliers);
          }
          
          db.supplierList.clear();
          db.supplierList.bulkPut(response.data.allSuppliers);

          dispatch({
            type: SAVE_ACTIVE_REGION_SUPPLIERS,
            payload: {
              suppliersLength: response.data.allSuppliers.length,
              configData: localStorage.getItem("activeRegion") || 'all' 
            }
          })
        }
      })
      .catch((err) => {
        if(mounted){
          setLoading(false);
          db.supplierList.toArray().then(items => {
            setSuppliers(items)
          })
          if (err.response) {
            setErrorText(err.response.data.message);
          }
        }
      });
    }

    if(suppliersLength > 0 && Date.now() < validTime){
      db.supplierList.toArray().then(items => {
        if(items.length > 0){
          let activeRegionSuppliers = [];

          if(localStorage.getItem("activeRegion") && localStorage.getItem("activeRegion") !== 'all'){
            activeRegionSuppliers = items.filter(supplier => supplier.region._id === localStorage.getItem("activeRegion")); 
            if(activeRegionSuppliers.length > 0){
              setSuppliers(activeRegionSuppliers);
            }else{
              setSuppliers(items);
            }
          }else{
            setSuppliers(items);
          }
        }else{
          setLoading(true);
          getAllSuppliersListHandler();
        }
      })
    }else{
      setLoading(true);
      getAllSuppliersListHandler();
    }
    
    return () => {
      ac.abort()
      mounted = false;
    }
  }, []);

  const setting = {
    dots: false,
    infinite: true,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    arrows: true,
    autoplay: true,
    lazyLoad: true,
    fade: true,
  };

  return (
    <div id="supplier_wrapper">
      {loading ? (
        <LoadingSkeleton NumHeight={window.innerWidth > 450 ? 360 : 130} />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <Slider {...setting}>
          {suppliers.length > 0 &&
            suppliers.map((s) => (
              <Link
                key={s._id}
                to={`/supplier/introduce/${s._id}`}
                className="supplier_button"
                onClick={() => {
                  dispatch({type: PUSH_STORE_ITEM,payload: s})
                  localStorage.removeItem("gonshapSupplierActiveSub");
                  localStorage.removeItem("gonshapSupplierPageNumber");
                  dispatch({type: CLEAR_SUPPLIER_PRODUCTS});
                }}
              >
                <img
                  src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${s.photos[0]}`}
                  alt={s.title}
                  className="supplier_img"
                  // loading="lazy"
                />
              </Link>
            ))}
        </Slider>
      )}
    </div>
  );
};

export default SupplierSlider;
