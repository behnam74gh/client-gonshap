import React from "react";
import { useSelector } from "react-redux";
import "./Backdrop.css";

const Backdrop = (props) => {
  const modalOpen = useSelector(state => state.ratingModal.modalOpen);
  
  return props.show ? (
    <div
      className="backdrop"
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
      style={{zIndex: modalOpen ? "105": "100"}}
    ></div>
  ) : null;
}
  

export default Backdrop;
