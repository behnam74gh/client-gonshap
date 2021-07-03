import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import { MdEdit } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";
import { toast } from "react-toastify";

import axios from "../../../util/axios";
import defPic from "../../../assets/images/pro-8.png";
import Pagination from "../../../components/UI/Pagination/Pagination";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("1");
  const [perPage] = useState(50);
  const [queryPhoneNumber, setQueryPhoneNumber] = useState("");
  const [queryFirstName, setQueryFirstName] = useState("");

  useEffect(() => {
    setLoading(true);
    let sortConfig;
    let orderConfig;

    if (order === "1") {
      sortConfig = "createdAt";
      orderConfig = "desc";
    } else {
      sortConfig = "createdAt";
      orderConfig = "asc";
    }

    axios
      .post("/all-gonshap/users", {
        sort: sortConfig,
        order: orderConfig,
        page,
        perPage,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setUsers(response.data.gonshapUsers);
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

  const searchUserByPhoneNumber = () =>
    axios
      .post("/users/search/phone-number", { query: queryPhoneNumber })
      .then((response) => {
        if (response.data.success) {
          setUsers([response.data.wantedUser]);
          setQueryPhoneNumber("");
        }
      })
      .catch((err) => {
        setUsers([]);
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });

  const searchUserByFirstName = () =>
    axios
      .post("/users/search/first-name", { query: queryFirstName })
      .then((response) => {
        if (response.data.success) {
          response.data.wantedUsers.length > 1
            ? setUsers(response.data.wantedUsers)
            : setUsers([response.data.wantedUsers[0]]);
          setQueryFirstName("");
        }
      })
      .catch((err) => {
        setUsers([]);
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });

  return (
    <div className="admin-panel-wrapper">
      <h4>فهرست اعضای گُنشاپ</h4>
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
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                  >
                    <option value="1">براساس جدیدترین اعضا</option>
                    <option value="2">براساس قدیمی ترین اعضا</option>
                  </select>
                </th>
                <th colSpan="3">
                  <div className="dashboard-search">
                    <input
                      type="search"
                      value={queryFirstName}
                      placeholder="نام کاربر.."
                      onChange={(e) => setQueryFirstName(e.target.value)}
                    />
                    <span onClick={searchUserByFirstName}>
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
                <th className="th-titles">نام</th>
                <th className="th-titles">نام خانوادگی</th>
                <th className="th-titles">تلفن همراه</th>
                <th className="th-titles">کد کاربری</th>
                <th className="th-titles">وضعیت فعالیت</th>
                <th className="th-titles">ویرایش</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u, i) => (
                  <tr key={i}>
                    <td className="font-sm">
                      <div className="d-flex-center-center">
                        <img
                          className="table-img user_photo"
                          src={
                            !u.image
                              ? `${defPic}`
                              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${u.image}`
                          }
                          alt={u.firstName}
                        />
                      </div>
                    </td>
                    <td className="font-sm">{u.firstName}</td>
                    <td className="font-sm">{u.lastName}</td>
                    <td className="font-sm">{u.phoneNumber}</td>
                    <td className="font-sm">{u._id}</td>

                    <td className="font-sm">
                      {u.isBanned === false ? "فعال" : "مسدود"}
                    </td>
                    <td className="font-sm">
                      <Link
                        to={`/admin/dashboard/user/${u._id}`}
                        className="d-flex-center-center"
                      >
                        <MdEdit className="text-blue" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <p
                      className="warning-message"
                      style={{ textAlign: "center" }}
                    >
                      کاربری یافت نشد!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {users.length > perPage && (
            <Pagination
              perPage={perPage}
              productsLength={users.length}
              setPage={setPage}
              page={page}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
