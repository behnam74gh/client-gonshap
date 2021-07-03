import React from "react";

const ErrorFallback = ({ error }) => {
  return (
    <div className="err_boundary_wrapper" role="alert">
      <p className="info-message font-sm">خطایی رخ داده است!</p>
      <pre className="warning-message my-2">{error.message}</pre>
    </div>
  );
};

export default ErrorFallback;
