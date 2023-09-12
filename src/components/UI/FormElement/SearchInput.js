import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  SEARCH_QUERY,
  SUBMIT_QUERY,
} from "../../../redux/Types/searchInputTypes";
import { useHistory } from "react-router-dom";
import axios from "../../../util/axios";
import "./SearchInput.css";
import { toast } from "react-toastify";

const SearchInput = () => {
  const [productsName, setProductsName] = useState([]);
  const [showSuggests, setShowSuggests] = useState(false);

  const { search: {text},isOnline } = useSelector((state) => ({...state}));
  
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("/fetch/all-products-name")
      .then((response) => {
        const { success, productsName } = response.data;
        if (success) {
          setProductsName(productsName);
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.message);
        }
      });
  }, []);

  const setKeywordHandler = (e) => {
    dispatch({ type: SEARCH_QUERY, payload: { keyword: e } });
    if (e.length > 0) {
      setShowSuggests(true);
    } else {
      setShowSuggests(false);
    }
  };

  const submitSearchKeywordHandler = () => {
    if (!isOnline){
      toast.warning('شما به اینترنت دسترسی ندارید')
      return
    }
    if (text.length > 2) {
      dispatch({ type: SUBMIT_QUERY });
      history.push("/shop");
    } else {
      toast.info("محصولی بااین نام وجود ندارد");
    }
  };

  const setTextToInputHandler = (name) => {
    dispatch({ type: SEARCH_QUERY, payload: { keyword: name } });
    setShowSuggests(false);
  };

  const searched = (text) => (name) => name.toLowerCase().includes(text);

  return (
    <React.Fragment>
      <div className="search_input_wrapper">
        <input
          value={text}
          type="search"
          placeholder="جستوجو.."
          onChange={(e) => setKeywordHandler(e.target.value)}
        />

        {productsName.length > 0 && showSuggests && (
          <ul className="suggestions_wrapper">
            {productsName.filter(searched(text)).length > 0 ? (
              productsName.filter(searched(text)).map((name, i) => (
                <li onClick={() => setTextToInputHandler(name)} key={i}>
                  {name}
                </li>
              ))
            ) : (
              <li className="font-sm">موردی وجود ندارد</li>
            )}
          </ul>
        )}
      </div>

      <span className="search-icon" onClick={submitSearchKeywordHandler}>
        <RiSearchLine />
      </span>
    </React.Fragment>
  );
};

export default SearchInput;
