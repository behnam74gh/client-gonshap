import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from "react-icons/fa";
import axios from "../../../util/axios";
import LoadingSuggest from "../../UI/LoadingSkeleton/LoadingSuggest";
import { useInView } from "react-intersection-observer";
import { useDispatch,useSelector } from "react-redux";
import { SAVE_SUGGESTS } from "../../../redux/Types/homeApiTypes";
import defPic from "../../../assets/images/pro-8.png";
import "./Section10.css";

const Section10 = () => {
  const [loading, setLoading] = useState(true);
  const [bestSuggests, setBestSuggests] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSuggest, setActiveSuggest] = useState({});
  const [isViewed,setIsviewed] = useState(false);

  const { cachedHomeApis: { suggests: { items,validTime } } } = useSelector((state) => state);

  const dispatch = useDispatch();
  const {ref, inView} = useInView({threshold: 0});

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;
    
    if(inView && !isViewed){
      if(items.length > 0 && Date.now() < validTime){
        setLoading(false);
        setBestSuggests(items);

        setIsviewed(true);
      }else{
        axios
        .get("/fetch/best-suggests",{signal: ac.signal})
        .then((response) => {
          if (response.data.success && mounted) {
            setLoading(false);
            setBestSuggests(response.data.suggests);
            setErrorText("");
            dispatch({
              type: SAVE_SUGGESTS,
              payload: {
                items: response.data.suggests,
              }
            })

            setIsviewed(true);
          }
        })
        .catch((err) => {
          if (err.response && mounted) {
            setLoading(false);
            setErrorText(err.response.data.message);
          }
        });
      }
    }

    return () => {
      ac.abort()
      mounted = false;
    }
  }, [inView]);

  useEffect(() => {
    setLoading(true);
    if (bestSuggests.length > 0) {
      setLoading(false);
      setActiveSuggest(bestSuggests[activeIndex]);
    }
  }, [activeIndex, bestSuggests]);

  const nextSuggestHandler = () => {
    if (activeIndex < bestSuggests.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0);
    }
  };

  const prevSuggestHandler = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(bestSuggests.length - 1);
    }
  };

  return (
      <section ref={ref} className="suggests_wrapper">
        {loading ? (
          <LoadingSuggest />
        ) : errorText.length > 0 ? (
          <p className="info-message">{errorText}</p>
        ) : (
          bestSuggests?.length > 0 && (
            <article className="review">
              <figure className="img-container">
                  <img
                    src={
                      activeSuggest.writerImage &&
                      activeSuggest.writerImage.length > 0
                        ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${activeSuggest.writerImage}`
                        : defPic
                    }
                    alt='عکس'
                    className="person-img"
                  />
                  <span className="quote-icon">
                    <FaQuoteRight />
                  </span>
              </figure>
              <div className="suggest_tools">
                <h6 className="suggest_title">مردم چی میگن ؟</h6>
                <div className="button-container">
                  <button style={{cursor: bestSuggests.length < 2 && "not-allowed"}} disabled={bestSuggests.length < 2} onClick={nextSuggestHandler}>
                    <FaChevronRight />
                  </button>
                  <strong className="author">
                    {activeSuggest?.writerName || " ناشناس "}
                  </strong>
                  <button style={{cursor: bestSuggests.length < 2 && "not-allowed"}} disabled={bestSuggests.length < 2} onClick={prevSuggestHandler}>
                    <FaChevronLeft />
                  </button>
                </div>
              </div>
              <div className="content_wrapper">
                <p className="info">{activeSuggest.content}</p>
              </div>
            </article>
          )
        )}
      </section>
  );
};

export default Section10;
