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
import { useHistory } from "react-router-dom";
import "./Comments.css";

const Comments = ({postId,category,commentList}) => {
  const [reRenderComponent, setReRenderComponent] = useState(true);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.userSignin);
  const history = useHistory()
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
      productId: postId,
      isSupplier: userInfo?.role === 2 && userInfo?.supplierFor === category ? true : false,
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

  const goSigninHandler = () => {
    history.push({
      pathname: "/signin",
      state: {
        from: `/product/details/${postId}`,
      },
    })
  }

  return (
    <div className="comment_box_wrapper">
      {!userInfo.userId && <span className="d-flex-center-center mt-3">
        جهت ثبت دیدگاه، ابتدا
      <strong onClick={goSigninHandler} className="text-blue mx-1" style={{cursor: "pointer"}}>وارد حساب  </strong> شوید
      </span>}
      {reRenderComponent && userInfo?.isBan === false && (
        <form className="auth-form" onSubmit={submitCommentHandler}>
          <label className="auth-label">
            دیدگاه شما :
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
            errorText="لطفا ازعملگرها استفاده نکنید"
          />

          <Button
            type="submit"
            disabled={
              !formState.inputs.commentContent.isValid ||
              loading
            }
          >
            {loading ? (
              <VscLoading className="loader" />
            ) : userInfo?.userId && (
              "ثبت دیدگاه"
            )}
          </Button>
        </form>
      )}
      <hr />
      <p className="text-purple my-2 d-flex-center-center">
        دیدگاه کاربران
        <FaComments className="font-md mx-2" />
      </p>
      {commentList?.length > 0 ? (
        commentList.map(
          (comment) =>
            !comment.responseTo && (
              <React.Fragment key={comment._id}>
                <SingleComment comment={comment} category={category} />
                <RepleyComments
                  postId={postId}
                  commentList={commentList}
                  parentCommentId={comment._id}
                  category={category}
                />
              </React.Fragment>
            )
        )
      ) : (
        <p className="info-message text-center">اولین دیدگاه را شما ثبت کنید</p>
      )}
    </div>
  );
};

export default Comments;
