import React, { useEffect, useRef, lazy } from "react";
import { Switch, Link } from "react-router-dom";
import UserRoute from "../../../util/routes/UserRoute";
import "../../Admin/Product/Products.css";
import "../../Admin/Carousel/Carousels.css";

const UserDashboardLayout = lazy(() => import("../UserDashboardLayout"));
const UserDashboardHome = lazy(() =>
  import("../UserDashboardHome/UserDashboardHome")
);
const ListOfUserOrders = lazy(() => import("../UserOrders/ListOfUserOrders"));
const UserTickets = lazy(() => import("../Ticket/UserTickets"));
const CreateTicket = lazy(() => import("../Ticket/CreateTicket"));
const UpdateProfileInfo = lazy(() =>
  import("../../Admin/UpdateProfileInfo/UpdateProfileInfo")
);
const ChangeUserPassword = lazy(() =>
  import("../../Admin/UpdateProfileInfo/ChangeUserPassword")
);

const UserDashboard = ({ history }) => {
  const userDashHomeLinkRef = useRef();

  useEffect(() => {
    if (history.location.pathname === "/user/dashboard") {
      userDashHomeLinkRef.current.click();
    }
  }, [history]);

  return (
    <React.Fragment>
      <Link to="/user/dashboard/home" ref={userDashHomeLinkRef} />
      <UserDashboardLayout>
        <Switch>
          <UserRoute
            path="/user/dashboard/home"
            component={UserDashboardHome}
          />
          <UserRoute
            path="/user/dashboard/orders"
            component={ListOfUserOrders}
          />
          <UserRoute path="/user/dashboard/tickets" component={UserTickets} />
          <UserRoute
            path="/user/dashboard/create-ticket"
            component={CreateTicket}
          />
          <UserRoute
            path="/user/dashboard/update/profile-info"
            component={UpdateProfileInfo}
          />
          <UserRoute
            path="/user/dashboard/update/user-password"
            component={ChangeUserPassword}
          />
        </Switch>
      </UserDashboardLayout>
    </React.Fragment>
  );
};

export default UserDashboard;
