import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { RiSearchLine } from "react-icons/ri";
import { VscLoading, VscZoomIn } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "../../util/axios";
import Pagination from "../UI/Pagination/Pagination";

const ListOfSentSMS = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [orderConfig, setOrderConfig] = useState(0);
  const [perPage, setPerPage] = useState(50);
  const [queryGroupId, setQueryGroupId] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLength, setMessagesLength] = useState();

  useEffect(() => {
    setLoading(true);
    let sortCon;
    let orderCon;
    switch (orderConfig) {
      case "1":
        sortCon = "level";
        orderCon = "one";
        break;
      case "2":
        sortCon = "level";
        orderCon = "many";
        break;
      case "3":
        sortCon = "level";
        orderCon = "all";
        break;
      default:
        sortCon = "createdAt";
        orderCon = "desc";
        break;
    }

    axios
      .post("/sms-list", {
        sort: sortCon,
        order: orderCon,
        page,
        perPage,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setMessages(response.data.allMessages);
          setMessagesLength(response.data.messagesLength);
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
  }, [page, perPage, orderConfig]);

  const searchMessagesHandler = (e) => {
    setOrderConfig(e);
    setPage(1);
  };

  const searchMessagesByGroupId = () =>
    axios
      .get(`/sms/search/${queryGroupId}`)
      .then((response) => {
        if (response.data.success) {
          setMessages([response.data.message]);
          setQueryGroupId("");
        }
      })
      .catch((err) => {
        setMessages([]);
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });

  const removeMessageHandler = (_id) => {
    if (window.confirm("میخواهید این پیامک را حذف کنید؟")) {
      axios
        .delete(`/sms/delete/${_id}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            perPage < 50 ? setPerPage(50) : setPerPage(49);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };

  const getSentStatusHandler = (id, groupId) =>
    axios
      .put(`/sms/update-status/${id}`, { groupId })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          perPage < 50 ? setPerPage(50) : setPerPage(49);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });

  return (
    <div className="w-100">
      {loading ? (
        <VscLoading />
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
                <th colSpan="2">
                  <select
                    value={orderConfig}
                    onChange={(e) => searchMessagesHandler(e.target.value)}
                  >
                    <option value="0">آخرین پیامک ها</option>
                    <option value="1">پیامک های تکی</option>
                    <option value="2">پیامک های گروهی</option>
                    <option value="3">پیامک های کلی</option>
                  </select>
                </th>
                <th colSpan="9">
                  <div className="dashboard-search">
                    <input
                      type="search"
                      value={queryGroupId}
                      placeholder="جستوجوی پیامک بر اساس کد رهگیری.."
                      onChange={(e) => setQueryGroupId(e.target.value)}
                    />
                    <span onClick={searchMessagesByGroupId}>
                      <RiSearchLine />
                    </span>
                  </div>
                </th>
              </tr>
              <tr
                className="heading-table"
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th className="th-titles">کد رهگیری</th>
                <th className="th-titles">دسته بندی</th>
                <th className="th-titles">محتوا</th>
                <th className="th-titles">مخاطب ها</th>
                <th className="th-titles">تاریخ ارسال</th>
                <th className="th-titles">وضعیت تحویل</th>
                <th className="th-titles">مشاهده</th>
                <th className="th-titles">حذف</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <tr key={i}>
                    <td className="font-sm">{m.groupId}</td>
                    <td className="font-sm">
                      {m.level === "one"
                        ? "تکی"
                        : m.level === "many"
                        ? "گروهی"
                        : "همه اعضا"}
                    </td>
                    <td className="font-sm">
                      {m.messageContent.substring(0, 15)}...
                    </td>
                    <td className="font-sm">
                      {m.contacts.length > 1
                        ? `${m.contacts[0]},...`
                        : !m.contacts.length
                        ? "همه اعضا"
                        : m.contacts}
                    </td>
                    <td className="font-sm">
                      {new Date(m.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="font-sm">
                      {m.sentStatusCode === "1" ? (
                        "ارسال شد"
                      ) : m.sentStatusCode === "2" ? (
                        "در صف انتظلر"
                      ) : m.sentStatusCode === "3" ? (
                        "فیلتر شد"
                      ) : (
                        <span
                          className="d-flex-center-center"
                          onClick={() => getSentStatusHandler(m._id, m.groupId)}
                        >
                          <VscZoomIn />
                        </span>
                      )}
                    </td>
                    <td className="font-sm">
                      <Link
                        to={`/admin/dashboard/sms/${m._id}`}
                        className="d-flex-center-center"
                      >
                        <FaEye className="font-md text-mute" />
                      </Link>
                    </td>
                    <td className="font-sm">
                      <span
                        className="d-flex-center-center"
                        onClick={() => removeMessageHandler(m._id)}
                      >
                        <MdDelete className="text-red" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">
                    <p
                      className="warning-message"
                      style={{ textAlign: "center" }}
                    >
                      پیامکی یافت نشد!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {messagesLength > perPage && (
            <Pagination
              perPage={perPage}
              productsLength={messagesLength}
              setPage={setPage}
              page={page}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ListOfSentSMS;
