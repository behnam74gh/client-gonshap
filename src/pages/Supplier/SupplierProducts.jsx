import React, { useEffect, useState } from "react";
import axios from "../../util/axios";
import ProductCard from "../../components/Home/Shared/ProductCard";
import LoadingSkeletonCard from "../../components/Home/Shared/LoadingSkeletonCard";
import Pagination from "../../components/UI/Pagination/Pagination";
import { db } from "../../util/indexedDB";
import { useSelector,useDispatch } from "react-redux";
import { CLEAR_SUPPLIER_PRODUCTS, SAVE_SUPPLIER_PRODUCTS } from "../../redux/Types/supplierProductsTypes";
import "./SupplierProducts.css";

const SupplierProducts = ({ backupFor,ownerPhoneNumber }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [activeSub, setActiveSub] = useState(
    JSON.parse(localStorage.getItem("gonshapSupplierActiveSub")) || ""
  );
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(
    JSON.parse(localStorage.getItem("gonshapSupplierPageNumber")) || 1
    );
  const [perPage] = useState(window.innerWidth < 450 ? 18 : 32);
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeOrder, setActiveOrder] = useState(
    JSON.parse(localStorage.getItem("bazarchakSupplierActiveorder")) || "createdAt"
  );

  const { supplierProducts : { items , itemsLength} } = useSelector(state => state);
  const [productsLength, setProductsLength] = useState(itemsLength || 0);
  const [products, setProducts] = useState(items || []);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if(items?.length > 0 && firstLoad){
      setProducts(items);
      setProductsLength(itemsLength);
      setFirstLoad(false)
    }else{
      setFirstLoad(false);
    }
  }, []);

  useEffect(() => {
    if(products.length > 0){
      dispatch({
        type: SAVE_SUPPLIER_PRODUCTS,
        payload: {
          items: products,
          length: productsLength
        } 
      })
    }
  } ,[products])

  useEffect(() => {
    let id = backupFor && backupFor._id;
    
    if (id) {
      db.subCategories.toArray().then(items => {
        if(items.length > 0) {
          const newSubs = items.filter((s) => s.parent === id);
          setSubcategories(newSubs);
          if (!activeSub.length && newSubs.length > 0) {
            setActiveSub(newSubs[0]._id);
          }
        }else{
          axios
            .get(`/category/subs/${id}`)
            .then((response) => {
              if (response.data.success) {
                setSubcategories(response.data.subcategories);
                if (!activeSub.length) {
                  setActiveSub(response.data.subcategories[0]._id);
                }
              }
            })
            .catch((err) => {
              if (err.response) {
                setErrorText(err.response.data.message);
              }
            });
      }
      })
    }
  }, [backupFor]);

  useEffect(() => {
    if (!activeSub.length > 0 || firstLoad) {
      return;
    }

    if(!firstLoad && items.length < 1){
      setLoading(true);
      axios
      .post("/find/suppliers-products/by-subcategory", {
        sub: activeSub,
        ownerPhoneNumber,
        page,
        perPage,
        order: activeOrder
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setProductsLength(response.data.allCount);
          setProducts(response.data.foundedProducts);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
          setProducts([]);
        } else {
          setErrorText(err.response.data.message);
        }
      });
    }
  }, [activeSub, page, perPage,ownerPhoneNumber,items]);

  const switchSubcategoryHandler = (id) => {
    setActiveSub(id);
    localStorage.setItem("gonshapSupplierActiveSub", JSON.stringify(id));
    setPage(1);
    localStorage.removeItem("gonshapSupplierPageNumber");
    dispatch({type: CLEAR_SUPPLIER_PRODUCTS});
  };

  const baseFilteringHandler = (e) => {
    setActiveOrder(e);
    localStorage.setItem("bazarchakSupplierActiveorder", JSON.stringify(e));
    setPage(1);
    localStorage.removeItem("gonshapSupplierPageNumber");
    dispatch({type: CLEAR_SUPPLIER_PRODUCTS});
  };
  
  return (
    <div className="suppliers_list_of_products_wrapper">
      <div className="supplier_subcategory_wrapper">
        <p className="font-sm my-1">
        ارائه دهنده محصولات <strong>{backupFor?.name}</strong>
        </p>
        {subcategories.length > 0 && navigator.onLine &&
          <select value={activeSub} onChange={(e) => switchSubcategoryHandler(e.target.value)}>
          {subcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        }
        {subcategories.length > 0 && navigator.onLine &&
          <select
            value={activeOrder}
            onChange={(e) => baseFilteringHandler(e.target.value)}
          >
            <option value="createdAt">جدیدترین محصولات</option>
            <option value="sold">پرفروش ترین محصولات</option>
            <option value="discount">بالاترین تخفیف ها</option>
            <option value="reviewsCount">پربازدید ترین محصولات</option>
            <option value="expensive">گران ترین محصولات</option>
            <option value="cheap">ارزان ترین محصولات</option>
        </select>}
      </div>
      <div className="supplier_products_wrapper">
        {loading ? (
          <LoadingSkeletonCard count={12} />
        ) : errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              showSold={activeOrder === "sold"} 
              showReviews={activeOrder === "reviewsCount"}
            />
          ))
        ) : subcategories.length > 0 ? (
          <p className="info-message text-center w-100">
            براساس این برچسب محصولی وجود ندارد
          </p>
        ) : (
          <p className="info-message text-center w-100">
            محصولی ثبت نشده است
          </p>
        )}
      </div>
      {productsLength > perPage && (
        <Pagination
          perPage={perPage}
          productsLength={productsLength}
          setPage={setPage}
          page={page}
          isSupplierPage={true}
        />
      )}
    </div>
  );
};

export default SupplierProducts;
