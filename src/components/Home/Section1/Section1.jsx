import React from "react";
import SupplierSlider from "./SupplierSlider";
import Section2 from '../Section2/Section2'
import "./Section1.css";

const Section1 = () => {

  return (
    <section id="sec1">
      <SupplierSlider />
      <Section2 />
    </section>
  );
};

export default Section1;
