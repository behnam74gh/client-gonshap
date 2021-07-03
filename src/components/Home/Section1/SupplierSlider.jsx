import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "../../../util/axios";
import LoadingSkeleton from "../../UI/LoadingSkeleton/LoadingSkeleton";

const SupplierSlider = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/all-suppliers")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setSuppliers(response.data.allSuppliers);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  const setting = {
    dots: true,
    infinite: true,
    speed: 1300,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    arrows: false,
    autoplay: true,
    fade: true,
  };

  return (
    <div id="supplier_wrapper">
      {loading ? (
        <React.Fragment>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </React.Fragment>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <Slider {...setting}>
          {suppliers.length > 0 &&
            suppliers.map((s, i) => (
              <div key={i} className="supplier_img_wrapper">
                <div className="supplier_info_wrapper">
                  <h6>{s.title}</h6>
                  <Link
                    to={`/supplier/introduce/${s.slug}`}
                    className="supplier_button"
                  >
                    مشاهده
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
