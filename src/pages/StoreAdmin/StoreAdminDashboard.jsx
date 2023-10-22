import React,{useEffect,useRef,lazy} from 'react'
import {Switch,Link} from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import StoreAdminRoute from '../../util/routes/StoreAdminRoute'
import '../Admin/Product/Products.css'
import '../Admin/Carousel/Carousels.css'
import "../../components/UI/FormElement/ImageUpload.css";
import "../../components/UI/FormElement/Input.css"

const StoreAdminDashboardLayout = lazy(() => import('./StoreAdminDashboardLayout'))
const StoreDashboardHome = lazy(() => import('./StoreDashboardHome/StoreDashboardHome'))
const Orders = lazy(() => import("../Admin/Orders/Orders"));
const OrderDetails = lazy(() => import("../Admin/Orders/OrderDetails"));
const Products = lazy(() => import('../Admin/Product/Products'))
const ProductCreate = lazy(() => import('../Admin/Product/ProductCreate'))
const ProductUpdate = lazy(() => import('../Admin/Product/ProductUpdate'))
const SubCategory = lazy(() => import("../Admin/SubCategory/SubCategory"));
const SubCategoryUpdate = lazy(() =>
  import("../Admin/SubCategory/SubCategoryUpdate")
);
const Brands = lazy(() => import("../Admin/Brands/Brands"));
const BrandUpdate = lazy(() => import("../Admin/Brands/BrandUpdate"));
const ToDoList = lazy(() => import("../Admin/ToDo/ToDoList"));
const ToDoCreate = lazy(() => import("../Admin/ToDo/ToDoCreate"));
const UserTickets = lazy(() => import('../User/Ticket/UserTickets'))
const CreateTicket = lazy(() => import('../User/Ticket/CreateTicket'))
const UpdateProfileInfo = lazy(() => import('../Admin/UpdateProfileInfo/UpdateProfileInfo'))
const ChangeUserPassword = lazy(() => import('../Admin/UpdateProfileInfo/ChangeUserPassword'))

const StoreAdminDashboard = ({history}) => {
    const dashboardHomeLionkref = useRef()

    useEffect(() => {
        if(history.location.pathname === '/store-admin/dashboard'){
            dashboardHomeLionkref.current.click()
        }
    }, [history])
    
  return (
    <React.Fragment>
      <Helmet>
        <title>بازارچک</title>
      </Helmet>
        <Link to='/store-admin/dashboard/home' ref={dashboardHomeLionkref} />

        <StoreAdminDashboardLayout>
            <Switch>
                <StoreAdminRoute path='/store-admin/dashboard/home' component={StoreDashboardHome} />
                <StoreAdminRoute path='/store-admin/dashboard/orders' component={Orders} />
                <StoreAdminRoute path='/store-admin/dashboard/order/:id' component={OrderDetails} />
                <StoreAdminRoute path='/store-admin/dashboard/products' component={Products} />
                <StoreAdminRoute path='/store-admin/dashboard/create-product' component={ProductCreate} />
                <StoreAdminRoute path='/store-admin/dashboard/product/:slug' component={ProductUpdate} />
                <StoreAdminRoute path='/store-admin/dashboard/subcategories' component={SubCategory} />
                <StoreAdminRoute path='/store-admin/dashboard/subcategory/:slug' component={SubCategoryUpdate} />
                <StoreAdminRoute path='/store-admin/dashboard/todo' component={ToDoList} />
                <StoreAdminRoute path='/store-admin/dashboard/create-todo' component={ToDoCreate} />
                <StoreAdminRoute path='/store-admin/dashboard/brands' component={Brands} />
                <StoreAdminRoute path='/store-admin/dashboard/brand-update/:id' component={BrandUpdate} />
                <StoreAdminRoute path='/store-admin/dashboard/tickets' component={UserTickets} />
                <StoreAdminRoute path='/store-admin/dashboard/create-ticket' component={CreateTicket} />
                <StoreAdminRoute path='/store-admin/dashboard/update/profile-info' component={UpdateProfileInfo} />
                <StoreAdminRoute path='/store-admin/dashboard/update/user-password' component={ChangeUserPassword} />
            </Switch>
        </StoreAdminDashboardLayout>
    </React.Fragment>
  )
}

export default StoreAdminDashboard