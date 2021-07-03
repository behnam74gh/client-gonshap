import React, { useCallback, useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import axios from "../../../util/axios";
import { MdDelete, MdEdit } from "react-icons/md";
import defPic from "../../../assets/images/def.jpg";
import { toast } from "react-toastify";
import "./Carousels.css";

const Carousels = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [gettingSuppliersError, setGettingSuppliersError] = useState("");
  const [loading, setLoading] = useState(false);

  const getAllSuppliers = useCallback(
    () =>
      axios
        .get("/all-suppliers")
        .then((response) => {
          setLoading(false);
          if (response.data.success) {
            setSuppliers(response.data.allSuppliers);
            setGettingSuppliersError("");
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response) {
            setGettingSuppliersError(err.response.data.message);
          }
        }),
    []
  );

  useEffect(() => {
    setLoading(true);
    getAllSuppliers();
  }, [getAllSuppliers]);

  const removeSupplierHandler = (slug, owner, backupFor) => {
    if (
      window.confirm(
        `میخواهید تامین کننده محصولات  "${owner}"  را که پشتیبانی محصولات  "${backupFor}"  را انجام میدهد،حذف کنید؟`
      )
    ) {
      axios
        .delete(`/supplier/delete/${slug}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            getAllSuppliers();
          }
        })
        .catch((err) => {
          err.response && toast.error(err.response.data.message);
        });
    }
  };

  return (
    <div className="admin-panel-wrapper">
      <Link
        to="/admin/dashboard/create-carousel"
        className="create-new-slide-link"
      >
        <span className="sidebar-text-link">ایجاد اسلایدشو معرفی فروشگاه</span>
        <GoPlus />
      </Link>
      <hr />
      <h4>لیست فروشگاه های تامین کننده محصولات</h4>
      {gettingSuppliersError.length > 0 && (
        <p className="warning-message">{gettingSuppliersError}</p>
      )}
      {loading ? (
        <VscLoading />
      ) : (
        <div className="table-wrapper">
          {suppliers.length > 0 && (
            <table>
              <thead>
                <tr className="heading-table">
                  <th className="th-titles">تصویر</th>
                  <th className="th-titles">عنوان فروشگاه</th>
                  <th className="th-titles">مالک</th>
                  <th className="th-titles">شماره تلفن مالک</th>
                  <th className="th-titles">پشتیبانی محصولات</th>
                  <th className="th-titles">تلفن ثابت</th>
                  <th className="th-titles">آدرس</th>
                  <th className="th-titles">longitude</th>
                  <th className="th-titles">latitude</th>
                  <th className="th-titles">ویرایش</th>
                  <th className="th-titles">حذف</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length > 0 &&
                  suppliers.map((s, i) => (
                    <tr key={i}>
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
                      <td className="font-sm">{s.title}</td>
                      <td className="font-sm">{s.owner}</td>
                      <td className="font-sm">{s.phoneNumber}</td>
                      <td className="font-sm">{s.backupFor.name}</td>
                      <td className="font-sm">{s.storePhoneNumber}</td>
                      <td className="font-sm">{s.address}</td>
                      <td className="font-sm">{s.longitude}</td>
                      <td className="font-sm">{s.latitude}</td>
                      <td>
                        <Link
                          to={`/admin/dashboard/carousel-update/${s.slug}`}
                          className="d-flex-center-center"
                        >
                          <MdEdit className="text-blue" />
                        </Link>
                      </td>
                      <td>
                        <span
                          className="d-flex-center-center"
                          onClick={() =>
                            removeSupplierHandler(s.slug, s.owner, s.backupFor)
                          }
                        >
                          <MdDelete className="text-red" />
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Carousels;
