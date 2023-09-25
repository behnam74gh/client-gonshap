import React from "react";
import { RiMailAddLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import ListOfSentTickets from "./ListOfSentTickets";
import "./Ticket.css";

const UserTickets = ({history}) => {
  const userPath = history.location.pathname.split('/')[1]
  return (
    <div className="admin-panel-wrapper">
      <Link
        to={`/${userPath}/dashboard/create-ticket`}
        className="create-new-slide-link"
      >
        <span className="sidebar-text-link">ارسال تیکت</span>
        <RiMailAddLine className="font-md" />
      </Link>
      <hr />
      <h4>تیکت های ارسالی شما به مدیریت</h4>
      <ListOfSentTickets />
    </div>
  );
};

export default UserTickets;
