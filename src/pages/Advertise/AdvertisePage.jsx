import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { VscLoading } from "react-icons/vsc";
import axios from "../../util/axios";
import { Helmet } from "react-helmet-async";
import InstagramLogo from "../../assets/images/instalogo.png";
import TelegramLogo from "../../assets/images/telegram_PNG11.png";
import WhatsappLogo from "../../assets/images/whatsapp-logo.png";
import defPic from "../../assets/images/pro-8.png";
import "../Supplier/SupplierIntroduce.css";
import "./AdvertisePage.css";

const AdvertisePage = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [advertise, setAdvertise] = useState({});
  const [errorText, setErrorText] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const { slug } = match.params;
  
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/advertise/${slug}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setAdvertise(response.data.thisAdvertise);
          setCoordinates({
            latitude: response.data.thisAdvertise.latitude,
            longitude: response.data.thisAdvertise.longitude,
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
    <div id="advertise_page">
      <Helmet>
        <title>{`فروشگاه ${advertise?.title}`}</title>
        <meta
          name="description"
          content={advertise?.description}
        />
      </Helmet>
      {loading ? (
        <div className="w-100 d-flex-center-center mt-3">
          <VscLoading className="loader" />
        </div>
      ) : advertise?.title?.length > 0 && (
          <div className="store_info_wrapper">  
            <div className="supplier_info_box">
              <div className="info_box">
                <strong>نام فروشگاه :</strong>
                <span>{advertise.title}</span>
              </div>
              <div className="info_box">
                <strong>مالک فروشگاه :</strong>
                <span>{advertise.owner}</span>
              </div>
              <div className="info_box">
                <strong>شماره تماس مالک :</strong>
                <span>{advertise.phoneNumber}</span>
              </div>
              <div className="info_box">
              <strong>آدرس فروشگاه :</strong>
              <span>{advertise.address}</span>
            </div>
            {advertise?.storePhoneNumber?.length > 0 && <div className="info_box">
              <strong>شماره تماس فروشگاه :</strong>
              <span>{advertise.storePhoneNumber}</span>
            </div>}
            <div className="social_address_wrapper">
              <span style={{marginLeft: "auto"}}>ما را دنبال کنید در : </span>
              {advertise?.instagramId?.length > 0 && <div>
                <a
                  href={`https://instagram.com/${advertise.instagramId}`}
                  target="_blank"
                  rel="noreferrer"
                  title={advertise.title}
                >
                  <img
                  src={InstagramLogo}
                  alt="instagram_id"
                  className="instagram_logo"
                  style={{width: "25px",height: "25px"}}
                  />
                </a>
              </div>}
              {advertise?.telegramId?.length > 0 && <div>
                <a
                  href={`https://telegram.com/${advertise.telegramId}`}
                  target="_blank"
                  rel="noreferrer"
                  title={advertise.title}
                >
                <img src={TelegramLogo} alt="telegram_id" style={{width: "25px",height: "25px"}} />
                </a>
              </div>}
              {advertise?.whatsupId?.length > 0 && <div>
                <a
                  href={`https://whatsapp.com/${advertise.whatsupId}`}
                  target="_blank"
                  rel="noreferrer"
                  title={advertise.title}
                >
                <img src={WhatsappLogo} alt="whatsapp_id" />
                </a>
              </div>}
            </div>
            </div>
            <div className="store_carousel_wrapper">
              {advertise?.photos?.length > 0 && (
                <Slider {...setting}>
                  {advertise.photos.map((p, i) => (
                    <img
                      key={i}
                      src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${p}`}
                      alt={advertise.title}
                      className="supplier_carousel_img"
                    />
                  ))}
                </Slider>
              )}
            </div> 
          </div>
        )
      }
      {
        errorText?.length > 0 ? <p className="warning-message">{errorText}</p> : (
          <div className="supplier_information_wrapper">
              <div className="supplier_content_wrapper">
                <figure>
                  <img
                    src={
                      advertise.ownerImage && advertise.ownerImage.length > 0
                        ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${advertise.ownerImage}`
                        : defPic
                    }
                    alt={advertise.title}
                    className="owner_img"
                  />
                </figure>
                <p>{advertise.description}</p>
              </div>

              <div className="supplier_location_box">
                <div className="supplier_map">
                  {coordinates.latitude && (
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
                        <Popup>{advertise.title}</Popup>
                      </Marker>
                    </MapContainer>
                  )}
                </div>
              </div>
          </div>
        )
      }
    </div>
  );
};

export default AdvertisePage;
