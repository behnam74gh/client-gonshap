import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="gonshap-container">
      <div className="auth-section">
        <h3>صفحه یافت نشد</h3>
        <h5>
          خطای <strong className="text-blue mx-1">404</strong>رخ داده است!
        </h5>
        <Link className="text-blue font-sm" to="/">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
