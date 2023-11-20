import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { RiSearchLine } from "react-icons/ri";
import { HiBadgeCheck } from "react-icons/hi";
import { TiDelete } from "react-icons/ti";
import { FaEye } from "react-icons/fa";
import axios from "../../../util/axios";
import Pagination from "../../../components/UI/Pagination/Pagination";
import "./Tickets.css";

const Tickets = () => {
  const [ticketsLength, setTicketssLength] = useState();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [orderConfig, setOrderConfig] = useState({
    level: 1,
    visited: false,
    isStoreAdmin: "none",
    status: "none",
  });
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [queryPhoneNumber, setQueryPhoneNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    let config = {};
    switch (orderConfig.level) {
      case 1:
        config = {
          visited : orderConfig.visited,
          ...(orderConfig.isStoreAdmin !== "none" && { senderRole : orderConfig.isStoreAdmin === "true" ? 2 : 3 }),
          ...(orderConfig.status !== "none" && { status : orderConfig.status }),
        };
        break;
      case 2:
        config = {
          visited : orderConfig.visited,
          ...(orderConfig.isStoreAdmin !== "none" && { senderRole : orderConfig.isStoreAdmin === "true" ? 2 : 3 }),
          ...(orderConfig.status !== "none" && { status : orderConfig.status }),
        };
        break;
      case 3:
        config = {
          visited : orderConfig.visited,
          ...(orderConfig.status !== "none" && { status : orderConfig.status }),
          ...(orderConfig.isStoreAdmin !== "none" && { senderRole : orderConfig.isStoreAdmin === "true" ? 2 : 3 }),
        };
        break;
      case 4:
        config = {
          senderPhoneNumber: phoneNumber,
        };
        break;
      default:
        break;
    }

    setLoading(true);
    axios
      .post("/tickets/search/filters", { config, page, perPage })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setTickets(response.data.tickets);
          setTicketssLength(response.data.allCount);
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
  }, [page, perPage, orderConfig, phoneNumber]);

  const searchTicketsByQueryPhoneNumber = () => {
    setOrderConfig({
      level: 4,
      visited: "none",
      isStoreAdmin: "none",
      status: "none",
    });
    setPhoneNumber(queryPhoneNumber);
    setQueryPhoneNumber("");
    setPage(1);
  };
  const searchTicketsByVisitedHandler = (e) => {
    if (e === "none") {
      return;
    }
    setOrderConfig({
      ...orderConfig,
      level: 1,
      visited: e,
    })
    setQueryPhoneNumber("");
    setPage(1);
  };
  const searchTicketsByRoleHandler = (e) => {
    setOrderConfig({
      ...orderConfig,
      level: 2,
      isStoreAdmin: e
    });
    setQueryPhoneNumber("");
    setPage(1);
  };
  const searchTicketsByStatusHandler = (e) => {
    setOrderConfig({
      ...orderConfig,
      level: 3,
      status: e,
    })
    setQueryPhoneNumber("");
    setPage(1);
  };

  const removeTicketHandler = (id) => {
    if (window.confirm("آیا میخواهید این تیکت را حذف کنید؟")) {
      axios
        .delete(`/delete/ticket/${id}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            perPage < 50 ? setPerPage(50) : setPerPage(49);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.warning(err.response.data.message);
          }
        });
    }
  };

  const spreadStatusInSelect = (s) => {
    let status;
    switch (s) {
      case 1:
        status = "نحوه ایجاد سفارش";
        break;
      case 2:
        status = "نحوه پرداخت وجه";
        break;
      case 3:
        status = "بازگشت وجه";
        break;
      case 4:
        status = "پس فرستادن کالا";
        break;
      case 5:
        status = "نحوه تحویل کالا";
        break;
      case 6:
        status = "کیفیت کالا";
        break;
      case 7:
        status = "قیمت کالا";
        break;
      case 8:
        status = "ویرایش اطلاعات حساب کاربری";
        break;
      case 9:
        status = "موارد دیگر";
        break;
      default:
        return;
    }
    return status;
  };

  return (
    <div className="admin-panel-wrapper">
      <h4>فهرست تیکت های دریافتی از کاربران بازارچک</h4>
       
      <div className="table-wrapper">
        <table>
          <thead className="heading-table">
            <tr>
              <th colSpan="2">
                <select
                  value={orderConfig.visited}
                  onChange={(e) =>
                    searchTicketsByVisitedHandler(e.target.value)
                  }
                >
                  <option value="none">براساس (وضعیت مشاهده)</option>
                  <option value={false}>خوانده نشده</option>
                  <option value={true}>خوانده شده</option>
                </select>
              </th>
              <th colSpan="2">
                <select
                  value={orderConfig.isStoreAdmin}
                  onChange={(e) =>
                    searchTicketsByRoleHandler(e.target.value)
                  }
                >
                  <option value="none">براساس (نوع کاربر)</option>
                  <option value={false}>مشتری</option>
                  <option value={true}>فروشنده</option>
                </select>
              </th>
              <th colSpan="2">
                <select
                  value={orderConfig.status}
                  onChange={(e) =>
                    searchTicketsByStatusHandler(e.target.value)
                  }
                >
                  <option value="none">براساس (موضوع)</option>
                  <option value="1">نحوه ایجاد سفارش</option>
                  <option value="2">نحوه پرداخت وجه</option>
                  <option value="3">بازگشت وجه</option>
                  <option value="4">پس فرستادن کالا</option>
                  <option value="5">نحوه تحویل کالا</option>
                  <option value="6">کیفیت کالا</option>
                  <option value="7">قیمت کالا</option>
                  <option value="8">ویرایش اطلاعات حساب کاربری</option>
                  <option value="9">موارد دیگر</option>
                </select>
              </th>
              <th colSpan="4">
                <div className="dashboard-search">
                  <input
                    type="search"
                    value={queryPhoneNumber}
                    placeholder="جستوجوی تیکت براساس شماره موبایل کاربر.."
                    onChange={(e) => setQueryPhoneNumber(e.target.value)}
                  />
                  <span onClick={searchTicketsByQueryPhoneNumber}>
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
              <th className="th-titles">وضعیت</th>
              <th className="th-titles">نوع کاربر</th>
              <th className="th-titles">فرستنده</th>
              <th className="th-titles">موبایل</th>
              <th className="th-titles">موضوع</th>
              <th className="th-titles">عکسِ</th>
              <th className="th-titles">ت.ارسال</th>
              <th className="th-titles">ت.پاسخدهی</th>
              <th className="th-titles">مشاهده</th>
              <th className="th-titles">حذف</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10">
                  <div className="loader_wrapper">
                    <VscLoading className="loader" />
                  </div>
                </td>
              </tr>
            ):tickets.length > 0 ? (
              tickets.map((t) => (
                <tr key={t._id}>
                  <td className="font-sm">
                    <span className="d-flex-center-center">
                      {t.visited ? "مشاهده شد" : "مشاهده نشده"}
                      {t.visited ? (
                        <HiBadgeCheck
                          style={{ marginRight: "5px", color: "#00a800" }}
                        />
                      ) : (
                        <TiDelete
                          style={{ marginRight: "5px", color: "red" }}
                        />
                      )}
                    </span>
                  </td>
                  <td className="font-sm">{t.senderRole === 3 ? "مشتری" : t.senderRole === 2 ? "فروشنده" : "مدیریت"}</td>
                  <td className="font-sm">
                    <Link
                      to={`/admin/dashboard/user/${t.sender._id}`}
                      className="d-flex-center-center"
                    >
                      {`${t.sender.firstName} ${t.sender.lastName}`}
                    </Link>
                    
                  </td>
                  <td className="font-sm">{t.senderPhoneNumber}</td>
                  <td className="font-sm">
                    {spreadStatusInSelect(t.status)}
                  </td>
                  <td className="font-sm">
                    {t.image && t.image.length > 0 ? (
                      <div className="d-flex-center-center">
                        <img
                          className="table-img"
                          src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${t.image}`}
                          alt={t.status}
                        />
                      </div>
                    ) : (
                      "ضمیمه نشده"
                    )}
                  </td>
                  <td className="font-sm">
                    {new Date(t.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="font-sm">
                    {Date.parse(t.createdAt) !== Date.parse(t.updatedAt)
                      ? new Date(t.updatedAt).toLocaleDateString("fa-IR")
                      : "در انتظار پاسخ دهی"}
                  </td>
                  <td className="font-md">
                    <Link
                      to={`/admin/dashboard/ticket/${t._id}`}
                      className="d-flex-center-center"
                    >
                      <FaEye className="font-md text-mute" />
                    </Link>
                  </td>
                  <td className="font-md">
                    <span
                      className="d-flex-center-center"
                      onClick={() => removeTicketHandler(t._id)}
                    >
                      <MdDelete className="text-red" />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">
                  <p
                    className="warning-message"
                    style={{ textAlign: "center" }}
                  >
                    هیچ تیکت پشتیبانی یافت نشد!
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {ticketsLength > perPage && (
          <div>
            <Pagination
              perPage={perPage}
              productsLength={ticketsLength}
              setPage={setPage}
              page={page}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
