import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

const RepleyComments = (props) => {
  const [openRepleyComments, setOpenRepleyComments] = useState(false);
  const [childCommentNumber, setChildCommentNumber] = useState(0);

  useEffect(() => {
    let repleyCommentNumber = 0;
    props.commentList.map(
      (comment) =>
        comment.responseTo === props.parentCommentId && repleyCommentNumber++
    );
    setChildCommentNumber(repleyCommentNumber);
  }, [props.commentList, props.parentCommentId]);

  let renderRepleyComments = (parentCommentId) =>
    props.commentList.map((comment, index) => {
      return (
        comment.responseTo === parentCommentId && (
          <React.Fragment key={index}>
            <div className="reply_comment">
              <SingleComment comment={comment} />
              <RepleyComments
                postId={props.postId}
                commentList={props.commentList}
                parentCommentId={comment._id}
              />
            </div>
          </React.Fragment>
        )
      );
    });

  return (
    <div className="w-100">
      {childCommentNumber > 0 && (
        <p
          className="count_of_replye_comments"
          onClick={() => setOpenRepleyComments(!openRepleyComments)}
        >
          تعداد
          <strong className="mx-2 text-purple">{childCommentNumber}</strong>نظر
          دیگر را مشاهده کنید
        </p>
      )}
      {openRepleyComments && renderRepleyComments(props.parentCommentId)}
    </div>
  );
};

export default RepleyComments;
