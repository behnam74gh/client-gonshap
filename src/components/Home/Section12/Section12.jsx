import React, { useEffect, useState } from "react";
import { FaCircle, FaPlus, FaMinus } from "react-icons/fa";
import axios from "../../../util/axios";
import { db } from "../../../util/indexedDB";
import { useInView } from "react-intersection-observer";
import { VscLoading } from "react-icons/vsc";
import "./Section12.css";

const Section12 = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeAccItem, setActiveAccItem] = useState("");
  const [error, setError] = useState("");
  const [isViewed,setIsviewed] = useState(false);
  const [loading, setLoading] = useState(false);

  const {ref, inView} = useInView({threshold: 0});

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;

    if(inView && !isViewed){
      setLoading(true)
      if(navigator.onLine){
        axios
        .get("/get-all-faqs",{signal: ac.signal})
        .then((response) => {
          if(response.data.success && mounted){
            setLoading(false)
            setFaqs(response.data.allFaqs);
            setActiveAccItem(response.data.allFaqs[0]._id);
            
            db.faq.clear()
            db.faq.bulkPut(response.data.allFaqs)

            setIsviewed(true)
          }
        })
        .catch((err) => {
          if (err.response && mounted) {
            setError(err.response.data.message);
          }
        });
      }else{
        db.faq.toArray().then(items => {
          if(items.length > 0 && mounted){
            setLoading(false)
            setFaqs(items)
            setActiveAccItem(items[0]._id);
          }
        })
      }

    }

    return () => {
      ac.abort()
      mounted = false;
    }
  }, [inView]);

  const setActiveItemHandler = (id) => {
    if (activeAccItem === id) {
      setActiveAccItem("");
    } else {
      setActiveAccItem(id);
    }
  };

  return (
    <section ref={ref} id="sec12">
      <h2 className="text-center">سوالات پرتکرار</h2>
      <div className="temporary_questions_wrapper">
        <div className="accordion">
          {loading ? (
            <div className="w-100 d-flex-center-center my-2">
              <VscLoading className="loader" fontSize={window.innerWidth < 450 ? 20 : 40} />
           </div>
          ) : error.length > 0 ? (
            <p className="warning-message">{error}</p>
          ) : (
            faqs.length > 0 &&
            faqs.map((item) => (
              <div key={item._id} className="accordion_item">
                <div className="accordion_question_wrapper">
                  <div className="d-flex-center-center">
                    <FaCircle className="first_icon" />
                    <h5 className="accordion_title">{item.question}</h5>
                  </div>
                  <span
                    className="d-flex-center-center"
                    onClick={() => setActiveItemHandler(item._id)}
                  >
                    {activeAccItem === item._id ? (
                      <FaMinus className="accordion_icon" />
                    ) : (
                      <FaPlus className="accordion_icon" />
                    )}
                  </span>
                </div>

                <p
                  className={
                    activeAccItem !== item._id
                      ? "accordion_content"
                      : "accordion_content show"
                  }
                >
                  {item.answer}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Section12;
