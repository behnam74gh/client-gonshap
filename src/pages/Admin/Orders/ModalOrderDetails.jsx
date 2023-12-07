import React, { useRef } from 'react'
import Button from '../../../components/UI/FormElement/Button';
import defPic from "../../../assets/images/pro-8.png";
import './ModalOrderDetails.css';

const ModalOrderDetails = ({order}) => {
  const printableDivRef = useRef();
  const iframeRef = useRef();
  
  const getPrintOrPdfHandler = () => {
    iframeRef.current.contentWindow.document.open()
    iframeRef.current.contentWindow.document.write(printableDivRef.current.innerHTML)
    iframeRef.current.contentWindow.document.close()
    iframeRef.current.contentWindow.focus()
    iframeRef.current.contentWindow.print()
  }

  return (
    <div className='order_details_wrapper' style={{width: "100%",display: "flex",flexFlow: "column wrap", padding: "10px 20px"}}>
      <div ref={printableDivRef} className='details_info_wrapper' style={{width: "100%",display: "flex",flexFlow: "column wrap",backgroundColor: "white",padding: "30px 40px",borderRadius: "4px",boxShadow: "0 2px 17px rgba(0,0,0,0.3)"}}>
        <h5 style={{direction: "rtl",marginBottom: "10px",marginTop: "0", textAlign: "center !important"}}>
          جزئیات سفارش با شماره سریال{" "}
          <strong style={{marginRight: "5px", color: "#2c6df0"}}>{order._id}</strong>
        </h5>
        <div className='details_info_container' style={{width: "100%",direction: "rtl",display: "flex",flexFlow: "row",alignItems: "flex-start",margin: "0 0 30px"}}>
          <div className='right_info' style={{flexBasis: "50%",display: "flex",flexFlow: "column wrap",padding: "10px 0 10px 30px",fontSize: "12px"}}>
            <strong>اطلاعات خریدار</strong>
            <hr style={{width: "100%",border: "none",margin: "10px 0",borderTop: "1px solid rgba(150,148,148)"}} />
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center",margin: "4px 0"}}>
              <img style={{width: "100%",height: "80px", maxWidth: "80px", maxHeight: "80px",borderRadius: "50%"}}
                src={
                  !order.shippingAddress.buyerImage
                    ? `${defPic}`
                    : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${order.shippingAddress.buyerImage}`
                }
                alt={order.shippingAddress.fullName}
              />
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>نام و نام خانوادگی :</span>
              <strong>{order.shippingAddress.fullName}</strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>شماره تلفن :</span>
              <strong>{order.shippingAddress.phoneNumber}</strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>آدرس تحویل کالا :</span>
              <strong>{order.shippingAddress.address}</strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>هزینه سفارش :</span>
              <strong>
                {order.paymentInfo.amount.toLocaleString("fa")}
                &nbsp;تومان
              </strong>
            </div>
          </div>
          <div className='left_info' style={{padding: "10px 30px 10px 0px",flexBasis: "50%",display: "flex",flexFlow: "column wrap",fontSize: "12px"}}>
            <strong>جزئیات سفارش</strong>
            <hr style={{width: "100%",border: "none",margin: "10px 0",borderTop: "1px solid rgba(150,148,148)"}} />
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>سود سفارش :</span>
              <strong>
                {order.paymentInfo.profit?.toLocaleString("fa")}
                &nbsp;تومان
              </strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>تاریخ ثبت سفارش :</span>
              <strong>
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>وضعیت سفارش :</span>
              <strong>
                {order.orderStatus === 0
                  ? "نیاز به تایید"
                  : order.orderStatus === 1
                  ? "تایید شد"
                  : order.orderStatus === 2
                  ? "کامل شد"
                  : order.orderStatus === 3
                  ? "لغو شد"
                  : "رد شد"}
              </strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>وضعیت ارسال :</span>
              <strong>
                {order.deliveryStatus === 0
                  ? "ارسال نشده است"
                  : order.deliveryStatus === 1
                  ? "ارسال شد"
                  : order.deliveryStatus === 2
                  ? "تحویل داده شد"
                  : "برگشت داده شد"}
              </strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>تاریخ تحویل :</span>
              <strong>
                {order.paidAt
                  ? new Date(order.paidAt).toLocaleDateString("fa-IR")
                  : "-"}
              </strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>وضعیت پرداخت :</span>
              <strong>
                {order.isPaid ? "پرداخت تکمیل شد" : "پرداخت نشده است"}
              </strong>
            </div>
            <div style={{width: "100%",display: "flex",flexFlow: "row wrap",justifyContent: "space-between",alignItems: "center"}}>
              <span>تاریخ پرداخت :</span>
              <strong>
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleDateString("fa-IR")
                  : "-"}
              </strong>
            </div>
          </div>
        </div>
        <div style={{overflowX: "auto",direction: "rtl",width: "100%"}}>
          <table style={{border: "none",width: "100%"}}>
            <thead style={{backgroundColor: "#000",boxShadow: "0 4px 18px rgba(0, 0, 0, 0.45)"}}>
              <tr>
                <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>تصویر</th>
                <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>عنوان</th>
                <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>قیمت فاکتور</th>
                <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>قیمت فروش</th>
                <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>سود تکی</th>
                <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>تعداد</th>
                <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>سود مجموع</th>
                <th style={{fontWeight: "500", color: "#ffffff",border: "0", fontSize: "14px",padding: "4px", borderCollapse: "collapse", whiteSpace: "nowrap",wordBreak: 'break-all'}}>رنگ</th>
              </tr>
            </thead>
            <tbody style={{fontSize: "12px",border: "none"}}>
              {order.products.length > 0 &&
                order.products.map((item) => (
                  <tr key={item.product._id}>
                    <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>
                      <div style={{display: "flex",alignItems: "center",flexFlow: "row wrap",justifyContent: "center"}}>
                        <img
                          style={{width: "100%", height: "100%",maxWidth: "40px",maxHeight: "40px",minHeight: "40px"}}
                          src={
                            !item.image
                              ? `${defPic}`
                              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${item.image}`
                          }
                          alt={item.product.title}
                        />
                      </div>
                    </td>
                    <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>
                      <span
                        style={{color: "#2c6df0",fontWeight: "600"}}
                      >
                        {item.product.title}
                      </span>
                    </td>
                    <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{item.product?.factorPrice?.toLocaleString("fa")} تومان</td>
                    <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{item.price.toLocaleString("fa")} تومان</td>
                    <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{item.profit?.toLocaleString("fa")} تومان</td>
                    <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{item.count}</td>
                    <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>{(item.count * item.profit).toLocaleString("fa")} تومان</td>
                    <td style={{padding: "6px 12px", border: "none", whiteSpace: "nowrap",wordBreak: "break-all", borderCollapse: "collapse"}}>
                      <div style={{display: "flex",flexFlow: "row wrap",justifyContent: "center",alignItems: "center"}}>
                        {item.colors.length > 0 &&
                          item.colors.map((color, i) => (
                            <span
                              style={{
                                background: `#${color.colorHex}`,
                                color:
                                  `#${color.colorHex}` < "#1f101f"
                                    ? "white"
                                    : "black",
                              width: "25px",height: "25px",borderRadius: "50%",margin: "2px 4px" 
                              }}
                              key={i}
                            >
                            </span>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{display: "flex",flexFlow: "row wrap", justifyContent: "center",alignItems: "center"}}>
        <div style={{flexBasis: "50%",display: "flex",flexFlow: "row wrap",justifyContent: "flex-start",alignItems: "center"}}>
          <Button style={{
            width: "100%",background: "#6a0093",color: "#ffffff",borderRadius: "4px",outline: "none",padding: "8px 16px",minHeight: "38px",margin: "0.5em 0",
            border: "none",cursor: "pointer",fontFamily: "inherit",fontSize: "14px",overflow: "hidden",display:"flex",
            flexFlow: "row wrap",justifyContent: "center",alignItems: "center"
          }} onClick={getPrintOrPdfHandler} type="button">pdf یا print</Button>
        </div>
      </div>
      <iframe ref={iframeRef}
        style={{height: "0px", width: "0px",display: "flex",flexFlow: "column wrap", justifyContent: "center",alignItems: "center",
        position: "absolute",background: "white"}} title="iframe for print">
      </iframe>
  </div>
  )
}

export default ModalOrderDetails