import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSkeleton from "../../components/UI/LoadingSkeleton/LoadingSkeleton";
import axios from "../../util/axios";
import { Helmet } from "react-helmet";
import "./ComparePage.css";

const ComparePage = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [errorText, setErrorText] = useState("");

  const [details, setDetails] = useState("");

  const { id } = match.params;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/fetch-products/to-compare/${id}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setCurrentProduct(response.data.currentProduct);
          setSimilarProducts(response.data.similarProducts);

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
  }, [id]);

  useEffect(() => {
    if (currentProduct && currentProduct._id.length > 0) {
      let details = currentProduct.description.split("-");
      const allDetails = details.filter((d, i) => i > 0 && d);
      setDetails(allDetails);
    }
  }, [currentProduct]);

  return (
    <section id="compare_products">
      <Helmet>
        <title>مقایسه محصولات</title>
      </Helmet>
      {currentProduct && currentProduct._id.length > 0 && (
        <h4>
          مقایسه و بررسی دقیق تر{" "}
          <strong className="mx-2 text-blue">
            {currentProduct.subcategory.name}
          </strong>{" "}
          ها با یکدیگر
        </h4>
      )}
      <p className="my-1 font-sm">محصول مورد نظر :</p>
      {loading ? (
        <LoadingSkeleton />
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        currentProduct &&
        currentProduct._id.length > 0 && (
          <div className="product_compare_wrapper">
            <div className="compare_info_wrapper">
              <Link
                to={`/product/details/${currentProduct._id}`}
                className="font-sm my-0 text-blue"
              >
                {currentProduct.title}
              </Link>
              <div className="d-flex-center-center mb-1">
                <img
                  src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${currentProduct.photos[0]}`}
                  alt={currentProduct.title}
                  className="w-45"
                />
              </div>
              <p>
                برند :
                <span className="mr-1">{currentProduct.brand.brandName}</span>
              </p>
              <p>
                پایین ترین قیمت بازار :
                <strong className="mx-2">
                  {currentProduct.price.toLocaleString("fa")}
                </strong>
                تومان
              </p>
              <p>
                میزان تخفیف :{" "}
                <strong className="mx-1">{currentProduct.discount}</strong>%
              </p>
              <p>
                قیمت نهایی :
                <strong className="mx-2">
                  {currentProduct.finallyPrice.toLocaleString("fa")}
                </strong>
                تومان
              </p>
              <p>
                تعداد موجودی :
                <span className="mr-1">
                  {currentProduct.countInStock > 0 ? (
                    currentProduct.countInStock
                  ) : (
                    <span className="compare_item_not_exist">ناموجود</span>
                  )}
                </span>
              </p>
              <p>
                تعداد فروش :<span className="mr-1">{currentProduct.sold}</span>
              </p>
              <div className="compare_colors_wrapper">
                <span className="font-sm">رنگ ها : </span>

                {currentProduct.colors.length > 0 &&
                  currentProduct.colors.map((c, i) => (
                    <span
                      key={i}
                      style={{ background: `#${c.colorHex}` }}
                      className="tooltip"
                    >
                      <span className="tooltip_text">{c.colorName}</span>
                    </span>
                  ))}
              </div>
            </div>
            <div className="compare_details_wrapper">
              {details &&
                details.length > 0 &&
                details.map((d, i) => {
                  const detailInfo = d.split("؟");
                  return (
                    <div key={i} className="compare_details_info">
                      <div className="compare_detail_question">
                        <p>{detailInfo[0]}</p>
                      </div>
                      <div className="compare_detail_answer">
                        <p>{detailInfo[1]}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )
      )}
      <p className="my-1 font-sm">محصولات مشابه :</p>
      {loading ? (
        <React.Fragment>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </React.Fragment>
      ) : similarProducts && similarProducts.length > 0 ? (
        similarProducts.map((item, i) => {
          let details = item.description.split("-");
          const allDetails = details.filter((d, i) => i > 0 && d);
          return (
            <div key={i} className="product_compare_wrapper">
              <div className="compare_info_wrapper">
                <Link
                  to={`/product/details/${item._id}`}
                  className="font-sm my-0 text-blue"
                >
                  {item.title}
                </Link>
                <div className="d-flex-center-center mb-1">
                  <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${item.photos[0]}`}
                    alt={item.title}
                    className="w-45"
                  />
                </div>
                <p>
                  برند :<span className="mr-1">{item.brand.brandName}</span>
                </p>
                <p>
                  پایین ترین قیمت بازار :
                  <strong className="mx-2">
                    {item.price.toLocaleString("fa")}
                  </strong>
                  تومان
                </p>
                <p>
                  میزان تخفیف :{" "}
                  <strong className="mx-1">{item.discount}</strong>%
                </p>
                <p>
                  قیمت نهایی :
                  <strong className="mx-2">
                    {item.finallyPrice.toLocaleString("fa")}
                  </strong>
                  تومان
                </p>
                <p>
                  تعداد موجودی :
                  <span className="mr-1">
                    {item.countInStock > 0 ? (
                      item.countInStock
                    ) : (
                      <span className="compare_item_not_exist">ناموجود</span>
                    )}
                  </span>
                </p>
                <p>
                  تعداد فروش :<span className="mr-1">{item.sold}</span>
                </p>
                <div className="compare_colors_wrapper">
                  <span className="font-sm">رنگ ها : </span>

                  {item.colors.length > 0 &&
                    item.colors.map((c, i) => (
                      <span
                        key={i}
                        style={{ background: `#${c.colorHex}` }}
                        className="tooltip"
                      >
                        <span className="tooltip_text">{c.colorName}</span>
                      </span>
                    ))}
                </div>
              </div>
              <div className="compare_details_wrapper">
                {allDetails &&
                  allDetails.length > 0 &&
                  allDetails.map((d, i) => {
                    const detailInfo = d.split("؟");
                    return (
                      <div key={i} className="compare_details_info">
                        <div className="compare_detail_question">
                          <p>{detailInfo[0]}</p>
                        </div>
                        <div className="compare_detail_answer">
                          <p>{detailInfo[1]}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })
      ) : (
        <p className="warning-message">محصول مشابه ای جهت مقایسه ، یافت نشد!</p>
      )}
    </section>
  );
};

export default ComparePage;
