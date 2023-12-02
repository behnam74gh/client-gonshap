import React, { useEffect, useMemo, useState } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { CLEAR_ITEMS } from "../../../redux/Types/shopProductsTypes";
import { CLEAR_SUPPLIER_ACTIVE_PRODUCTS } from "../../../redux/Types/supplierProductsTypes";
import { CLEAR_STORE_ITEMS } from "../../../redux/Types/storeItemsTypes";

const Pagination = ({
  perPage,
  productsLength,
  page,
  setPage,
  isShopPage,
  isSupplierPage,
  isStoresPage
}) => {
  let [pagesAroundOfActivePage, setPagesAroundOfActivePage] = useState([]);

  const dispatch = useDispatch()

  let pageNumbers = useMemo(() => {
    let pagesOfNumbers = [];
    for (let i = 1; i <= Math.ceil(productsLength / perPage); i++) {
      pagesOfNumbers.push(i);
    }
    return pagesOfNumbers;
  }, [productsLength, perPage]);

  let dotsInitial = "...";
  let dotsLeft = "...";
  let dotsRight = "...";

  useEffect(() => {
    let tempNumberOfPages = [...pageNumbers];
    if (page >= 1 && page <= 3 && pageNumbers.length < 4) {
      tempNumberOfPages = [...pageNumbers];
    } else if (page >= 1 && page <= 3 && pageNumbers.length > 4) {
      tempNumberOfPages = [1, 2, 3, 4, dotsInitial, pageNumbers.length];
    } else if (page >= 1 && page <= 4 && pageNumbers.length === 4) {
      tempNumberOfPages = [1, 2, 3, 4];
    } else if (page === 4 && pageNumbers.length > 4) {
      const sliced = pageNumbers.slice(0, 5);
      tempNumberOfPages = [...sliced, dotsInitial, pageNumbers.length];
    } else if (page > 4 && page < pageNumbers.length - 2) {
      const sliced1 = pageNumbers.slice(page - 2, page);
      const sliced2 = pageNumbers.slice(page, page + 1);
      tempNumberOfPages = [
        1,
        dotsLeft,
        ...sliced1,
        ...sliced2,
        dotsRight,
        pageNumbers.length,
      ];
    } else if (page > pageNumbers.length - 3) {
      const sliced = pageNumbers.slice(pageNumbers.length - 4);
      tempNumberOfPages = [1, dotsLeft, ...sliced];
    } else if (
      page === dotsInitial ||
      page === dotsLeft ||
      page === dotsRight
    ) {
      return;
    }

    setPagesAroundOfActivePage(tempNumberOfPages);
  }, [page, setPage, dotsInitial, dotsLeft, dotsRight, pageNumbers]);

  const setActivePageHandler = (number) => {
    if (number === dotsInitial || number === dotsLeft || number === dotsRight || page === number) {
      return;
    } else {
      setPage(number);
      if (isShopPage) {
        dispatch({type: CLEAR_ITEMS});
        localStorage.setItem("gonshapPageNumber", JSON.stringify(number));
      }
      if (isSupplierPage) {
        dispatch({type: CLEAR_SUPPLIER_ACTIVE_PRODUCTS});
        localStorage.setItem("gonshapSupplierPageNumber",JSON.stringify(number));
      }
      if(isStoresPage){
        dispatch({type:CLEAR_STORE_ITEMS});
        localStorage.setItem("storePage",JSON.stringify(number));
      }

      window.scrollTo(0, 0);
    }
  };

  const leftArrowHandler = () => {
    if(page === 1){
      return;
    }
    setPage(page === 1 ? page : page - 1);
    if (isShopPage) {
      dispatch({type: CLEAR_ITEMS});
      localStorage.setItem(
        "gonshapPageNumber",
        page === 1 ? JSON.stringify(page) : JSON.stringify(page - 1)
      );
    }
    if (isSupplierPage) {
      dispatch({type: CLEAR_SUPPLIER_ACTIVE_PRODUCTS});
      localStorage.setItem(
        "gonshapSupplierPageNumber",
        page === 1 ? JSON.stringify(page) : JSON.stringify(page - 1)
      );
    }
    if(isStoresPage){
      dispatch({type:CLEAR_STORE_ITEMS});
      localStorage.setItem(
        "storePage",
        page === 1 ? JSON.stringify(page) : JSON.stringify(page - 1)
      );
    }

    window.scrollTo(0, 0);
  }

  const rightArrowHandler = () => {
    if(page === pageNumbers.length){
      return
    }
    setPage(page === pageNumbers.length ? page : page + 1);
    if (isShopPage) {
      dispatch({type: CLEAR_ITEMS});
      localStorage.setItem(
        "gonshapPageNumber",
        page === pageNumbers.length
          ? JSON.stringify(page)
          : JSON.stringify(page + 1)
      );
    }
    if (isSupplierPage) {
      dispatch({type: CLEAR_SUPPLIER_ACTIVE_PRODUCTS});
      localStorage.setItem(
        "gonshapSupplierPageNumber",
        page === pageNumbers.length
          ? JSON.stringify(page)
          : JSON.stringify(page + 1)
      );
    }
    if(isStoresPage){
      dispatch({type:CLEAR_STORE_ITEMS});
      localStorage.setItem(
        "storePage",
        page === pageNumbers.length
          ? JSON.stringify(page)
          : JSON.stringify(page + 1)
      );
    }

    window.scrollTo(0, 0);
  }

  return (
    <nav className="pagination-wrapper">
      <ul className="pagination">
        <li
          className={
            page === 1
              ? "d-flex-center-center disabled"
              : "d-flex-center-center"
          }
          onClick={leftArrowHandler}
          disabled={page === 1 ? true : false}
        >
          <RiArrowLeftSLine className="text-blue font-md" />
        </li>
        {pagesAroundOfActivePage.map((number, index) => (
          <li
            key={index}
            onClick={() => setActivePageHandler(number)}
            className={
              page === number
                ? "active"
                : number === dotsInitial ||
                  number === dotsLeft ||
                  number === dotsRight
                ? "isNan"
                : "null"
            }
          >
            <a className="d-flex-center-center" href="#!">
              {number}
            </a>
          </li>
        ))}
        <li
          className={
            page === pageNumbers.length
              ? "d-flex-center-center disabled"
              : "d-flex-center-center"
          }
          disabled={page === pageNumbers.length ? true : false}
          onClick={rightArrowHandler}
        >
          <RiArrowRightSLine className="text-blue font-md" />
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
