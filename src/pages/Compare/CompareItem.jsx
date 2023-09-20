import React from 'react'
import { Link } from 'react-router-dom';
import "./ComparePage.css";

const CompareItem = ({item}) => {
  return (
    <div className="product_compare_wrapper">
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
                برند :
                <span className="mr-1">{item.brand.brandName}</span>
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
                %<strong className="mx-1">{item.discount}</strong>
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
            {item.details?.length > 0 &&
            item.details.map((item) => {
                return (
                <div key={item._id} className="compare_details_info">
                    <div className="compare_detail_question">
                    <p>{item.question}</p>
                    </div>
                    <div className="compare_detail_answer">
                    <p>{item.answer}</p>
                    </div>
                </div>
                );
            })}
        </div>
    </div>
  )
}

export default CompareItem