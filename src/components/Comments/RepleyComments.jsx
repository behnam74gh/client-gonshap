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
    props.commentList.map((comment) => {
      return (
        comment.responseTo === parentCommentId && (
          <React.Fragment key={comment._id}>
            <div className="reply_comment">
              <SingleComment comment={comment} category={props.category} />
              <RepleyComments
                postId={props.postId}
                commentList={props.commentList}
                parentCommentId={comment._id}
                category={props.category}
              />
            </div>
          </React.Fragment>
        )
      );
    });

  return (
    <div style={{
      width: "95%",
      paddingRight: "20px"
    }}>
      {childCommentNumber > 0 && (
        <p
          className="count_of_replye_comments"
          onClick={() => setOpenRepleyComments(!openRepleyComments)}
        >
          {openRepleyComments ? "بستن" : "مشاهده"}
          <strong className="mx-2">{childCommentNumber}</strong>پاسخ
        </p>
      )}
      {openRepleyComments && renderRepleyComments(props.parentCommentId)}
    </div>
  );
};

export default RepleyComments;
