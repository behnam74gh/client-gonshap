import React, { useEffect, useState,useRef } from "react";
import { RiSearchLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  SEARCH_QUERY,
  SUBMIT_QUERY,
  SUGGEST_OPEN,
  SUGGEST_CLOSE,
  PUSH_QUERY,
  UNSUBMIT,
  TOGGLE_SEARCH_OPTION,
  UNSUBMIT_QUERY,
} from "../../../redux/Types/searchInputTypes";
import { useHistory } from "react-router-dom";
import axios from "../../../util/axios";
import { toast } from "react-toastify";
import { searchByUserFilter } from "../../../redux/Actions/shopActions";
import { VscLoading } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import { PUSH_ITEM } from "../../../redux/Types/searchedItemTypes";
import "./SearchInput.css";

const SearchInput = () => {
  const [searchableItems, setSearchableItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allowToWrite, setAllowToWrite] = useState(true);
  const [products, setProducts] = useState([]);
  const [config,setConfig] = useState({
    id: null,
    type: null,
    parent: null
  });

  const { search: { text,dropdown,submited,searchByText } } = useSelector((state) => ({...state}));
  const btnRef = useRef();
  const inputRef = useRef();
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    const ac = new AbortController()
    axios
      .get("/fetch/all-products-name",{signal: ac.signal})
      .then((response) => {
        const { success, searchableItems } = response.data;
        if (success) {
          setSearchableItems(searchableItems)
        }
      })
      .catch(err => {
        if(err){
          return;
        }
      })

      return () => {
        ac.abort()
      }
  }, []);

  const setKeywordHandler = (e) => {
    dispatch({ type: SEARCH_QUERY, payload: { keyword: e } });
    setAllowToWrite(true);

    if (e.length > 0) {
      dispatch({type: SUGGEST_OPEN})
    } else {
      dispatch({type: SUGGEST_CLOSE})
    }
    setConfig({
      id: null,
      type: null,
      parent: null
    })
  };

  useEffect(() => {
    if(!dropdown && text.length > 0){
      inputRef.current.blur()
    }
  }, [dropdown])

  useEffect(() => {
    if([1,2].includes(config.type)){
      dispatch({type: TOGGLE_SEARCH_OPTION, payload: false});
      btnRef.current.click()
    }
  }, [config.type])
  

  useEffect(() => {
    setLoading(true);
    const delayed = setTimeout(() => {   
      if(text.length > 0 && allowToWrite){   
        axios
          .post("/fetch-products/by-user-filter", {
            searchConfig: text,
            page: 1,
            perPage: 40,
          })
          .then((response) => {
            setLoading(false);
            const { success, foundedProducts } = response.data;
            if (success) {
              setProducts(foundedProducts);
            }
          })
          .catch((err) => {
            setLoading(false);
            setProducts([]);
            if (err.response) {
              dispatch({ type: UNSUBMIT_QUERY });
              toast.warning(err.response.data.message)
              return;
            }
          });
        
        submited && dispatch({type: UNSUBMIT});
        !searchByText && dispatch({type: TOGGLE_SEARCH_OPTION, payload: true});
      }
    },1000)

    return () => clearTimeout(delayed)
  }, [text])

  const submitSearchKeywordHandler = () => {
    dispatch({type: SUGGEST_CLOSE})
  
    if (!navigator.onLine){
      toast.warning('شما به اینترنت دسترسی ندارید')
      return
    }
   
    if (text.length > 1) {
      switch (config.type) {
        case 1:
          submited && dispatch({type: UNSUBMIT})
          dispatch(
            searchByUserFilter({
              level: 1,
              order: "createdAt",
              subcategory: config.id,
              category: config.parent,
            })
          );
          break;
        case 2:
          submited && dispatch({type: UNSUBMIT})
          dispatch(
            searchByUserFilter({
              level: 2,
              order: "createdAt",
              category: config.id,
            })
          )
          break;
        default:
          dispatch({ type: SUBMIT_QUERY });
          break;
      }
      setConfig({
        id: null,
        type: null,
        parent: null
      })
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

  const setTextToInputHandler = (item) => {
    dispatch({ type: PUSH_QUERY, payload: { keyword: item.title } });
    setAllowToWrite(false)
    setConfig({
      id: item.id,
      type: item.type,
      parent: item.parentId || null
    })    

  };
  const focusToInputHandler = () => {
    if((searchableItems.length > 0 || products.length > 0) && text.length > 0){
      dispatch({type: SUGGEST_OPEN})
      loading && setLoading(false)
    }
  }
  const searched = (text) => (item) => item.title.toLowerCase().includes(text);
  const pushSearchedProductHandler = (productItem) => {
    dispatch({
      type: PUSH_ITEM,
      payload: productItem
    })
    dispatch({type: SUGGEST_CLOSE})
  }

  return (
    <React.Fragment>
      <div className="search_input_wrapper">
        <input
          value={text}
          ref={inputRef}
          type="search"
          placeholder="نام کالا را بنویسید.."
          onFocus={focusToInputHandler}
          onChange={(e) => {
            if(!/[~`@#$%^&()_={}[\]:;÷|"';×*,<>+/?]/.test(e.target.value)){
              setKeywordHandler(e.target.value)
            }else{
              toast.warning('نوشته نامعتبر است');
              dispatch({ type: UNSUBMIT_QUERY });
            }
          }}
          onKeyDown={(e) => keyPressedHandler(e)}
        />

        {(searchableItems.length > 0 || products.length > 0) && dropdown && (
          <ul className="suggestions_wrapper">
            {loading ? (
              <li className="text-center">
                <VscLoading className="loader font-md" color="var(--secondColorPalete)" />
              </li>
            ) : products.length > 0 ? (
              products.map(product => <li key={product._id}>
                <Link className="d-flex-between" onClick={() => pushSearchedProductHandler(product)} to={`/product/details/${product._id}`}>
                  <span className="text-orange font-sm">{product.title}</span>
                  <img
                    className="searched_img"
                    src={
                      product.photos.length > 0
                        && `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${product.photos[0]}`
                    }
                    alt={product.title}
                  />
                </Link>
              </li>)
            ):
             searchableItems.filter(searched(text)).length > 0 ? (
              searchableItems.filter(searched(text)).map((item) => (
                <li onClick={() => setTextToInputHandler(item)} key={item.id}>
                  {item.title}
                </li>
              ))
            ): (
              <li className="font-sm text-center">کالایی با این مشخصات یافت نشد</li>
            )}

            <li className="persisted_search_item_container">
              <span className="persisted_search_item_title">محبوبترین جستوجو ها : </span>
              <div className="persisted_search_item_wrapper">
                {searchableItems.filter(item => item.type === 2).map(item => (
                  <span className="persisted_search_item" onClick={() => setTextToInputHandler(item)} key={item.id}>
                    {item.title}
                  </span>
                ))}
              </div>
            </li>
          </ul>
        )}
      </div>

      <span className="search-icon" ref={btnRef} onClick={submitSearchKeywordHandler}>
        <RiSearchLine />
      </span>
    </React.Fragment>
  );
};

export default SearchInput;
