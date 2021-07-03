import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(8);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    count === 0 && history.push("/");

    return () => clearInterval(interval);
  }, [count, history]);

  return (
    <div className="gonshap-container">
      <div className="auth-section">
        <h4>
          کاربر گرامی؛ شما <strong className="text-blue">اجازه دسترسی</strong>{" "}
          به این مسیر را ندارید!
        </h4>
        <p className="warning-message">
          شما به صفحه اصلی بازگردانده خواهید شد پس از {count} ثانیه!
        </p>
      </div>
    </div>
  );
};

export default LoadingToRedirect;