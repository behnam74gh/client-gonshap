import React, { useEffect, useRef, lazy } from "react";
import { Link, Switch } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AdminRoute from "../../../util/routes/AdminRoute";
import "../Product/Products.css";
import "../Carousel/Carousels.css";
import "../../Supplier/SupplierIntroduce.css";
import "../../../components/UI/FormElement/ImageUpload.css";
import "../../../components/UI/FormElement/Input.css"

const AdminDashboardLayout = lazy(() => import("../AdminDashboardLayout"));
const AdminDashboardHome = lazy(() =>
  import("../AdminDashboardHome/AdminDashboardHome")
);
const AllUsers = lazy(() => import("../Users/AllUsers"));
const AdminUpdatesUser = lazy(() => import("../Users/AdminUpdatesUser"));
const Products = lazy(() => import("../Product/Products"));
const ProductCreate = lazy(() => import("../Product/ProductCreate"));
const ProductUpdate = lazy(() => import("../Product/ProductUpdate"));
const Category = lazy(() => import("../Category/Category"));
const CategoryUpdate = lazy(() => import("../Category/CategoryUpdate"));
const SubCategory = lazy(() => import("../SubCategory/SubCategory"));
const SubCategoryUpdate = lazy(() =>
  import("../SubCategory/SubCategoryUpdate")
);
const Brands = lazy(() => import("../Brands/Brands"));
const BrandUpdate = lazy(() => import("../Brands/BrandUpdate"));
const Colors = lazy(() => import("../Colors/Colors"));
const ColorUpdate = lazy(() => import("../Colors/ColorUpdate"));
const Carousels = lazy(() => import("../Carousel/Carousels"));
const CarouselCreate = lazy(() => import("../Carousel/CarouselCreate"));
const CarouselUpdate = lazy(() => import("../Carousel/CarouselUpdate"));
const Ads = lazy(() => import("../Ads/Ads"));
const AdvertiseCreate = lazy(() => import("../Ads/AdvertiseCreate"));
const AdvertiseUpdate = lazy(() => import("../Ads/AdvertiseUpdate"));
const Orders = lazy(() => import("../Orders/Orders"));
const OrderDetails = lazy(() => import("../Orders/OrderDetails"));
const Tickets = lazy(() => import("../Ticket/Tickets"));
const ManageTicket = lazy(() => import("../Ticket/ManageTicket"));
const CommentsList = lazy(() => import("../CommentsList/CommentsList"));
const SendSMS = lazy(() => import("../SendSMS/SendSMS"));
const SendOneSMS = lazy(() => import("../SendSMS/SendOneSMS"));
const SendManySMS = lazy(() => import("../SendSMS/SendManySMS"));
const SendToAllSMS = lazy(() => import("../SendSMS/SendToAllSMS"));
const SMSDetails = lazy(() => import("../SendSMS/SMSDetails"));
const Suggests = lazy(() => import("../Suggests/Suggests"));
const ToDoList = lazy(() => import("../ToDo/ToDoList"));
const ToDoCreate = lazy(() => import("../ToDo/ToDoCreate"));
const Faq = lazy(() => import("../Faq/Faq"));
const UpdateProfileInfo = lazy(() =>
  import("../UpdateProfileInfo/UpdateProfileInfo")
);
const ChangeUserPassword = lazy(() =>
  import("../UpdateProfileInfo/ChangeUserPassword")
);
const Region = lazy(() => import("../Region/Region"));
const RegionUpdate = lazy(() => import("../Region/RegionUpdate"));
const Location = lazy(() => import("../Location/Location"));
const Helps = lazy(() => import("../Helps/Helps"));

const AdminDashboard = ({ history }) => {
  const dashHomeLinkRef = useRef();

  useEffect(() => {
    if (history.location.pathname === "/admin/dashboard") {
      dashHomeLinkRef.current.click();
    }
  }, [history]);

  return (
    <React.Fragment>
      <Helmet>
        <title>بازارچک</title>
      </Helmet>
      <Link to="/admin/dashboard/home" ref={dashHomeLinkRef} />
      <AdminDashboardLayout>
        <Switch>
          <AdminRoute
            path="/admin/dashboard/home"
            component={AdminDashboardHome}
          />
          <AdminRoute path="/admin/dashboard/users" component={AllUsers} />
          <AdminRoute
            path="/admin/dashboard/user/:id"
            component={AdminUpdatesUser}
          />
          <AdminRoute path="/admin/dashboard/products" component={Products} />
          
          <AdminRoute
            path="/admin/dashboard/create-product"
            component={ProductCreate}
          />
          <AdminRoute
            path="/admin/dashboard/product/:slug"
            component={ProductUpdate}
          />
          <AdminRoute path="/admin/dashboard/categories" component={Category} />
          <AdminRoute
            path="/admin/dashboard/category/:slug"
            component={CategoryUpdate}
          />
          <AdminRoute
            path="/admin/dashboard/subcategories"
            component={SubCategory}
          />
          <AdminRoute
            path="/admin/dashboard/subcategory/:slug"
            component={SubCategoryUpdate}
          />
          <AdminRoute path="/admin/dashboard/brands" component={Brands} />
          <AdminRoute
            path="/admin/dashboard/brand-update/:id"
            component={BrandUpdate}
          />
          <AdminRoute path="/admin/dashboard/colors" component={Colors} />
          <AdminRoute
            path="/admin/dashboard/color-update/:id"
            component={ColorUpdate}
          />
          <AdminRoute path="/admin/dashboard/carousel" component={Carousels} />
          <AdminRoute
            path="/admin/dashboard/create-carousel"
            component={CarouselCreate}
          />
          <AdminRoute
            path="/admin/dashboard/carousel-update/:id"
            component={CarouselUpdate}
          />
          <AdminRoute path="/admin/dashboard/ads" component={Ads} />
          <AdminRoute
            path="/admin/dashboard/create-advertise"
            component={AdvertiseCreate}
          />
          <AdminRoute
            path="/admin/dashboard/advertise-update/:slug"
            component={AdvertiseUpdate}
          />
          <AdminRoute path="/admin/dashboard/orders" component={Orders} />
          <AdminRoute
            path="/admin/dashboard/order/:id"
            component={OrderDetails}
          />

          <AdminRoute path="/admin/dashboard/tickets" component={Tickets} />
          <AdminRoute
            path="/admin/dashboard/ticket/:id"
            component={ManageTicket}
          />
          <AdminRoute
            path="/admin/dashboard/comments"
            component={CommentsList}
          />

          <AdminRoute path="/admin/dashboard/send-sms" component={SendSMS} />
          <AdminRoute path="/admin/dashboard/one" component={SendOneSMS} />
          <AdminRoute path="/admin/dashboard/many" component={SendManySMS} />
          <AdminRoute path="/admin/dashboard/to-all" component={SendToAllSMS} />
          <AdminRoute path="/admin/dashboard/sms/:id" component={SMSDetails} />
          
          <AdminRoute path="/admin/dashboard/suggests" component={Suggests} />
          <AdminRoute path="/admin/dashboard/todo" component={ToDoList} />
          <AdminRoute
            path="/admin/dashboard/create-todo"
            component={ToDoCreate}
          />
          <AdminRoute path="/admin/dashboard/faq" component={Faq} />
          <AdminRoute
            path="/admin/dashboard/update/profile-info"
            component={UpdateProfileInfo}
          />
          <AdminRoute
            path="/admin/dashboard/update/user-password"
            component={ChangeUserPassword}
          />
          <AdminRoute path="/admin/dashboard/region" component={Region} />
          <AdminRoute
            path="/admin/dashboard/regions/:id"
            component={RegionUpdate}
          />
          <AdminRoute path="/admin/dashboard/info" component={Location} />
          <AdminRoute path="/admin/dashboard/help" component={Helps} />
        </Switch>
      </AdminDashboardLayout>
    </React.Fragment>
  );
};

export default AdminDashboard;
