import React, { useEffect, useState } from "react";
import axios from "../../../util/axios";
import defPic from "../../../assets/images/pro-8.png";
import { VscLoading } from "react-icons/vsc";
import { GiCheckMark } from "react-icons/gi";
import { RiSearchLine } from "react-icons/ri";
import { MdRemoveRedEye } from "react-icons/md";
import Pagination from "../../../components/UI/Pagination/Pagination";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Modal from "../../../components/UI/Modal/Modal";
import "./CommentsList.css";

const CommentsList = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLength, setCommentsLength] = useState(0);
  const [commentsStatus, setCommentsStatus] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);
  const [queryWriterId, setQueryWriterId] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  //modal
  const [open, setOpen] = useState(false);
  const [modalComment, setModalComment] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .post("/all-comments/by-admin-seen-status", {
        status: commentsStatus,
        page,
        perPage,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setComments(response.data.comments);
          setCommentsLength(response.data.allCount);
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
      });
  }, [commentsStatus, page, perPage]);

  const searchCommentsByWriterIdHandler = () => {
    setSearchLoading(true);
    axios
      .post("/find/current-user/comments", { query: queryWriterId })
      .then((response) => {
        setSearchLoading(false);
        if (response.data.success) {
          setComments(response.data.usersComments);
          setQueryWriterId("");
        }
      })
      .catch((err) => {
        setSearchLoading(false);
        setComments([]);
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
        } else {
          setErrorText(err.response.data.message);
        }
      });
  };

  const changeCommentStatusHandler = (e, id) => {
    axios
      .put(`/change/current-comment/status/${id}`, { status: e })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          let oldComments = comments;
          let newComments = oldComments.filter((c) => c._id !== id);
          setComments(newComments);
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

  return (
    <div className="admin-panel-wrapper">
      {modalComment && modalComment.content.length > 0 && (
        <Modal open={open} closeHandler={() => setOpen(false)}>
          <div className="modal_comment_wrapper">
            <div className="d-flex-center-center">
              <img
                className="comment_modal_img"
                src={
                  !modalComment.writerImage.length
                    ? `${defPic}`
                    : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${modalComment.writerImage}`
                }
                alt="تصویر نویسنده نظر"
              />
            </div>
            <div className="d-flex-center-center mt-3">
              <span className="font-sm">نویسنده نظر : </span>
              <strong className="font-sm mr-1">{`${modalComment.writer.firstName} ${modalComment.writer.lastName}`}</strong>
            </div>
            <p className="modal_comment_content">
              {modalComment && modalComment.content}
            </p>
            <div className="modal_comment_btn_wrapper">
              {!modalComment.isValid && (
                <div className="modal_btn_wrapper">
                  <button
                    onClick={() =>
                      changeCommentStatusHandler(true, modalComment._id)
                    }
                    className="modal_btn bg-purple"
                  >
                    تایید نظر
                  </button>
                </div>
              )}

              <div className="modal_btn_wrapper">
                <button
                  onClick={() =>
                    changeCommentStatusHandler(false, modalComment._id)
                  }
                  className="modal_btn bg-orange"
                >
                  حذف نظر
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      <h4>فهرست نظرات کاربران</h4>
      {errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <p className="mt-0">
          براساس این مرتب سازی تعداد{" "}
          <strong className="text-blue">{comments && comments.length}</strong>{" "}
          نظر جدید وجود دارد!
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
                    value={commentsStatus}
                    onChange={(e) => {
                      setCommentsStatus(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value={false}>جدیدترین نظرات</option>
                    <option value={true}>نظرات تایید شده</option>
                  </select>
                </th>
                <th colSpan="6">
                  <div className="dashboard-search">
                    <input
                      type="search"
                      value={queryWriterId}
                      placeholder="جستوجوی نظر بر اساس کد کاربری نویسنده نظر.."
                      onChange={(e) => setQueryWriterId(e.target.value)}
                    />
                    <span onClick={searchCommentsByWriterIdHandler}>
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
                <th className="th-titles">کد کاربری</th>
                <th className="th-titles">محتوا</th>
                <th className="th-titles">پاسخ به (نظر والِد)</th>
                <th className="th-titles">وضعیت</th>
                <th className="th-titles">تلفن همراه</th>
                <th className="th-titles">تاریخ ارسال</th>
              </tr>
            </thead>
            <tbody>
              {comments && comments.length > 0 ? (
                comments.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div className="d-flex-center-center">
                        <img
                          className="table-img user_photo"
                          src={
                            !c.writerImage.length
                              ? `${defPic}`
                              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${c.writerImage}`
                          }
                          alt="تصویر نویسنده نظر"
                        />
                      </div>
                    </td>
                    <td className="font-sm">
                      <Link
                        to={`/admin/dashboard/user/${c.writer._id}`}
                        className="text-blue"
                      >
                        {`${c.writer.firstName} ${c.writer.lastName}`}
                      </Link>
                    </td>
                    <td className="font-sm">{c.writer._id}</td>
                    <td className="font-sm">
                      <span
                        onClick={() => {
                          setOpen(true);
                          setModalComment(c);
                        }}
                        className="comment_content_btn"
                      >
                        {c.content.substring(0, 30)}...
                      </span>
                    </td>
                    <td className="font-sm">
                      {c.responseTo && c.responseTo._id.length > 0 ? (
                        <span
                          onClick={() => {
                            setOpen(true);
                            setModalComment(c.responseTo);
                          }}
                          className="comment_content_btn"
                        >
                          {c.responseTo.content.substring(0, 30)}
                          ...
                        </span>
                      ) : (
                        "..."
                      )}
                    </td>
                    <td className="font-sm">
                      <div className="d-flex-center-center">
                        {c.isValid ? (
                          <GiCheckMark className="text-green font-md" />
                        ) : (
                          <MdRemoveRedEye className="text-mute font-md" />
                        )}
                      </div>
                    </td>
                    <td className="font-sm">{c.writer.phoneNumber}</td>
                    <td className="font-sm">
                      {new Date(c.createdAt).toLocaleDateString("fa-IR")}
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
                      نظری یافت نشد!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {commentsLength > perPage && (
            <Pagination
              perPage={perPage}
              productsLength={commentsLength}
              setPage={setPage}
              page={page}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CommentsList;
