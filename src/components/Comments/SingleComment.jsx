import React, { useEffect, useState } from "react";
import axios from "../../util/axios";
import { useSelector } from "react-redux";
import defPic from "../../assets/images/pro-8.png";
import LikeDislike from "./LikeDislike";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { BsFillCartCheckFill } from "react-icons/bs";
import Button from "../UI/FormElement/Button";
import Input from "../UI/FormElement/Input";
import { useForm } from "../../util/hooks/formHook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
} from "../../util/validators";

const SingleComment = ({ comment }) => {
  const [showForm, setShowForm] = useState(false);
  const [reRenderComponent, setReRenderComponent] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formState, inputHandler] = useForm(
    {
      repleyComment: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const { userInfo } = useSelector((state) => state.userSignin);
  const { _id, productId, writer, content, createdAt, writerImage } = comment;

  useEffect(() => {
    if (!reRenderComponent) {
      setReRenderComponent(true);
    }
  }, [reRenderComponent]);

  const toggleFormToAnswerHandler = () => {
    setShowForm(!showForm)
  }

  const submitCommentHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      commentContent: formState.inputs.repleyComment.value,
      productId: productId,
      responseTo: _id,
    };

    axios
      .post("/create-comment", data)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          toast.success(res.data.message);
          setReRenderComponent(false);
          setShowForm(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });
  };

  return (
    <div className="comment_wrapper">
      <div className="single_comment_wrapper">
        <div className="writer_photo_wrapper">
          <img
            className="writer_photo"
            src={
              writerImage && writerImage.length > 0
                ? `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${writerImage}`
                : defPic
            }
            alt="تصویر نویسنده نظر"
          />
        </div>

        <div className="comment_content_wrapper">
          <div>
            <span className="d-flex-center-center">
              <strong className="text-mute mx-1">
                {`${writer.firstName} ${writer.lastName}`}
              </strong>
              {comment.isBought && <BsFillCartCheckFill style={{cursor: "auto"}} color="var(--thirdColorPalete)" />}
            </span>
            <span className="font-sm">
              تاریخ ثبت نظر :{" "}
              <strong className="mx-2">
                {new Date(createdAt).toLocaleDateString("fa-IR")}
              </strong>
            </span>
          </div>
          <p className="comment_content">{content}</p>
          <div className="like_dislike_wrapper">
            <LikeDislike commentId={_id} />
            <span onClick={toggleFormToAnswerHandler} className="reply_btn">
              {showForm ? "انصراف" : "پاسخ دادن"}
            </span>
          </div>
        </div>
      </div>
      {showForm && reRenderComponent && (
        <form className="auth-form" onSubmit={submitCommentHandler}>
          <label className="auth-label">لطفا پاسخ خود را ثبت کنید :</label>
          <Input
            id="repleyComment"
            element="textarea"
            type="text"
            row={6}
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(2000),
              VALIDATOR_MINLENGTH(2),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
            errorText="از علامت ها و عملگر ها استفاده نکنید،بین 2 تا 2000 حرف میتوانید وارد کنید"
          />

          <Button
            type="submit"
            disabled={
              !formState.inputs.repleyComment.isValid ||
              loading ||
              userInfo === null ||
              userInfo === undefined || userInfo.isBan
            }
          >
            {loading ? (
              <VscLoading className="loader" />
            ) : userInfo && userInfo.refreshToken ? (
              "ثبت پاسخ"
            ) : (
              "ابتدا وارد شوید"
            )}
          </Button>
        </form>
      )}
    </div>
  );
};

export default SingleComment;
