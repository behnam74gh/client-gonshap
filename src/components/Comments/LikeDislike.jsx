import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../util/axios";
import {
  AiFillDislike,
  AiOutlineDislike,
  AiFillLike,
  AiOutlineLike,
} from "react-icons/ai";
import { toast } from "react-toastify";

const LikeDislike = ({ commentId }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDisikes] = useState(0);
  const [likeAction, setLikeAction] = useState(null);
  const [dislikeAction, setDislikeAction] = useState(null);

  const { userInfo } = useSelector((state) => state.userSignin);

  useEffect(() => {
    axios
      .post("/get/all-likes/current-product", { commentId })
      .then((res) => {
        if (res.data.success) {
          setLikes(res.data.likes.length);

          if (userInfo && userInfo.userId.length > 0) {
            res.data.likes.map(
              (like) =>
                like.userId === userInfo.userId && setLikeAction("liked")
            );
          }
        }
      })
      .catch((err) => {
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });

    axios
      .post("/get/all-dislikes/current-product", { commentId })
      .then((res) => {
        if (res.data.success) {
          setDisikes(res.data.dislikes.length);

          if (userInfo && userInfo.userId.length > 0) {
            res.data.dislikes.map(
              (dislike) =>
                dislike.userId === userInfo.userId &&
                setDislikeAction("disliked")
            );
          }
        }
      })
      .catch((err) => {
        if (typeof err.response.data.message === "object") {
          toast.warning(err.response.data.message[0]);
        } else {
          toast.warning(err.response.data.message);
        }
      });
  }, [commentId, userInfo]);

  const onLikeHandler = () => {
    if (likeAction === null) {
      axios
        .post("/up-like", { commentId })
        .then((res) => {
          if (res.data.success) {
            setLikes(likes + 1);
            setLikeAction("liked");

            //if dislike button already clicked
            if (dislikeAction !== null) {
              setDisikes(dislikes - 1);
              setDislikeAction(null);
            }
          }
        })
        .catch((err) => {
          if (typeof err.response.data.message === "object") {
            toast.warning(err.response.data.message[0]);
          } else {
            toast.warning(err.response.data.message);
          }
        });
    } else {
      axios
        .post("/un-like", { commentId })
        .then((res) => {
          if (res.data.success) {
            setLikes(likes - 1);
            setLikeAction(null);
          }
        })
        .catch((err) => {
          if (typeof err.response.data.message === "object") {
            toast.warning(err.response.data.message[0]);
          } else {
            toast.warning(err.response.data.message);
          }
        });
    }
  };

  const onDislikeHandler = () => {
    if (dislikeAction === null) {
      axios
        .post("/up-dislike", { commentId })
        .then((res) => {
          if (res.data.success) {
            setDisikes(dislikes + 1);
            setDislikeAction("disliked");

            //if like button already clicked
            if (likeAction !== null) {
              setLikes(likes - 1);
              setLikeAction(null);
            }
          }
        })
        .catch((err) => {
          if (typeof err.response.data.message === "object") {
            toast.warning(err.response.data.message[0]);
          } else {
            toast.warning(err.response.data.message);
          }
        });
    } else {
      axios
        .post("/un-dislike", { commentId })
        .then((res) => {
          if (res.data.success) {
            setDisikes(dislikes - 1);
            setDislikeAction(null);
          }
        })
        .catch((err) => {
          if (typeof err.response.data.message === "object") {
            toast.warning(err.response.data.message[0]);
          } else {
            toast.warning(err.response.data.message);
          }
        });
    }
  };

  return (
    <div>
      <span onClick={onLikeHandler} className="like_dislike_info">
        {likeAction === "liked" ? (
          <AiFillLike className="text-green" />
        ) : (
          <AiOutlineLike />
        )}
        <span className="mx-1">{likes}</span>
      </span>
      <span onClick={onDislikeHandler} className="like_dislike_info">
        {dislikeAction === "disliked" ? (
          <AiFillDislike className="text-red" />
        ) : (
          <AiOutlineDislike />
        )}
        <span className="mx-1">{dislikes}</span>
      </span>
    </div>
  );
};

export default LikeDislike;