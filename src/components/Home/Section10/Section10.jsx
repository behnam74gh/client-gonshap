import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from "react-icons/fa";
import axios from "../../../util/axios";
import LoadingSuggest from "../../UI/LoadingSkeleton/LoadingSuggest";
import defPic from "../../../assets/images/pro-8.png";
import "./Section10.css";

const Section10 = () => {
  const [loading, setLoading] = useState(false);
  const [bestSuggests, setBestSuggests] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSuggest, setActiveSuggest] = useState({});

  useEffect(() => {
    setLoading(true);
    axios
      .get("/fetch/best-suggests")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setBestSuggests(response.data.suggests);
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
    <section id="sec10">
      <h2>مردم چه می گویند</h2>
      {loading ? (
        <LoadingSuggest />
      ) : errorText.length > 0 ? (
        <p className="info-message">{errorText}</p>
      ) : (
        bestSuggests.length > 0 && (
          <article className="review">
            <div className="img-container">
              <img
                src={
                  activeSuggest.writerImage &&
                  activeSuggest.writerImage.length > 0
                    ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${activeSuggest.writerImage}`
                    : defPic
                }
                alt={`تصویر ${activeSuggest.writerName}`}
                className="person-img"
              />
              <span className="quote-icon">
                <FaQuoteRight />
              </span>
            </div>
            <h4 className="author">
              {activeSuggest.writerName && activeSuggest.writerName.length > 0
                ? activeSuggest.writerName
                : "-"}
            </h4>
            <p className="info">{activeSuggest.content}</p>
            <div className="button-container">
              <button onClick={nextSuggestHandler}>
                <FaChevronRight />
              </button>
              <button onClick={prevSuggestHandler}>
                <FaChevronLeft />
              </button>
            </div>
          </article>
        )
      )}
    </section>
  );
};

export default Section10;
