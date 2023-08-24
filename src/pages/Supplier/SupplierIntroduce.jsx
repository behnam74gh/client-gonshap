import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { VscLoading } from "react-icons/vsc";
import axios from "../../util/axios";
import SupplierProducts from "./SupplierProducts";
import Section13 from "../../components/Home/Section13/Section13";
import defPic from "../../assets/images/pro-8.png";
import "./SupplierIntroduce.css";

const SupplierIntroduce = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState();
  const [errorText, setErrorText] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/supplier/${slug}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          const { thisSupplier } = response.data;

          setSupplier(thisSupplier);

          setCoordinates({
            latitude: thisSupplier.latitude,
            longitude: thisSupplier.longitude,
          });

          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, [slug]);

  const setting = {
    dots: false,
    infinite: true,
    speed: 1300,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    arrows: true,
    autoplay: true,
  };

  return (
    <div id="supplier_page">
      {loading ? (
        <div className="w-100 d-flex-center-center mt-3">
          <VscLoading className="loader" />
        </div>
      ) : (
        supplier &&
        supplier.photos.length > 1 && (
          <Slider {...setting}>
            {supplier.photos.map((p, i) => (
              <img
                key={i}
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${p}`}
                alt={supplier.title}
                className="supplier_carousel_img"
              />
            ))}
          </Slider>
        )
      )}
      {supplier && supplier.backupFor && (
        <SupplierProducts backupFor={supplier && supplier.backupFor} />
      )}
      <Section13 />
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        supplier &&
        supplier._id.length > 0 && (
          <div className="supplier_information_wrapper">
            <div className="supplier_info_box">
              <div className="info_box">
                <strong>نام فروشگاه :</strong>
                <span>{supplier.title}</span>
              </div>
              <div className="info_box">
                <strong>مالک :</strong>
                <span>{supplier.owner}</span>
              </div>
              <div className="info_box">
                <strong>شماره تماس :</strong>
                <span>{supplier.storePhoneNumber}</span>
              </div>
              <div className="info_box">
                <strong>آدرس :</strong>
                <span>{supplier.address}</span>
              </div>
            </div>

            <div className="supplier_location_box">
              <div className="supplier_map">
                {loading ? (
                  <VscLoading className="loader" />
                ) : (
                  coordinates.latitude && (
                    <MapContainer
                      center={[coordinates.latitude, coordinates.longitude]}
                      zoom={16}
                      scrollWheelZoom={false}
                      className="map_supp"
                    >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[coordinates.latitude, coordinates.longitude]}
                      >
                        <Popup>{supplier.title}</Popup>
                      </Marker>
                    </MapContainer>
                  )
                )}
              </div>
            </div>
            <div className="supplier_content_wrapper">
              <figure>
                <img
                  src={
                    supplier.ownerImage && supplier.ownerImage.length > 0
                      ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${supplier.ownerImage}`
                      : defPic
                  }
                  alt={supplier.title}
                  className="owner_img"
                />
              </figure>
              <p>{supplier.description}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SupplierIntroduce;
