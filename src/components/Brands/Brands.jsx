import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "../../util/axios";
import { db } from "../../util/indexedDB";
import "./Brands.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(8);

  useEffect(() => {
    if (window.innerWidth < 450) {
      setNumberOfSlides(4);
    } else if (window.innerWidth < 800) {
      setNumberOfSlides(6);
    }

    if (navigator.onLine){
      axios
      .get("/get-all-brands")
      .then((response) => {
        if (response.data.success) {
          setBrands(response.data.brands);
          db.brands.clear()
          db.brands.bulkPut(response.data.brands)
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
    }else{
      db.brands.toArray().then(items => {
        if(items.length > 0){
          setBrands(items)
        }
      })
    }

  }, []);

  const setting = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 1200,
    pauseOnHover: false,
  };

  return (
    <section id="sec15">
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        brands.length > 0 && (
          <Slider {...setting} slidesToShow={numberOfSlides}>
            {brands.map((b, i) => (
              <div key={i} className="carousel_brand_img_wrapper">
                <img
                  src={
                    b.image.length > 0 &&
                    `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${b.image}`
                  }
                  alt={b.brandName}
                  className="carousel_brand_img"
                />
              </div>
            ))}
          </Slider>
        )
      )}
    </section>
  );
};

export default Brands;
