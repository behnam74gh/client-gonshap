import React, { useEffect, useState } from "react";
import { FaCircle, FaPlus, FaMinus } from "react-icons/fa";
import axios from "../../../util/axios";
import { useInView } from "react-intersection-observer";
import { VscLoading } from "react-icons/vsc";
import { useDispatch,useSelector } from "react-redux";
import { SAVE_FAQ } from "../../../redux/Types/homeApiTypes";
import "./Section12.css";

const Section12 = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeAccItem, setActiveAccItem] = useState("");
  const [error, setError] = useState("");
  const [isViewed,setIsviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  const { cachedHomeApis: { faq: { items,validTime } } } = useSelector((state) => state);

  const dispatch = useDispatch();
  const {ref, inView} = useInView({threshold: 0});

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true;

    if(inView && !isViewed){
      if(items.length > 0 && Date.now() < validTime){
        setLoading(false);
        setFaqs(items);
        setActiveAccItem(items[0]._id);

        setIsviewed(true);
      }else{
        axios
        .get("/get-all-faqs",{signal: ac.signal})
        .then((response) => {
          if(response.data.success && mounted){
            setLoading(false)
            setFaqs(response.data.allFaqs);
            setActiveAccItem(response.data.allFaqs[0]._id);
            dispatch({
              type: SAVE_FAQ,
              payload: {
                items: response.data.allFaqs,
              }
            })

            setIsviewed(true);
          }
        })
        .catch((err) => {
          if (err.response && mounted) {
            setError(err.response.data.message);
          }
        });
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

  let accordionMinHeight;
  if(window.innerWidth < 451){
    accordionMinHeight = `${(faqs.length*30)+30+10}px`;
  }else if(window.innerWidth < 781){
    accordionMinHeight = `${(faqs.length*40)+35+10}px`
  }else{
    accordionMinHeight = `${(faqs.length*50)+45+26}px`;
  }

  return (
    <section ref={ref} id="sec12">
      <h2 className="text-center">سوالات پرتکرار</h2>
      <div className="temporary_questions_wrapper">
        <div className="accordion" style={{minHeight: activeAccItem.length > 0 && accordionMinHeight }}>
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
