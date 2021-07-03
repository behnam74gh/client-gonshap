import React from "react";
import { RiMailAddLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import ListOfSentTickets from "./ListOfSentTickets";
import "./Ticket.css";

const UserTickets = () => {
  return (
    <div className="admin-panel-wrapper">
      <Link
        to="/user/dashboard/create-ticket"
        className="create-new-slide-link"
      >
        <span className="sidebar-text-link">ارسال تیکت</span>
        <RiMailAddLine className="font-md" />
      </Link>
      <hr />
      <h4>تیکت های ارسالی شما به مدیریت، جهت پشتیبانی</h4>
      <ListOfSentTickets />
    </div>
  );
};

export default UserTickets;
