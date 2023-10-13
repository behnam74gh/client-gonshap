import React, { useEffect, useState } from "react";
import axios from "../../util/axios";
import ProductCard from "../../components/Home/Shared/ProductCard";
import LoadingSkeletonCard from "../../components/Home/Shared/LoadingSkeletonCard";
import Pagination from "../../components/UI/Pagination/Pagination";
import "./SupplierProducts.css";

const SupplierProducts = ({ backupFor,storeName }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [activeSub, setActiveSub] = useState(
    JSON.parse(localStorage.getItem("gonshapSupplierActiveSub")) || ""
  );
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLength, setProductsLength] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [page, setPage] = useState(
    JSON.parse(localStorage.getItem("gonshapSupplierPageNumber")) || 1
  );
  const [perPage, setPerPage] = useState(20);

  useEffect(() => {
    if (window.innerWidth < 450) {
      setPerPage(10);
    }
  }, []);

  useEffect(() => {
    let id = backupFor && backupFor._id;
    if (id) {
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
  }, [backupFor, activeSub.length]);

  useEffect(() => {
    if (!activeSub.length > 0) {
      return;
    }

    setLoading(true);
    axios
      .post("/find/suppliers-products/by-subcategory", {
        sub: activeSub,
        page,
        perPage,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setProducts(response.data.foundedProducts);
          setProductsLength(response.data.allCount);
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
  }, [activeSub, page, perPage]);

  const switchSubcategoryHandler = (id) => {
    setActiveSub(id);
    localStorage.setItem("gonshapSupplierActiveSub", JSON.stringify(id));
    setPage(1);
    localStorage.removeItem("gonshapSupplierPageNumber");
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("gonshapSupplierActiveSub");
      localStorage.removeItem("gonshapSupplierPageNumber");
    };
  }, []);

  return (
    <div className="suppliers_list_of_products_wrapper">
      <div className="supplier_subcategory_wrapper">
        <p className="font-sm my-1 mx-2">
          محصولات <strong className="mx-1">{backupFor?.name}</strong>{" "}
          از فروشگاه{" "}    
          <strong className="mx-1">{storeName}</strong> {" "}
            تامین میشوند.
        </p>
        {subcategories.length > 0 && navigator.onLine &&
          <select className="categories_wrapper_select" onChange={(e) => switchSubcategoryHandler(e.target.value)}>
          {subcategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        }
      </div>
      <div className="supplier_products_wrapper">
        {loading ? (
          <LoadingSkeletonCard count={12} />
        ) : errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : products.length > 0 ? (
          products.map((product, i) => (
            <ProductCard key={i} product={product} showSold={true} />
          ))
        ) : (
          <p className="info-message text-center w-100">
            براساس این برچسب محصولی وجود ندارد
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
