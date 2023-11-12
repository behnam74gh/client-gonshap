import React, { useEffect, useState } from 'react';
import axios from '../../util/axios';
import StoreCard from '../../components/UI/StoreCard/StoreCard';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import Pagination from '../../components/UI/Pagination/Pagination';
import LoadingStoreCard from '../../components/UI/LoadingSkeleton/LoadingStoreCard';
import './Stores.css';

const Stores = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [regions, setRegions] = useState([]);
  const [activeRegion, setActiveRegion] = useState(localStorage.getItem("activeRegion") || 'all');
  const [storesLength, setStoresLength] = useState(0);
  const [perPage, setPerPage] = useState(30);
  const [page, setPage] = useState(
    JSON.parse(localStorage.getItem("storePage")) || 1
  );

  const loadAllRegions = () => {
    axios
      .get("/get-all-regions")
      .then((response) => {
        if (response.data.success) {
            setRegions(response.data.regions);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.warning(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    loadAllRegions()
    if (window.innerWidth < 450) {
      setPerPage(16);
    }
  }, [])

  useEffect(() => {
    setLoading(true)
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
        setSuppliers(response.data.allSuppliers);
        setStoresLength(response.data.length)
      }
    })
    .catch((err) => {
      setLoading(false);
      if (err.response) {
        setErrorText(err.response.data.message);
      }
    });
  }, [activeRegion,page,perPage])
  
  const defineRegionHandler = (id) => {
    setActiveRegion(id)
    setPage(1)
    localStorage.setItem("activeRegion", id)
    localStorage.setItem("storePage", 1)
  }


  return (
    <>
      <Helmet>
          <title>فهرست فروشگاه ها</title>
      </Helmet>

      <div className='select_region'>
        <span className='region_store_status'>
          مشاهده فروشگاه های بازار هر منطقه :
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
      </div>
      
      <div className='stores_wrapper'> 
        {loading ? (
            <LoadingStoreCard count={window.innerWidth > 450 ? 18 : 8} />
        ) :
        errorText.length > 0 ? <p className="warning-message">{errorText}</p> :
        suppliers?.length > 0 ? (
            suppliers.map(item => <StoreCard key={item._id} item={item} />)
        ) : <p className='text-mute font-sm'>فروشگاهی وجود ندارد</p>}
      </div>

      {storesLength > perPage && (
        <Pagination
          perPage={perPage}
          productsLength={storesLength}
          setPage={setPage}
          page={page}
        />
      )}
    </>
  )
}

export default Stores