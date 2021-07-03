import React, { useState } from "react";
import "./Tab.css";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const changeTabHandler = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <React.Fragment>
      <ul className="tabs">
        {children.map((tab) => {
          const label = tab.props.label;
          return (
            <li className={label === activeTab ? "current" : ""} key={label}>
              <a onClick={(e) => changeTabHandler(e, label)} href="#!">
                {label}
              </a>
            </li>
          );
        })}
      </ul>
      {children.map(
        (tabContent) =>
          tabContent.props.label === activeTab && (
            <div key={tabContent.props.label} className="content">
              {tabContent.props.children}
            </div>
          )
      )}
    </React.Fragment>
  );
};

export default Tabs;
