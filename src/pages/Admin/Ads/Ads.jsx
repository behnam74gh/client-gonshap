import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import { RiSearchLine } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

import axios from "../../../util/axios";
import defPic from "../../../assets/images/def.jpg";
import Pagination from "../../../components/UI/Pagination/Pagination";

const Ads = () => {
  const [Ads, setAds] = useState([]);
  const [AdsLength, setAdsLength] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("active");
  const [perPage] = useState(20);
  const [queryPhoneNumber, setQueryPhoneNumber] = useState("");

  const defaultOrders = ["active", "reserve", "done", "cancel"];

  useEffect(() => {
    setLoading(true);
    axios
      .post("/ads-list", {
        status: order,
        page,
        perPage,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setAds(response.data.allFoundedAds);
          setAdsLength(response.data.AdsLength);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  }, [page, perPage, order]);

  const searchAdvertiseByPhoneNumber = () =>
    axios
      .post("/ads/search/phone-number", { query: queryPhoneNumber })
      .then((response) => {
        if (response.data.success) {
          setAds(response.data.Ads);
          setAdsLength(response.data.Ads.length);
          setQueryPhoneNumber("");
        }
      })
      .catch((err) => {
        setAds([]);
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });

  return (
    <div className="admin-panel-wrapper">
      <Link
        to="/admin/dashboard/create-advertise"
        className="create-new-slide-link"
      >
        <span className="sidebar-text-link">ایجاد تبلیغ</span>
        <GoPlus />
      </Link>
      <hr />
      <h4>لیست تبلیغات موجود</h4>
      <p className="mt-0">
        براساس این مرتب سازی تعداد{" "}
        <strong className="text-blue">{AdsLength}</strong> تبلیغ وجود دارد
      </p>
      {loading ? (
        <VscLoading className="loader" />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th colSpan="3">
                  <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  >
                    {defaultOrders.map((ds, i) => (
                      <option key={i} value={ds}>
                        {ds === "active"
                          ? "فعال ها"
                          : ds === "reserve"
                          ? "رزرو ها"
                          : ds === "done"
                          ? "پایان یافته ها"
                          : "لغو شده ها"}
                      </option>
                    ))}
                  </select>
                </th>
                <th colSpan="9">
                  <div className="dashboard-search">
                    <input
                      type="search"
                      value={queryPhoneNumber}
                      placeholder="جستوجوی تبلیغ بر اساس شماره موبایل.."
                      onChange={(e) => setQueryPhoneNumber(e.target.value)}
                    />
                    <span onClick={searchAdvertiseByPhoneNumber}>
                      <RiSearchLine />
                    </span>
                  </div>
                </th>
              </tr>
              <tr
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th className="th-titles">تصویر</th>
                <th className="th-titles">عنوان</th>
                <th className="th-titles">مالک</th>
                <th className="th-titles">تلفن همراه</th>
                <th className="th-titles">از تاریخ</th>
                <th className="th-titles">تا تاریخ</th>
                <th className="th-titles">مدت</th>
                <th className="th-titles">هزینه</th>
                <th className="th-titles">سطح</th>
                <th className="th-titles">وضعیت</th>
                <th className="th-titles">لینکِ آدرس</th>
                <th className="th-titles">ویرایش</th>
              </tr>
            </thead>
            <tbody>
              {Ads.length > 0 ? (
                Ads.map((ad) => (
                  <tr key={ad._id}>
                    <td>
                      <div className="d-flex-center-center">
                        <img
                          className="table-img"
                          src={
                            !ad.photos.length
                              ? `${defPic}`
                              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ad.photos[0]}`
                          }
                          alt={ad.title}
                        />
                      </div>
                    </td>
                    <td className="font-sm">{ad.title}</td>
                    <td className="font-sm">{ad.owner}</td>
                    <td className="font-sm">{ad.phoneNumber}</td>
                    <td className="font-sm">
                      {new Date(ad.dateFrom).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="font-sm">
                      {new Date(ad.dateTo).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="font-sm">{ad.days}&nbsp;روز</td>
                    <td className="font-sm">
                      {ad.advertisesCost
                        ? ad.advertisesCost.toLocaleString("fa")
                        : "0"}
                      &nbsp;تومان
                    </td>
                    <td className="font-sm">{ad.level}</td>
                    <td className="font-sm">
                      {ad.status === "active"
                        ? "فعال"
                        : ad.status === "reserve"
                        ? "رزرو"
                        : ad.status === "done"
                        ? "اتمام"
                        : "لغو شد"}
                    </td>
                    <td className="font-sm">
                      {ad.linkAddress.length > 0 ? ad.linkAddress : "-"}
                    </td>
                    <td>
                      <Link
                        to={`/admin/dashboard/advertise-update/${ad.slug}`}
                        className="d-flex-center-center"
                      >
                        <MdEdit className="text-blue" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13">
                    <p
                      className="warning-message"
                      style={{ textAlign: "center" }}
                    >
                      تبلیغی یافت نشد!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {Ads.length > perPage && (
            <Pagination
              perPage={perPage}
              productsLength={AdsLength}
              setPage={setPage}
              page={page}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Ads;
