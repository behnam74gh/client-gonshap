import React, { useEffect, useState } from "react";
import Comments from "../../components/Comments/Comments";
import Tabs from "../../components/UI/Tab/Tab";

const TabFeature = ({
  descritionContent,
  commentList,
  productId,
  commentsError,
}) => {
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  useEffect(() => {
    let details = descritionContent.split("-");
    setDescription(details[0]);
    const allDetails = details.filter((d, i) => i > 0 && d);

    setDetails(allDetails);
  }, [descritionContent]);

  return (
    <div className="comment_attributes">
      <Tabs>
        <div label="توضیحات">
          {descritionContent && description.length > 0 && (
            <p className="product_content">{description}</p>
          )}
        </div>
        <div label={`نظرات (${commentList.length})`}>
          {commentsError.length > 0 && (
            <p className="warning-message">{commentsError}</p>
          )}
          <Comments commentList={commentList} postId={productId} />
        </div>
        <div label="مشخصات">
          <div className="details_info_wrapper">
            {descritionContent &&
              descritionContent.length > 0 &&
              details.length > 0 &&
              details.map((d, i) => {
                const detailInfo = d.split("؟");
                return (
                  <div key={i} className="details_info">
                    <div className="detail_question">
                      <p>{detailInfo[0]} :</p>
                    </div>
                    <div className="detail_answer">
                      <p>{detailInfo[1]}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default TabFeature;
