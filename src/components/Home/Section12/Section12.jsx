import React, { useEffect, useState } from "react";
import { FaCircle, FaPlus, FaMinus } from "react-icons/fa";
import axios from "../../../util/axios";
import { db } from "../../../util/indexedDB";
import "./Section12.css";

const Section12 = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeAccItem, setActiveAccItem] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if(navigator.onLine){
      axios
      .get("/get-all-faqs")
      .then((response) => {
        setFaqs(response.data.allFaqs);
        setActiveAccItem(response.data.allFaqs[0]._id);

        db.faq.clear()
        db.faq.bulkPut(response.data.allFaqs)
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        }
      });
    }else{
      db.faq.toArray().then(items => {
        if(items.length > 0){
          setFaqs(items)
          setActiveAccItem(items[0]._id);
        }
      })
    }
  }, []);

  const setActiveItemHandler = (id) => {
    if (activeAccItem === id) {
      setActiveAccItem("");
    } else {
      setActiveAccItem(id);
    }
  };

  return (
    <section id="sec12">
      <h2 className="text-center">سوالات متداول</h2>
      <div className="temporary_questions_wrapper">
        <div className="accordion">
          {error.length > 0 ? (
            <p className="warning-message">{error}</p>
          ) : (
            faqs.length > 0 &&
            faqs.map((item, i) => (
              <div key={i} className="accordion_item">
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
