import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  if (props.href) {
    return (
      <a href={props.href} className={`button`} style={props.style}>
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`button`}
        style={props.style}
        onClick={props.click}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled}
      style={props.style}
      className={`button`}
    >
      {props.children}
    </button>
  );
};

export default Button;
