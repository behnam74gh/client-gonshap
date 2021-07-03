import React, { useEffect, useState } from "react";
import GonshapAttribute from "./GonshapAttribute";
import SupplierSlider from "./SupplierSlider";
import "./Section1.css";

const Section1 = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 450) {
      setIsMobile(true);
    }
  }, []);

  return (
    <section id="sec1">
      <SupplierSlider />
      {!isMobile && <GonshapAttribute />}
    </section>
  );
};

export default Section1;
