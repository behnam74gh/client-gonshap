import React, { useEffect, useState } from "react";
import LoadingSkeleton from "../../components/UI/LoadingSkeleton/LoadingSkeleton";
import axios from "../../util/axios";
import { Helmet } from "react-helmet";
import CompareItem from "./CompareItem";
import "./ComparePage.css";

const ComparePage = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [errorText, setErrorText] = useState("");

  const { id } = match.params;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/fetch-products/to-compare/${id}`)
      .then((response) => {
        setLoading(false);
        if (response?.data?.success) {
          const {currentProduct,similarProducts} = response.data;
          setCurrentProduct(currentProduct);
          setSimilarProducts(similarProducts);

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

  return (
    <section id="compare_products">
      <Helmet>
        <title>مقایسه محصولات</title>
      </Helmet>
      {currentProduct?._id.length > 0 && (
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
      ) : (currentProduct?._id?.length > 0 && (
          <CompareItem item={currentProduct} />
        )
      )}
      <p className="my-1 font-sm">محصولات مشابه :</p>
      {loading ? (
        <React.Fragment>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </React.Fragment>
      ) : similarProducts?.length > 0 ? (
          similarProducts.map((item) => <CompareItem key={item._id} item={item} />)
      ) : (
        <p className="warning-message">محصول مشابه ای جهت مقایسه ، یافت نشد!</p>
      )}
    </section>
  );
};

export default ComparePage;
