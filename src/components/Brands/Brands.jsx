import React, { useEffect, useLayoutEffect, useState } from "react";
import Slider from "react-slick";
import axios from "../../util/axios";
import { db } from "../../util/indexedDB";
import "./Brands.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(8);

  useLayoutEffect(() => {
     if (window.innerWidth < 450) {
      setNumberOfSlides(4);
    } else if (window.innerWidth < 720) {
      setNumberOfSlides(5);
    }
  }, [])

  useEffect(() => {
    const ac = new AbortController();
   if (navigator.onLine){
      axios
      .get("/get-all-brands",{signal: ac.signal})
      .then((response) => {
        if (response.data.success) {
          const {brands} = response.data
          setBrands(brands);
          db.brands.clear()
          db.brands.bulkPut(response.data.brands)

          if(window.innerWidth > 720 && brands.length < 8){
            setNumberOfSlides(Number(brands.length) - 1)
          }else if (window.innerWidth < 720 && brands.length < 6){
            setNumberOfSlides(Number(brands.length) - 1)
          }else if (window.innerWidth < 450 && brands.length < 4){
            setNumberOfSlides(Number(brands.length) - 1)
          }
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

    return () => {
      ac.abort()
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
        brands?.length > 0 && (
          <Slider {...setting} slidesToShow={numberOfSlides}>
            {brands.map((b) => (
              <div key={b._id} className="carousel_brand_img_wrapper">
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
