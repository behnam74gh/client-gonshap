import React, { useCallback, useEffect, useState } from "react";
import axios from "../../../util/axios";
import defPic from "../../../assets/images/pro-8.png";
import { VscLoading } from "react-icons/vsc";
import { GiCheckMark } from "react-icons/gi";
import { RiSearchLine } from "react-icons/ri";
import { MdRemoveRedEye } from "react-icons/md";
import Pagination from "../../../components/UI/Pagination/Pagination";
import { toast } from "react-toastify";
import Modal from "../../../components/UI/Modal/Modal";
import "./Suggests.css";

const Suggests = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [suggests, setSuggests] = useState([]);
  const [suggestsLength, setSuggestsLength] = useState(0);
  const [visited, setVisited] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);
  const [queryWriterPhoneNumber, setQueryWriterPhoneNumber] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  //modal
  const [open, setOpen] = useState(false);
  const [modalSuggest, setModalSuggest] = useState();

  const loadAllSuggestByVisitedStatusHandler = useCallback(
    () =>
      axios
        .post("/all-suggests/by-admin-seen-status", {
          status: visited,
          page,
          perPage,
        })
        .then((response) => {
          setLoading(false);
          if (response.data.success) {
            setSuggests(response.data.suggests);
            setSuggestsLength(response.data.allCount);
            setErrorText("");
          }
        })
        .catch((err) => {
          setLoading(false);
          if (typeof err.response.data.message === "object") {
            setErrorText(err.response.data.message[0]);
          } else {
            setErrorText(err.response.data.message);
          }
        }),
    [visited, page, perPage]
  );

  useEffect(() => {
    setLoading(true);
    loadAllSuggestByVisitedStatusHandler();
  }, [loadAllSuggestByVisitedStatusHandler]);

  const changeSuggestStatusHandler = (e, id, validity) => {
    axios
      .put(`/change/current-suggest/status/${id}`, {
        visited: e,
        isValid: validity,
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          let oldSuggests = suggests;
          let newSuggests = oldSuggests.filter((s) => s._id !== id);
          setSuggests(newSuggests);
          setOpen(false);
        }
      })
      .catch((err) => {
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
        setOpen(false);
      });
  };

  const changeValidityStatusHandler = (id, validity) => {
    let isValid;
    if (validity === true) {
      isValid = false;
    } else {
      isValid = true;
    }
    axios
      .put(`/change/this-suggest/validity-status/${id}`, {
        isValid,
      })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          loadAllSuggestByVisitedStatusHandler();
        }
      })
      .catch((err) => {
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });
  };

  const searchSuggestByWriterPhoneNumberHandler = () => {
    setSearchLoading(true);
    axios
      .post("/find/current-user/suggests", { query: queryWriterPhoneNumber })
      .then((response) => {
        setSearchLoading(false);
        if (response.data.success) {
          setSuggests(response.data.suggests);
          setSuggestsLength(0);
          setErrorText("");
          setQueryWriterPhoneNumber("");
        }
      })
      .catch((err) => {
        setSearchLoading(false);
        setSuggests([]);
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });
  };

  return (
    <div className="admin-panel-wrapper">
      {modalSuggest && modalSuggest.content.length > 0 && (
        <Modal open={open} closeHandler={() => setOpen(false)}>
          <div className="modal_comment_wrapper">
            <div className="d-flex-center-center">
              <img
                className="comment_modal_img"
                src={
                  !modalSuggest.writerImage.length
                    ? `${defPic}`
                    : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${modalSuggest.writerImage}`
                }
                alt="تصویر نویسنده پیغام"
              />
            </div>
            <div className="d-flex-center-center mt-3">
              <span className="font-sm">نویسنده پیغام : </span>
              <strong className="font-sm mr-1">
                {modalSuggest.writerName.length > 0
                  ? modalSuggest.writerName
                  : "-"}
              </strong>
            </div>
            <p className="modal_comment_content">
              {modalSuggest && modalSuggest.content}
            </p>
            <div className="modal_comment_btn_wrapper">
              {!modalSuggest.visited && (
                <div className="modal_btn_wrapper">
                  <button
                    onClick={() =>
                      changeSuggestStatusHandler(true, modalSuggest._id, true)
                    }
                    className="modal_btn bg-purple"
                  >
                    تایید پیغام
                  </button>
                </div>
              )}
              {!modalSuggest.visited && (
                <div className="modal_btn_wrapper">
                  <button
                    onClick={() =>
                      changeSuggestStatusHandler(true, modalSuggest._id, false)
                    }
                    className="modal_btn bg-blue"
                  >
                    مشاهده شد
                  </button>
                </div>
              )}
              <div className="modal_btn_wrapper mt-2">
                <button
                  onClick={() =>
                    changeSuggestStatusHandler(false, modalSuggest._id, false)
                  }
                  className="modal_btn bg-orange"
                >
                  حذف پیغام
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <h4>لیست انتقادات و پیشنهادات کاربران</h4>
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <p className="mt-0">
          تعداد
          <strong className="text-blue mx-2">{suggestsLength}</strong> پیغام
          {visited === false && " جدید "} وجود دارد!
        </p>
      )}
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
                <th colSpan="2">
                  <select
                    value={visited}
                    onChange={(e) => {
                      setVisited(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value={false}>جدیدترین پیغام ها</option>
                    <option value={true}>پیغام های تایید شده</option>
                  </select>
                </th>
                <th colSpan="6">
                  <div className="dashboard-search">
                    <input
                      type="search"
                      value={queryWriterPhoneNumber}
                      placeholder="جستوجوی پیغام بر اساس شماره تلفن کاربر.."
                      onChange={(e) =>
                        setQueryWriterPhoneNumber(e.target.value)
                      }
                    />
                    <span onClick={searchSuggestByWriterPhoneNumberHandler}>
                      {searchLoading ? (
                        <VscLoading className="loader" />
                      ) : (
                        <RiSearchLine />
                      )}
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
                <th className="th-titles">تصویرکاربر</th>
                <th className="th-titles">نام و نام خانوادگی</th>
                <th className="th-titles">تلفن همراه</th>
                <th className="th-titles">محتوا</th>
                <th className="th-titles">وضعیت مشاهده</th>
                <th className="th-titles">نمایش</th>
              </tr>
            </thead>
            <tbody>
              {suggests && suggests.length > 0 ? (
                suggests.map((s, i) => (
                  <tr key={i}>
                    <td>
                      <div className="d-flex-center-center">
                        <img
                          className="table-img user_photo"
                          src={
                            !s.writerImage.length
                              ? `${defPic}`
                              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${s.writerImage}`
                          }
                          alt="تصویر نویسنده نظر"
                        />
                      </div>
                    </td>
                    <td className="font-sm">
                      {s.writerName.length > 0 ? s.writerName : "-"}
                    </td>
                    <td className="font-sm">{s.phoneNumber}</td>
                    <td className="font-sm">
                      <span
                        onClick={() => {
                          setOpen(true);
                          setModalSuggest(s);
                        }}
                        className="comment_content_btn"
                      >
                        {s.content.substring(0, 30)}...
                      </span>
                    </td>
                    <td className="font-sm">
                      <div className="d-flex-center-center">
                        {s.visited ? (
                          <GiCheckMark className="text-green font-md" />
                        ) : (
                          <MdRemoveRedEye className="text-mute font-md" />
                        )}
                      </div>
                    </td>
                    <td className="font-sm">
                      {s.visited ? (
                        <input
                          type="checkbox"
                          className="check-task-status"
                          checked={s.isValid ? true : false}
                          onChange={() =>
                            changeValidityStatusHandler(s._id, s.isValid)
                          }
                        />
                      ) : (
                        "پیغام را بخوانید"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <p
                      className="warning-message"
                      style={{ textAlign: "center" }}
                    >
                      پیغامی یافت نشد!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {suggestsLength > perPage && (
            <Pagination
              perPage={perPage}
              productsLength={suggestsLength}
              setPage={setPage}
              page={page}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Suggests;
