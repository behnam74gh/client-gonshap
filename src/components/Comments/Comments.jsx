import React, { useEffect, useState } from "react";
import axios from "../../util/axios";
import { useSelector } from "react-redux";
import { FaComments } from "react-icons/fa";
import SingleComment from "./SingleComment";
import RepleyComments from "./RepleyComments";
import { VscLoading } from "react-icons/vsc";
import Button from "../UI/FormElement/Button";
import Input from "../UI/FormElement/Input";
import { useForm } from "../../util/hooks/formHook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
} from "../../util/validators";
import { toast } from "react-toastify";
import "./Comments.css";

const Comments = (props) => {
  const [reRenderComponent, setReRenderComponent] = useState(true);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.userSignin);

  const [formState, inputHandler] = useForm(
    {
      commentContent: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    if (!reRenderComponent) {
      setReRenderComponent(true);
    }
  }, [reRenderComponent]);

  const submitCommentHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      commentContent: formState.inputs.commentContent.value,
      productId: props.postId,
    };

    axios
      .post("/create-comment", data)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          toast.success(res.data.message);
          setReRenderComponent(false);
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
    <div className="comment_box_wrapper">
      {reRenderComponent && (
        <form className="auth-form" onSubmit={submitCommentHandler}>
          <label className="auth-label">
            لطفا نظر خود را ثبت کنید :
            {!userInfo && <span className="text-mute">( ابتدا وارد حسابتان شوید )</span>}
          </label>
          <Input
            id="commentContent"
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
              !formState.inputs.commentContent.isValid ||
              loading ||
              userInfo === null ||
              userInfo === undefined || userInfo.isBan
            }
          >
            {loading ? (
              <VscLoading className="loader" />
            ) : userInfo && userInfo.refreshToken ? (
              "ثبت نظر"
            ) : (
              "ابتدا وارد شوید"
            )}
          </Button>
        </form>
      )}
      <hr />
      <p className="text-purple my-2 d-flex-center-center">
        نظرات کاربران
        <FaComments className="font-md mx-2" />
      </p>
      {props.commentList && props.commentList.length > 0 ? (
        props.commentList.map(
          (comment) =>
            !comment.responseTo && (
              <React.Fragment key={comment._id}>
                <SingleComment comment={comment} />
                <RepleyComments
                  postId={props.postId}
                  commentList={props.commentList}
                  parentCommentId={comment._id}
                />
              </React.Fragment>
            )
        )
      ) : (
        <p className="info-message text-center">اولین نظر را شما ثبت کنید</p>
      )}
    </div>
  );
};

export default Comments;
