import React from "react";
import GonshapAttribute from "./GonshapAttribute";
import SupplierSlider from "./SupplierSlider";
import { useSelector } from "react-redux";
import "./Section1.css";

const Section1 = () => {
  const {isMobile} = useSelector(state => state)

  return (
    <section id="sec1">
      <SupplierSlider />
      {!isMobile && <GonshapAttribute />}
    </section>
  );
};

export default Section1;
