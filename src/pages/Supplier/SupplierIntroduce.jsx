import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { VscLoading } from "react-icons/vsc";
import axios from "../../util/axios";
import { Helmet } from "react-helmet-async";
import SupplierProducts from "./SupplierProducts";
import defPic from "../../assets/images/pro-8.png";
import InstagramLogo from "../../assets/images/instalogo.png";
import TelegramLogo from "../../assets/images/telegram_PNG11.png";
import WhatsappLogo from "../../assets/images/whatsapp-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { IoIosStar } from "react-icons/io";
import { useHistory } from "react-router-dom";
import StarRating from "react-star-ratings";
import { CLOSE_STAR_RATING_MODAL, OPEN_STAR_RATING_MODAL } from "../../redux/Types/ratingModalType";
import Modal from "../../components/UI/Modal/Modal";
import { FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { ShowRatingAverage } from "../../components/Home/Shared/ShowRatingAverage";
import "../Advertise/AdvertisePage.css"
import "../Product/ProductDetails.css"
import "../../pages/Admin/CommentsList/CommentsList.css";
import "./SupplierIntroduce.css";
import { HiBadgeCheck } from "react-icons/hi";

const SupplierIntroduce = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState();
  const [errorText, setErrorText] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [starValue, setStarValue] = useState({
    star: 0,
    storeId: "",
  });
  const [lastVote,setLastVote] = useState(0)
  const [rateLoading,setRateLoading] = useState(false)
  const [ratingResult, setRatingResult] = useState(0);

  const { slug } = match.params;
  const dispatch = useDispatch();
  const history = useHistory();
  const { userSignin : { userInfo }, ratingModal,isOnline } = useSelector((state) => ({
    ...state,
  }));

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

      return () => {
        setStarValue({
          star: 0,
          storeId: "",
        })
        setLastVote(0)
      }
  }, [slug]);

  useEffect(() => {
    if (supplier?.ratings && userInfo?.userId) {
      const existRatingObject = supplier.ratings.find(
        (r) => r.postedBy.toString() === userInfo.userId.toString()
      );

      if(existRatingObject) {
        setStarValue({ star: existRatingObject.star, storeId: supplier._id});
        setLastVote(existRatingObject.star)
      }
    }
  }, [supplier, userInfo]);

  useEffect(() => {
    if(supplier?.point > 999999){
      setRatingResult((supplier.point/1000000).toFixed(1))
    }else if(supplier?.point > 999){
      setRatingResult((supplier.point/1000).toFixed(1))
    }else if (supplier?.point > 0){
     setRatingResult(supplier.point)
    }
  }, [supplier])

  const ratingModalHandler = () => {
    if (userInfo?.userId?.length > 0) {
      dispatch({ type: OPEN_STAR_RATING_MODAL });
    } else {
      history.push({
        pathname: "/signin",
        state: {
          from: `/supplier/introduce/${slug}`,
        },
      });
    }
  };

  const setStarRatingHandler = () => {
    let correctPoint = 1;
    if(starValue.star > lastVote){
      correctPoint = starValue.star - lastVote;
    }else if(starValue.star < lastVote){
      correctPoint = starValue.star - lastVote;
    }else{
      dispatch({ type: CLOSE_STAR_RATING_MODAL })
      return;
    }
    
    setRateLoading(true)

    axios
      .put(`/store/ratings-star/${supplier._id}`, {
        star: starValue.star,
        point: correctPoint,
      })
      .then((response) => {
        setRateLoading(false)
        if (response.data.success) {
          dispatch({ type: CLOSE_STAR_RATING_MODAL });
          toast.info("از توجه شما متشکریم ،مدیریت بازارچک!");
          setLastVote(starValue.star)
          // loadCurrentProduct();
        }
      })
      .catch((err) => {
        setRateLoading(false)
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });
  };
  const setStarHandler = (newRating, name) => {
    setStarValue({ star: newRating, storeId: name });
  };

  const closeRatingModalHandler = () => {
    dispatch({ type: CLOSE_STAR_RATING_MODAL })
    setStarValue({...starValue, star: lastVote})
  }

  const setting = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    arrows: true,
    autoplay: true,
  };

  return (
    <div id="supplier_page">
      <Helmet>
        <title>{`فروشگاه ${supplier?.title}`}</title>
        <meta name="description" content={supplier?.description} />
      </Helmet>
      {loading ? (
        <div className="w-100 d-flex-center-center mt-3">
          <VscLoading className="loader" />
        </div>
      ) : supplier?.photos?.length > 1 && (
          <div className="store_info_wrapper">
            <div className="supplier_info_box">
              <div className="info_box">
                <strong>{supplier.title}</strong>
                {supplier.authentic && <HiBadgeCheck className="text-blue font-md" />}
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
                <strong>نشانی :</strong>
                <span>{supplier.address}</span>
              </div>

              <div className="rating_compare_wrapper">
                {supplier.ratings?.length > 0 ? (
                  <div className="product_rating_wrapper_info">
                    {ShowRatingAverage(supplier)}
                    <span className="mr-1 font-sm d-flex-center-center">
                      <span className="font-sm pt-1 mr-1">
                        {ratingResult}
                        {supplier.point > 999999 ? <span className='ml-1'>M</span> : supplier.point > 999 && <span className='ml-1'>K</span>}
                        <span className="mx-1">امتیاز</span>
                      </span>
                    </span>
                  </div>
                ) : (
                  <p className="font-sm">امتیازی داده نشده است</p>
                )}
          </div>

              { (supplier?.instagramId?.length > 0 || supplier?.telegramId?.length > 0 || supplier?.whatsupId?.length > 0) &&
                <div className="social_address_wrapper">
                <span style={{marginLeft: "auto"}}>ما را دنبال کنید در : </span>
                {supplier?.instagramId?.length > 0 && <div>
                  <a
                    href={`https://instagram.com/${supplier.instagramId}`}
                    target="_blank"
                    rel="noreferrer"
                    title={supplier.title}
                  >
                    <img
                    src={InstagramLogo}
                    alt="instagram_id"
                    className="instagram_logo"
                    style={{width: "25px",height: "25px"}}
                    />
                  </a>
                </div>}
                {supplier?.telegramId?.length > 0 && <div>
                  <a
                    href={`https://telegram.com/${supplier.telegramId}`}
                    target="_blank"
                    rel="noreferrer"
                    title={supplier.title}
                  >
                  <img src={TelegramLogo} alt="telegram_id" style={{width: "25px",height: "25px"}} />
                  </a>
                </div>}
                {supplier?.whatsupId?.length > 0 && <div>
                  <a
                    href={`https://whatsapp.com/${supplier.whatsupId}`}
                    target="_blank"
                    rel="noreferrer"
                    title={supplier.title}
                  >
                  <img src={WhatsappLogo} alt="whatsapp_id" />
                  </a>
                </div>}
              </div>}

              {isOnline && <div className="rating_btn_wrapper">
                <button
                  className="d-flex-center-center"
                  onClick={ratingModalHandler}
                >
                  امتیاز دهی
                  <IoIosStar className="mx-2 font-md" />
                </button>
              </div>}

            </div>
            <div className="store_carousel_wrapper">
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
            </div>
          </div>
        )
      }
      {supplier?.backupFor && (
        <SupplierProducts backupFor={supplier.backupFor} storeName={supplier.title} />
      )}
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (supplier?._id?.length > 0 && (
          <div className="supplier_information_wrapper">
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
          </div>
        )
      )}

        <Modal
          open={ratingModal.modalOpen}
          closeHandler={closeRatingModalHandler}
        >
          <div className="rating_modal_wrapper">
            <FaTimesCircle
              className="close_Rating_modal"
              onClick={closeRatingModalHandler}
            />
            <div className="rating_stars_wrapper">
              <StarRating
                name={supplier?._id}
                numberOfStars={5}
                rating={starValue.star}
                changeRating={setStarHandler}
                isSelectable={true}
                starRatedColor="var(--secondColorPalete)"
                starDimension={window.innerWidth < 450 ? "15px" : "50px"}
                starSpacing={window.innerWidth < 450 ? "2px" : "5px"}
              />
            </div>
            <div className="rating_modal_btn_wrapper">
              <button
                onClick={setStarRatingHandler}
                className="modal_btn bg-purple"
              >
                {rateLoading ? <VscLoading className="loader" /> : "ثبت"}
              </button>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default SupplierIntroduce;
