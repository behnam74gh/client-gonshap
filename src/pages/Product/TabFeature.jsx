import React from "react";
import Comments from "../../components/Comments/Comments";
import Tabs from "../../components/UI/Tab/Tab";

const TabFeature = ({
  descritionContent,
  commentList,
  productId,
  productDetails,
  productCategory,
  commentsError,
}) => {
  
  return (
    <div className="comment_attributes">
      <Tabs>
        <div label="توضیحات">
          {descritionContent?.length > 0 && (
            <p className="product_content">{descritionContent}</p>
          )}
        </div>
        <div label={`(${commentList.length}) دیدگاه`}>
          {commentsError.length > 0 && (
            <p className="warning-message">{commentsError}</p>
          )}
          <Comments commentList={commentList} postId={productId} category={productCategory} />
        </div>
        <div label="مشخصات">
          <div className="details_info_wrapper">
            {productDetails?.length > 0 &&
              productDetails.map((d) => {
                return (
                  <div key={d._id} className="details_info">
                    <div className="detail_question">
                      <p>{d.question}</p>
                    </div>
                    <div className="detail_answer">
                      <p>{d.answer}</p>
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
