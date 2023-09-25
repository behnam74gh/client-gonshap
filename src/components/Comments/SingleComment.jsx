import React, { useEffect, useState } from "react";
import axios from "../../util/axios";
import { useSelector } from "react-redux";
import defPic from "../../assets/images/pro-8.png";
import LikeDislike from "./LikeDislike";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { BsFillCartCheckFill } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";
import Button from "../UI/FormElement/Button";
import Input from "../UI/FormElement/Input";
import { useForm } from "../../util/hooks/formHook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
} from "../../util/validators";

const SingleComment = ({ comment,category }) => {
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
  const { _id, productId, writer, content, createdAt, writerImage,isSupplier } = comment;

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
      isSupplier: userInfo?.role === 2 && userInfo?.supplierFor === category ? true : false,
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
            {writer?.role === 1 ? (
              <span className="d-flex-center-center">
                <strong className="text-mute mx-1">
                  مدیر
                </strong>
                <HiBadgeCheck style={{cursor: "auto"}} color="var(--thirdColorPalete)" />
              </span>
            ) : writer?.role === 2 && isSupplier ? (
              <span className="d-flex-center-center">
                <strong className="text-mute mx-1">
                  فروشنده
                </strong>
                <HiBadgeCheck style={{cursor: "auto"}} color="var(--thirdColorPalete)" />
              </span>
            ) : (
              <span className="d-flex-center-center">
                <strong className="text-mute mx-1">
                  {`${writer.firstName} ${writer.lastName}`}
                </strong>
                {comment.isBought && <BsFillCartCheckFill style={{cursor: "auto"}} color="var(--thirdColorPalete)" />}
              </span>
            )}
            <span className="font-sm">
              <strong>
                {new Date(createdAt).toLocaleDateString("fa-IR")}
              </strong>
            </span>
          </div>
          <p className="comment_content">{content}</p>
          <div className="like_dislike_wrapper">
            <LikeDislike commentId={_id} commentLikes={comment.likes} commentDislikes={comment.disLikes} />
            {navigator.onLine && userInfo !== null && <span onClick={toggleFormToAnswerHandler} className="reply_btn">
              {showForm ? "انصراف" : "پاسخ دادن"}
            </span>}
          </div>
        </div>
      </div>
      {showForm && reRenderComponent && (
        <form className="auth-form" onSubmit={submitCommentHandler}>
          <label className="auth-label">پاسخ شما :</label>
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
            errorText="از علامت ها و عملگر ها استفاده نکنید"
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
            ) : userInfo && userInfo.userId ? (
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
