import React, { useEffect, useState,useRef } from "react";
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

  const { search: {text} } = useSelector((state) => ({...state}));
  const inputRef = useRef()
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    const ac = new AbortController()
    axios
      .get("/fetch/all-products-name",{signal: ac.signal})
      .then((response) => {
        const { success, productsName } = response.data;
        if (success) {
          setProductsName(productsName);
        }
      })
      .catch(err => {
        if(err){
          setProductsName([])
        }
      })

      return () => {
        ac.abort()
      }
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
    setShowSuggests(false);
    if (!navigator.onLine){
      toast.warning('شما به اینترنت دسترسی ندارید')
      return
    }
    if (text.length > 2) {
      dispatch({ type: SUBMIT_QUERY });
      inputRef.current.blur()
      history.push("/shop");
    } else {
      toast.info("محصولی بااین نام وجود ندارد");
    }
  };

  const keyPressedHandler = (e) => {
    if(e.keyCode === 13){
      submitSearchKeywordHandler()
    };
  }

  const setTextToInputHandler = (name) => {
    dispatch({ type: SEARCH_QUERY, payload: { keyword: name } });
    setShowSuggests(false);
    inputRef.current.focus()
  };

  const searched = (text) => (name) => name.toLowerCase().includes(text);

  return (
    <React.Fragment>
      <div className="search_input_wrapper">
        <input
          value={text}
          ref={inputRef}
          type="search"
          placeholder="جستوجو.."
          onChange={(e) => setKeywordHandler(e.target.value)}
          onKeyDown={(e) => keyPressedHandler(e)}
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
              <li className="font-sm">کالایی با این نام وجود ندارد</li>
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
