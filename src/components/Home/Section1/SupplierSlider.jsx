import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "../../../util/axios";
import LoadingSkeleton from "../../UI/LoadingSkeleton/LoadingSkeleton";
import { db } from "../../../util/indexedDB";
import { useDispatch } from "react-redux";
import { PUSH_STORE_ITEM } from "../../../redux/Types/supplierItemTypes";

const SupplierSlider = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [errorText, setErrorText] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;
    setLoading(true);
    const currentRegion = localStorage.getItem("activeRegion") || 'all';
    axios
      .get(`/region-suppliers/${currentRegion}`,{signal: ac.signal})
      .then((response) => {
        if (response.data.success && mounted) {
          setLoading(false);
          setSuppliers(response.data.allSuppliers);
          setErrorText("");

          db.supplierList.clear()
          db.supplierList.bulkPut(response.data.allSuppliers)
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

      return () => {
        ac.abort()
        mounted = false;
      }
  }, []);

  const setting = {
    dots: false,
    infinite: true,
    speed: 500,
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
        <LoadingSkeleton NumHeight={window.innerWidth > 450 && 320} />
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
                onClick={() => dispatch({type: PUSH_STORE_ITEM,payload: s})}
              >
                <img
                  src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${s.photos[0]}`}
                  alt={s.title}
                  className="supplier_img"
                />
              </Link>
            ))}
        </Slider>
      )}
    </div>
  );
};

export default SupplierSlider;
