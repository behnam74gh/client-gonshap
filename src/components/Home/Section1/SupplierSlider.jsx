import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "../../../util/axios";
import LoadingSkeleton from "../../UI/LoadingSkeleton/LoadingSkeleton";
import { db } from "../../../util/indexedDB";

const SupplierSlider = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;
    setLoading(true);
    axios
      .get("/all-suppliers",{signal: ac.signal})
      .then((response) => {
        if (response.data.success && mounted) {
          setLoading(false);
          const activeSuppliers = response.data.allSuppliers.filter(s => !s.isBan)
          setSuppliers(activeSuppliers);
          setErrorText("");

          db.supplierList.clear()
          db.supplierList.bulkPut(activeSuppliers)
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
    speed: 1300,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    arrows: true,
    autoplay: true,
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
            suppliers.map((s, i) => (
              <div key={i} className="supplier_img_wrapper">
                <div className="supplier_info_wrapper">
                  <Link
                    to={`/supplier/introduce/${s.slug}`}
                    className="supplier_button"
                  >
                    ورود به فروشگاه
                  </Link>
                </div>
                <img
                  src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${s.photos[0]}`}
                  alt={s.title}
                  className="supplier_img"
                />
              </div>
            ))}
        </Slider>
      )}
    </div>
  );
};

export default SupplierSlider;
