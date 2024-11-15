import React, { useEffect, useState } from 'react';
import axios from '../../util/axios';
import StoreCard from '../../components/UI/StoreCard/StoreCard';
import { Helmet } from 'react-helmet-async';
// import { toast } from 'react-toastify';
import Pagination from '../../components/UI/Pagination/Pagination';
import LoadingStoreCard from '../../components/UI/LoadingSkeleton/LoadingStoreCard';
// import { db } from '../../util/indexedDB';
import Section8 from '../../components/Home/Section8/Section8';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_STORE_ITEMS, SAVE_STORE_ITEMS } from '../../redux/Types/storeItemsTypes';
import './Stores.css';

const Stores = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [comparedSuppliers] = useState([]);
  const [errorText, setErrorText] = useState("");
  // const [regions, setRegions] = useState([]);
  const [activeRegion] = useState(localStorage.getItem("activeRegion") || 'all');
  const [storesLength, setStoresLength] = useState(0);
  const [perPage] = useState(window.innerWidth < 450 ? 16 : 30);
  // const [categories, setCategories] = useState([]);
  const [activeCategory] = useState("none");
  const [page, setPage] = useState(
    JSON.parse(localStorage.getItem("storePage")) || 1
  );
  const [firstLoad, setFirstLoad] = useState(true);

  const { storeItems: { items,itemsLength,validTime } } = useSelector(state => state);
  const dispatch = useDispatch();
    
  // const loadAllRegions = () => {
  //   db.regions.toArray().then(items => {
  //     if(items.length > 0){
  //       setRegions(items);
  //     }else{
  //       axios
  //       .get("/get-all-regions")
  //       .then((response) => {
  //         if (response.data.success) {
  //             setRegions(response.data.regions);
  //             db.regions.clear()
  //             db.regions.bulkPut(response.data.regions)
  //         }
  //       })
  //       .catch((err) => {
  //         if (err.response) {
  //           toast.warning(err.response.data.message);
  //         }
  //       });
  //     }
  //   })
  // };

  // const loadAllCategories = () => {
  //   db.activeCategories.toArray().then(items => {
  //     if(items.length > 0){
  //       setCategories(items);
  //     }else{
  //       axios.get("/get-all-categories")
  //       .then((response) => {
  //         if (response.data.success) {
  //           const { categories } = response.data;
  //           if (categories?.length > 0) {
  //             setCategories(categories);
  //           }
  //         }
  //       })
  //       .catch(err => {
  //         if(err){
  //           return;
  //         };
  //       })
  //     }
  //   })
  // }

  useEffect(() => {
    // loadAllRegions();
    // loadAllCategories();
    
    if(items?.length > 0 && firstLoad){
      if(Date.now() < validTime){
        setSuppliers(items);
        setStoresLength(itemsLength);
      }else{
        localStorage.setItem("storePage", 1);
        dispatch({type: CLEAR_STORE_ITEMS});
      }
    }
  }, []);
  
  useEffect(() => {
    if(suppliers.length > 0 && !firstLoad){
      dispatch({
        type: SAVE_STORE_ITEMS,
        payload: {
          items: suppliers,
          length: storesLength
        } 
      })
    }

    if(suppliers.length > 0 && firstLoad){
      setFirstLoad(false);
    }
  }, [suppliers]);

  useEffect(() => {
    if(items.length < 1){
      setLoading(true);
      setErrorText("");
      localStorage.setItem("storePage", page)
      axios
      .post(`/region-suppliers/${activeRegion}`, {
        page,
        perPage,
      })
      .then((response) => {
        if (response.data.success) {
          setLoading(false);
          setFirstLoad(false);
          setStoresLength(response.data.length);
          setSuppliers(response.data.allSuppliers);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
    }
    
  }, [activeRegion,page,items]);
  
  // const defineRegionHandler = (id) => {
  //   setActiveRegion(id);
  //   setActiveCategory("none");
  //   setComparedSuppliers([]);
  //   setPage(1);
  //   localStorage.setItem("activeRegion", id);
  //   localStorage.setItem("storePage", 1);
  //   dispatch({type: CLEAR_STORE_ITEMS});
  // };

  // const changeCategoryHandler = (id) => {
  //   if(id === "none"){
  //     return;
  //   }else if(id === "all"){
  //     setComparedSuppliers([]);
  //     setActiveCategory("none");
  //     return;
  //   }
  //   setActiveCategory(id);
  //   setPage(1);
  //   localStorage.setItem("storePage", 1);
  //   let sameCategorystores = suppliers.filter(store => store.backupFor._id === id);
  //   setComparedSuppliers(sameCategorystores);
  // };
  
  return (
    <>
      <Helmet>
        <title>فهرست فروشگاه ها</title>
        <meta
          name="description"
          content="تمامی فروشگاه های فعال در بستر بازارچک را میتوانید در این صفحه پیدا کنید، همچنین امکان دسته بندی کرده فروشگاه های بازار یک شهر وجود دارد"
        /> 
        <link rel="canonical" href="/stores" />
      </Helmet>

      <p className='stores_title'>فروشگاه های فعال در بازار گنبد کاووس</p>

      {/*<div className='select_region' style={{flexWrap: activeRegion === "all" && window.innerWidth < 600 && "wrap"}}>
        <span className='region_store_status'>
          فروشگاه های بازار هر منطقه :
        </span>
        <select
          className='region_select_store'
          value={activeRegion}
          onChange={(e) => defineRegionHandler(e.target.value)}
        >
          <option value='all'>بازار بزرگ</option>
          {regions.length > 0 &&
            regions.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
        </select>

        {categories?.length > 0 && activeRegion === "all" && 
          <select className="region_select_store" value={activeCategory} onChange={(e) => changeCategoryHandler(e.target.value)}>
            <option value="none">تعیین نوع فروشگاه</option>
            <option value="all">همه فروشگاه ها</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        }
      </div>*/}
      
      <div className='stores_wrapper'> 
        {loading ? (
            <LoadingStoreCard count={window.innerWidth > 450 ? 18 : 8} />
        ) :
        errorText.length > 0 ? <p className="warning-message">{errorText}</p> :
        activeCategory === "none" && suppliers?.length > 0 ? (
            suppliers.map(item => <StoreCard key={item._id} item={item} />)
        ) : activeCategory !== "none" && comparedSuppliers.length > 0 ? (
          comparedSuppliers.map(item => <StoreCard key={item._id} item={item} />)
        ) : <p className='text-mute font-sm'>فروشگاهی وجود ندارد</p>}
      </div>

      {storesLength > perPage && activeCategory === "none" && (
        <Pagination
          perPage={perPage}
          productsLength={storesLength}
          setPage={setPage}
          page={page}
          isStoresPage={true}
        />
      )}

      <Section8 />
    </>
  )
}

export default Stores;