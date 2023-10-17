import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from "react-icons/fa";
import axios from "../../../util/axios";
import LoadingSuggest from "../../UI/LoadingSkeleton/LoadingSuggest";
import defPic from "../../../assets/images/pro-8.png";
import { db } from "../../../util/indexedDB";
import "./Section10.css";

const Section10 = () => {
  const [loading, setLoading] = useState(false);
  const [bestSuggests, setBestSuggests] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSuggest, setActiveSuggest] = useState({});

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;
    if(navigator.onLine){
      setLoading(true);
      axios
      .get("/fetch/best-suggests",{signal: ac.signal})
      .then((response) => {
        if (response.data.success && mounted) {
          setLoading(false);
          setBestSuggests(response.data.suggests);
          setErrorText("");

          db.suggests.clear()
          db.suggests.bulkPut(response.data.suggests)
        }
      })
      .catch((err) => {
        if (err.response && mounted) {
          setLoading(false);
          setErrorText(err.response.data.message);
        }
      });
    }else{
      db.suggests.toArray().then(items => {
        if(items.length > 0 && mounted){
          setBestSuggests(items)
          setErrorText("")
        }
      })
    }

    return () => {
      ac.abort()
      mounted = false;
    }
  }, []);

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
      <section className="suggests_wrapper">
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
                  <button onClick={nextSuggestHandler}>
                    <FaChevronRight />
                  </button>
                  <strong className="author">
                    {activeSuggest?.writerName || " ناشناس "}
                  </strong>
                  <button onClick={prevSuggestHandler}>
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
