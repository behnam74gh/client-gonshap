import React from "react";
import { Helmet } from "react-helmet";

import Section1 from "../../components/Home/Section1/Section1";
import Section3 from "../../components/Home/Section3/Section3";
import Section4 from "../../components/Home/Section4/Section4";
import Section5 from "../../components/Home/Section5/Section5";
import Section6 from "../../components/Home/Section6/Section6";
import Section7 from "../../components/Home/Section7/Section7";
import Section8 from "../../components/Home/Section8/Section8";
import Section9 from "../../components/Home/Section9/Section9";
import Section10 from "../../components/Home/Section10/Section10";
import Section11 from "../../components/Home/Section11/Section11";
import Section12 from "../../components/Home/Section12/Section12";
import Section13 from "../../components/Home/Section13/Section13";
import SectionAdvantage from "../../components/Home/Section13.5/SectionAdvantage";
import Section14 from "../../components/Home/Section14/Section14";
import "../Supplier/SupplierIntroduce.css";
import "./Home.css";

const Home = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>بازارک</title>
      </Helmet>
      <Section1 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
      <Section11 />
      <Section12 />
      <Section13 />
      <SectionAdvantage />
      <Section14 />
    </React.Fragment>
  );
};

export default Home;
