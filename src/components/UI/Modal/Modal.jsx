import React from "react";
import BackDrop from "../Backdrop/Backdrop";
import "./Modal.css";

const Modal = ({ open, closeHandler, children }) => {
  return (
    <div>
      <BackDrop show={open} onClick={closeHandler} />
      <div className={open ? "modal opened" : "modal closed"}>{children}</div>
    </div>
  );
};

export default Modal;
