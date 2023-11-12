import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from "./util/routes/AdminRoute";
import UserRoute from "./util/routes/UserRoute";
import { withErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./pages/ErrorFallback.jsx";
import StoreAdminRoute from "./util/routes/StoreAdminRoute";
import { useDispatch } from "react-redux";
import {fetchActiveAdsHandler} from './redux/Actions/advertiseActions'
import { db } from "./util/indexedDB";
import { ADS_SUCCESS } from "./redux/Types/advertise";

const Layout = lazy(() => import("./layout/Layout"));
const Home = lazy(() => import("./pages/Home/Home"));
const Signin = lazy(() => import("./pages/Auth/Signin"));
const Register = lazy(() => import("./pages/Auth/Register"));
const AdminDashboard = lazy(() =>
  import("./pages/Admin/AdminDashboard/AdminDashboard")
);

const StoreAdminDashboard = lazy(() => import('./pages/StoreAdmin/StoreAdminDashboard'))

const UserDashboard = lazy(() =>
  import("./pages/User/UserDashboard/UserDashboard")
);
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SupplierIntroduce = lazy(() =>
  import("./pages/Supplier/SupplierIntroduce")
);
const AdvertisePage = lazy(() => import("./pages/Advertise/AdvertisePage"));
const Product = lazy(() => import("./pages/Product/Product"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage"));
const MyFavoritePage = lazy(() => import("./pages/MyFavorites/MyFavoritePage"));
const ComparePage = lazy(() => import("./pages/Compare/ComparePage"));
const Stores = lazy(() => import("./pages/Stores/Stores.jsx"));
const ShopPage = lazy(() => import("./pages/Shop/ShopPage"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const HelpPage = lazy(() => import("./pages/Help/HelpPage"));

const LazyLoad = () => {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      easing: "linear",
      speed: 1800,
    });

    NProgress.start();

    return () => {
      NProgress.done();
    };
  });

  return "";
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if(navigator.onLine){
      dispatch(fetchActiveAdsHandler())
    }else{
      db.ads.toArray().then(items => {
        if(items.length > 0){
          const firstLevelAds = items.filter((ad) => ad.level === 1);
          const secondLevelAds = items.filter((ad) => ad.level === 2);
          const thirdLevelAds = items.filter((ad) => ad.level === 3);
          const fourthLevelAds = items.filter((ad) => ad.level === 4);
          const fifthLevelAds = items.filter((ad) => ad.level === 5);
          dispatch({
            type: ADS_SUCCESS,
            payload: {
              firstLevelAds,
              secondLevelAds,
              thirdLevelAds,
              fourthLevelAds,
              fifthLevelAds
            }
          })
        }
      })
    }
  }, [dispatch])

  return (
    <Suspense fallback={<LazyLoad />}>
      <ToastContainer rtl={true} draggable={false} />
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route
            path="/supplier/introduce/:slug"
            component={SupplierIntroduce}
          />
          <Route path="/advertise-page/:slug" component={AdvertisePage} />
          <Route path="/product/details/:id" component={Product} />
          <Route path="/cart" component={CartPage} />
          <Route path="/favorites" component={MyFavoritePage} />
          <Route path="/compares/:id" component={ComparePage} />
          <Route path="/stores" component={Stores} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/signin" component={Signin} />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/help/:id" component={HelpPage} />
          <AdminRoute path="/admin/dashboard" component={AdminDashboard} />
          <StoreAdminRoute path='/store-admin/dashboard' component={StoreAdminDashboard} />
          <UserRoute path="/user/dashboard" component={UserDashboard} />
          <UserRoute path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Suspense>
  );
};

export default withErrorBoundary(App, {
  FallbackComponent: ErrorFallback,
});
