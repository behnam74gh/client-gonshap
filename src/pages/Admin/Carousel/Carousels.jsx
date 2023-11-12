import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import axios from "../../../util/axios";
import { MdEdit } from "react-icons/md";
import defPic from "../../../assets/images/def.jpg";
import { toast } from "react-toastify";
import { HiBadgeCheck } from "react-icons/hi";
import { TiDelete } from "react-icons/ti";
import Pagination from "../../../components/UI/Pagination/Pagination";
import { RiSearchLine } from "react-icons/ri";
import "./Carousels.css";

const Carousels = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [gettingSuppliersError, setGettingSuppliersError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [supplierslength,setSuppliersLength] = useState(0);
  const [queryPhoneNumber, setQueryPhoneNumber] = useState("");
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState({
    region: "none",
    isBan: "none",
    backupFor: "none",
    authentic: "none",
  });
  const [query,setQuery] = useState({
    order: "all",
    config: null
  });

  const getCategoreis = () => {
    axios
      .get("/get-all-categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((err) => {
        if (err.response) {
          toast.warning(err.response.data.message);
        }
      });
  }

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
    getCategoreis()
    loadAllRegions()
  }, [])
  
  useEffect(() => {
    setLoading(true);
    axios
    .post("/all-suppliers",{
      page,
      perPage,
      order: query.order,
      config: query.config,
    })
    .then((response) => {
      setLoading(false);
      if (response.data.success) {
        setSuppliers(response.data.allSuppliers);
        setSuppliersLength(response.data.length)
        setGettingSuppliersError("");
      }
    })
    .catch((err) => {
      setLoading(false);
      if (err.response) {
        setGettingSuppliersError(err.response.data.message);
      }
    })
  }, [page,perPage,query]);

  const toggleSupplierActivityHandler = (s) => {
   const { owner, backupFor,_id,phoneNumber,isBan} = s 
    if (
      window.confirm(
        `میخواهید فروشگاه شخص  "${owner}"  را که پشتیبانی محصولات  "${backupFor.name}"  را انجام میدهد،"${isBan ? "فعال" : "غیرفعال"}" کنید؟`
      )
    ) {
      axios
        .put(`/supplier/toggle-supplier-activity`,{id: _id,isBan: !s.isBan,phoneNumber})
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
          }
        })
        .catch((err) => {
          err.response && toast.error(err.response.data.message);
        });
    }
  };

  const searchUserByPhoneNumber = () => {
    setLoading(true)
    setSuppliersLength(0)
    setValue({
      authentic: "none",
      isBan: "none",
      region: "none",
      backupFor: "none",
    })
    axios
    .post("/supplier/search/phone-number", { query: queryPhoneNumber })
    .then((response) => {
      setLoading(false)
      if (response.data.success) {
        setSuppliers([response.data.allSuppliers]);
      }
    })
    .catch((err) => {
      setLoading(false)
      setSuppliers([]);
      if (typeof err.response.data.message === "object") {
        toast.warning(err.response.data.message[0]);
      } else {
        toast.warning(err.response.data.message);
      }
    });
  }

  const changeOrderConfigHandler = (name,value) => {
    if(value === "none"){
      return;
    }
  
    switch (name) {
      case "region":
        setValue({
          region: value,
          isBan: "none",
          backupFor: "none",
          authentic: "none",
        })
        break;
      case "backupFor":
        setValue({
          region: "none",
          isBan: "none",
          backupFor: value,
          authentic: "none",
        })
        break;
      case "authentic":
        setValue({
          region: "none",
          isBan: "none",
          backupFor: "none",
          authentic: value,
        })
        break;
      case "isBan":
        setValue({
          region: "none",
          isBan: value,
          backupFor: "none",
          authentic: "none",
        })
        break;
      default:
        break;
    }

    setQuery({
      order: name,
      config: value
    })
    setPage(1)
    setQueryPhoneNumber("")
    setSuppliersLength(0)
  }

  return (
    <div className="admin-panel-wrapper">
      <Link
        to="/admin/dashboard/create-carousel"
        className="create-new-slide-link"
      >
        <span className="sidebar-text-link">ایجاد فروشگاه</span>
        <GoPlus />
      </Link>
      <hr />
      <h4>فهرست فروشگاه های تامین کننده محصولات</h4>
      {gettingSuppliersError.length > 0 && (
        <p className="warning-message">{gettingSuppliersError}</p>
      )}
      
      <div className="table-wrapper">
        
        <table>
          <thead>
            <tr
              style={{
                backgroundColor: "var(--firstColorPalete)",
                color: "white",
              }}
            >
              <th colSpan="4">
                <div className="dashboard-search">
                  <input
                    type="search"
                    value={queryPhoneNumber}
                    placeholder="تلفن همراه کاربر.."
                    onChange={(e) => setQueryPhoneNumber(e.target.value)}
                  />
                  <span onClick={searchUserByPhoneNumber}>
                    <RiSearchLine />
                  </span>
                </div>
              </th>
              <th colSpan="2">
                <select
                  name="region"
                  value={value.region}
                  onChange={(e) => changeOrderConfigHandler("region", e.target.value)}
                >
                  <option value="none">براساس منطقه (شهر)</option>
                  {regions?.length > 0 && regions.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                </select>
              </th>
              <th colSpan="2">
                <select
                  name="backupFor"
                  value={value.backupFor}
                  onChange={(e) => changeOrderConfigHandler("backupFor", e.target.value)}
                >
                  <option value="none">براساس دسته بندی</option>
                  {categories?.length > 0 && categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </th>
              <th colSpan="2">
                <select
                  name="authentic"
                  value={value.authentic}
                  onChange={(e) => changeOrderConfigHandler("authentic", e.target.value)}
                >
                  <option value="none">براساس تیک آبی</option>
                  <option value={true}>دارند</option>
                  <option value={false}>ندارند</option>
                </select>
              </th>
              <th colSpan="2">
                <select
                  name="isBan"
                  value={value.isBan}
                  onChange={(e) => changeOrderConfigHandler("isBan", e.target.value)}
                >
                  <option value="none">براساس فعال بودن</option>
                  <option value={false}>فعال ها</option>
                  <option value={true}>مسدود ها</option>
                </select>
              </th>
            </tr>

            <tr className="heading-table" style={{
                backgroundColor: "var(--firstColorPalete)",
                color: "white",
            }}>
              <th className="th-titles">تصویر</th>
              <th className="th-titles">عنوان فروشگاه</th>
              <th className="th-titles">عکس مالک</th>
              <th className="th-titles">مالک</th>
              <th className="th-titles">شماره تلفن مالک</th>
              <th className="th-titles">پشتیبانی محصولات</th>
              <th className="th-titles">تلفن ثابت</th>
              <th className="th-titles">منطقه (شهر)</th>
              <th className="th-titles">آدرس</th>
              <th className="th-titles">فروش</th>
              <th className="th-titles">ویرایش</th>
              <th className="th-titles">فعالیت</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <VscLoading className="loader" />
            ) : suppliers.length > 0 ?
              suppliers.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="d-flex-center-center">
                      <img
                        className="table-img"
                        src={
                          !s.photos.length
                            ? `${defPic}`
                            : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${s.photos[0]}`
                        }
                        alt={s.title}
                      />
                    </div>
                  </td>
                  <td className="font-sm">{s.title}{s.authentic && <HiBadgeCheck style={{verticalAlign: "bottom"}} className="text-blue font-md mr-1" />}</td>
                  <td className="font-sm">
                    <div className="d-flex-center-center">
                        <img
                          className="table-img"
                          style={{borderRadius: "50%"}}
                          src={
                            !s.photos.length
                              ? `${defPic}`
                              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${s.ownerImage}`
                          }
                          alt={s.title}
                        />
                      </div>  
                  </td>
                  <td className="font-sm">{s.owner}</td>
                  <td className="font-sm">{s.phoneNumber}</td>
                  <td className="font-sm">{s.backupFor.name}</td>
                  <td className="font-sm">{s.storePhoneNumber}</td>
                  <td className="font-sm">{s.region.name}</td>
                  <td className="font-sm">{s.address}</td>
                  <td className="font-sm">
                    {s.soldCount > 999 ? (s.soldCount/1000).toFixed(1) : s.soldCount}
                    {s.soldCount > 999 && <span className='ml-1'>K</span>}
                  </td>
                  <td>
                    <Link
                      to={`/admin/dashboard/carousel-update/${s.slug}`}
                      className="d-flex-center-center"
                    >
                      <MdEdit className="text-blue" />
                    </Link>
                  </td>
                  <td>
                    {s.isBan ? <span
                      className="d-flex-center-center"
                      onClick={() =>
                        toggleSupplierActivityHandler(s)
                      }
                    >
                      <TiDelete className="text-red" />
                    </span> : <span
                      className="d-flex-center-center"
                      onClick={() =>
                        toggleSupplierActivityHandler(s)
                      }
                    >
                      <HiBadgeCheck className="text-green" />
                    </span>}
                    
                  </td>
                </tr>
              )) : <tr><td colSpan={12}><p className="warning-message">فروشگاهی یافت نشد</p></td></tr>}
          </tbody>
        </table>
        

        {supplierslength > perPage && (
          <Pagination
            perPage={perPage}
            productsLength={supplierslength}
            setPage={setPage}
            page={page}
          />
        )}
      </div>
    </div>
  );
};

export default Carousels;
