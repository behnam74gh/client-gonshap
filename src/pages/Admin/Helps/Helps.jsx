import React from "react";
import CreateHelp from "./CreateHelp";
import HelpsList from "./HelpsList";
import "./Helps.css";

const Helps = () => {
  return (
    <div className="admin-panel-wrapper">
      <CreateHelp />
      <HelpsList />
    </div>
  );
};

export default Helps;
