import React from "react";
import { Helmet } from "react-helmet-async";

const ErrorFallback = ({ error }) => {

  const reloadAppHandler = () => window.location.reload(true)

  return (
    <div className="err_boundary_wrapper" role="alert">
      <Helmet>
        <title>خطا رخ داد</title>
      </Helmet>
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M147.514 126.458C147.311 126.458 147.112 126.403 146.938 126.3C146.408 125.982 146.232 125.297 146.542 124.763C146.633 124.582 156.87 107.509 176.147 111.712C193.605 115.52 197.763 111.136 197.808 111.091C198.216 110.627 198.92 110.577 199.39 110.978C199.853 111.37 199.923 112.059 199.548 112.537C199.085 113.113 194.497 118.028 175.661 113.915C158.023 110.062 148.87 125.215 148.542 125.904C148.329 126.265 147.933 126.478 147.514 126.458Z" fill="#EAEDEF"/>
        <path opacity="0.32" d="M163.649 140.94C165.537 139.967 165.537 138.392 163.649 137.418L144.118 127.452C142.904 126.917 141.523 126.917 140.309 127.452L66.4823 165.171C65.9258 165.455 65.9258 165.925 66.4823 166.21L85.8284 176.132C88.6097 177.357 91.7763 177.357 94.5576 176.132L163.649 140.94Z" fill="#919BAA"/>
        <path d="M64.3164 161.214C64.3164 159.892 61.9548 157.237 61.9548 154.242V148.706C62.0441 147.026 62.9804 145.507 64.4407 144.672L132.339 110.864C135.057 109.689 138.14 109.689 140.859 110.864L156.678 118.773C159.086 120.141 160.632 122.641 160.78 125.406V134.807C160.63 137.572 159.085 140.071 156.678 141.44L90.8701 174.095C87.8443 175.384 84.4313 175.42 81.3786 174.197C81.2106 174.118 81.0483 174.027 80.8927 173.926L69.1865 166.016C66.5085 164.717 64.3164 162.536 64.3164 161.214Z" fill="#EAEDEF"/>
        <path d="M86.0113 163.384C85.845 160.088 84.0087 157.106 81.1412 155.474L65.2429 147.564C63.435 146.672 61.9661 147.564 61.9661 149.598V161.643C62.0716 163.368 63.0405 164.924 64.5423 165.779L81.1638 174.084C83.8418 175.417 86.0339 174.084 86.0339 171.067L86.0113 163.384Z" fill="#EAEDEF"/>
        <path d="M86.0112 163.383C86.1733 160.086 88.0108 157.102 90.8813 155.473L155.921 123.157C158.599 121.824 160.791 123.157 160.791 126.185V136.66C160.707 138.259 159.812 139.704 158.418 140.49L90.8813 174.05C88.2033 175.383 86.0112 174.05 86.0112 171.021L86.0112 163.383Z" fill="#EAEDEF"/>
        <path d="M158.328 122.016C159.605 121.384 159.616 120.344 158.328 119.756L138.316 109.802C137.133 109.293 135.793 109.293 134.61 109.802L65.0397 144.457C63.2769 145.338 63.2656 146.773 65.0397 147.655L81.6272 155.949C84.335 157.118 87.4054 157.118 90.1131 155.949L158.328 122.016Z" fill="#F9FBFC"/>
        <path d="M89.5481 149.655C90.5199 149.146 90.5086 148.321 89.5481 147.835L80.7345 143.429C79.6027 142.92 78.3071 142.92 77.1752 143.429L73.582 145.383C72.6103 145.903 72.6216 146.728 73.582 147.225L82.3165 151.609C83.4507 152.107 84.7415 152.107 85.8758 151.609L89.5481 149.655Z" fill="#EAEDEF"/>
        <path d="M98.5423 143.202C99.096 142.92 99.0847 142.456 98.5423 142.174L93.2316 139.53C92.5908 139.248 91.8611 139.248 91.2203 139.53L90.2937 140.016C89.7514 140.309 89.7514 140.773 90.2937 141.055L95.5593 143.688C96.2039 143.97 96.9373 143.97 97.5819 143.688L98.5423 143.202Z" fill="white"/>
        <path opacity="0.32" d="M95.5706 143.723C96.2114 144.005 96.9411 144.005 97.5819 143.723L98.5423 143.226C98.6328 143.181 98.7165 143.124 98.7909 143.056C98.718 142.978 98.6294 142.917 98.531 142.875L93.2203 140.231C92.5807 139.944 91.8486 139.944 91.209 140.231L90.2825 140.717C90.1957 140.767 90.1159 140.828 90.0452 140.898C90.1205 140.976 90.2083 141.041 90.3051 141.09L95.5706 143.723Z" fill="#919BAA"/>
        <path d="M104.655 140.017C105.198 139.734 105.198 139.26 104.655 138.989L99.3447 136.345C98.7051 136.057 97.973 136.057 97.3334 136.345L96.4069 136.83C95.8532 137.124 95.8645 137.588 96.4069 137.87L101.672 140.492C102.313 140.773 103.043 140.773 103.684 140.492L104.655 140.017Z" fill="#EAEDEF"/>
        <path opacity="0.32" d="M101.672 140.501C102.313 140.783 103.043 140.783 103.684 140.501L104.655 140.004C104.745 139.959 104.825 139.898 104.893 139.823C104.816 139.755 104.733 139.695 104.644 139.643L99.3334 136.999C98.6926 136.717 97.9629 136.717 97.3221 136.999L96.3956 137.484C96.307 137.536 96.2238 137.597 96.147 137.665C96.2245 137.741 96.312 137.805 96.4069 137.857L101.672 140.501Z" fill="#919BAA"/>
        <path d="M87.4915 149.418C88.1129 149.102 88.1129 148.593 87.4915 148.288L79.9886 144.537C79.2693 144.217 78.448 144.217 77.7287 144.537L75.4689 145.723C74.8587 146.04 74.8587 146.548 75.4689 146.853L82.9039 150.571C83.6238 150.888 84.4439 150.888 85.1638 150.571L87.4915 149.418Z" fill="#EE6078"/>
        <path d="M75.1753 146.435L84.4521 148.571C84.7131 149.273 84.7447 150.041 84.5425 150.763C85.0493 150.618 85.5412 150.425 86.0115 150.186L88.0453 149.113C88.3015 148.986 88.485 148.749 88.5425 148.469C88.7401 147.648 88.7401 146.792 88.5425 145.972C87.4126 145.35 80.3504 143.893 80.3504 143.893L75.1753 146.435Z" fill="#EE6078"/>
        <path d="M87.887 146.705C88.5989 146.332 88.6892 145.902 88.0678 145.733L80.5989 143.744C79.7737 143.607 78.9264 143.738 78.1808 144.117L75.5028 145.496C74.7909 145.857 75.0621 146.388 75.6723 146.558L82.7344 148.456C83.5596 148.587 84.4052 148.457 85.1525 148.083L87.887 146.705Z" fill="#EF7389"/>
        <path d="M143.141 116.954C138.136 114.796 132.463 114.796 127.458 116.954C123.175 119.124 123.175 122.604 127.458 124.796C132.465 126.943 138.134 126.943 143.141 124.796C147.469 122.649 147.469 119.124 143.141 116.954Z" fill="#EFF3F4"/>
        <path d="M142.362 119.236C137.36 117.078 131.69 117.078 126.689 119.236C125.746 119.677 124.913 120.321 124.249 121.123C124.362 122.456 125.378 123.779 127.435 124.795C132.442 126.943 138.111 126.943 143.119 124.795C144.071 124.354 144.916 123.71 145.593 122.908C145.469 121.575 144.407 120.253 142.362 119.236Z" fill="#E4E8EA"/>
        <path opacity="0.32" d="M133.706 123.248C132.777 122.842 131.72 122.842 130.791 123.248C129.989 123.655 129.989 124.31 130.791 124.706C131.722 125.101 132.775 125.101 133.706 124.706C134.508 124.31 134.508 123.655 133.706 123.248Z" fill="#919BAA"/>
        <path opacity="0.32" d="M139.04 120.683C138.108 120.288 137.056 120.288 136.124 120.683C135.322 121.09 135.322 121.746 136.124 122.141C137.056 122.537 138.108 122.537 139.04 122.141C139.842 121.746 139.842 121.09 139.04 120.683Z" fill="#919BAA"/>
        <path d="M122.407 126.627C117.406 124.468 111.736 124.468 106.734 126.627C102.441 128.796 102.441 132.276 106.734 134.457C111.738 136.604 117.403 136.604 122.407 134.457C126.689 132.322 126.689 128.796 122.407 126.627Z" fill="#EFF3F4"/>
        <path d="M121.638 128.909C116.636 126.739 110.958 126.739 105.955 128.909C105.012 129.35 104.178 129.994 103.514 130.796C103.627 132.129 104.644 133.451 106.712 134.457C111.715 136.603 117.381 136.603 122.384 134.457C123.338 134.023 124.184 133.382 124.859 132.581C124.734 131.248 123.672 129.926 121.638 128.909Z" fill="#E4E8EA"/>
        <path opacity="0.32" d="M112.972 132.92C112.043 132.514 110.986 132.514 110.057 132.92C109.266 133.315 109.266 133.971 110.057 134.378C110.988 134.773 112.04 134.773 112.972 134.378C113.774 133.971 113.774 133.315 112.972 132.92Z" fill="#919BAA"/>
        <path opacity="0.32" d="M118.305 130.356C117.376 129.949 116.319 129.949 115.39 130.356C114.588 130.762 114.588 131.418 115.39 131.813C116.321 132.209 117.374 132.209 118.305 131.813C119.107 131.418 119.107 130.762 118.305 130.356Z" fill="#919BAA"/>
        <path d="M54.6237 114.147H54.5333C50.9966 113.854 46.9966 113.526 43.5954 111.537C42.5284 110.971 41.6195 110.148 40.9514 109.142C39.3016 106.532 40.2621 103.187 42.0813 101.232C43.9626 99.4145 46.3643 98.2295 48.9514 97.8422C52.2739 97.2526 55.645 96.9802 59.0191 97.0287C63.2564 96.9496 67.2564 96.8818 71.0417 95.5937C71.9074 95.3325 72.7162 94.9109 73.4259 94.3507C73.9812 93.8892 74.3073 93.2082 74.3186 92.4863C74.2282 91.1191 72.4768 90.2264 71.9344 90.0004C68.6802 88.5541 64.9514 88.8705 61.3355 89.1191C60.4881 89.1869 59.6293 89.2547 58.7819 89.2999C55.392 89.4807 50.8158 89.7292 46.2169 90.0908C37.1773 90.814 26.3525 90.9496 23.505 85.6841C22.7581 84.2788 22.8449 82.5766 23.731 81.2547C26.296 77.0513 36.5559 72.6897 52.9288 73.0174C53.5528 73.0174 54.0587 73.5233 54.0587 74.1473C54.0587 74.7714 53.5528 75.2773 52.9288 75.2773C38.2395 74.9722 27.957 78.7349 25.7084 82.4298C25.238 83.0639 25.1721 83.9114 25.5389 84.6106C27.2112 87.6954 34.1152 88.7801 46.0926 87.8422C50.7028 87.4807 55.2564 87.2208 58.7141 87.04L61.2112 86.8705C65.0982 86.5654 69.1208 86.2603 72.8949 87.9326C75.1547 88.927 76.4994 90.5315 76.6237 92.3394C76.6602 93.7514 76.0583 95.1046 74.9853 96.023C74.0574 96.8007 72.9809 97.3812 71.8214 97.7292C67.6971 99.1304 63.3242 99.2095 59.1095 99.2886C55.8798 99.2425 52.6528 99.4998 49.4711 100.057C47.3467 100.373 45.3726 101.34 43.8214 102.825C42.6915 104.113 41.9344 106.362 42.9627 108C43.4452 108.691 44.0891 109.254 44.8384 109.639C47.7988 111.368 51.5276 111.673 54.8158 111.899C55.4398 111.924 55.9255 112.45 55.9005 113.074C55.8755 113.698 55.3494 114.184 54.7254 114.159L54.6237 114.147Z" fill="#3A304D"/>
        <path opacity="0.32" d="M77.6066 115.571C77.8591 114.119 77.4901 112.628 76.5899 111.461C75.6896 110.295 74.3407 109.56 72.8722 109.436C70.754 108.636 68.4109 108.673 66.3185 109.537C65.5408 109.819 64.7854 110.159 64.0586 110.554C63.8366 110.465 63.6055 110.401 63.3694 110.362C60.5219 109.888 57.9569 109.379 54.7931 111.21C52.9392 112.324 51.3872 113.876 50.2733 115.729C49.1276 117.374 48.6731 119.403 49.0078 121.379C49.4937 123.198 51.053 124.261 53.2564 124.566C53.9569 124.667 54.6914 124.792 55.4259 124.826C56.036 126.803 60.94 129.876 66.4767 128.215C72.2055 126.622 77.1547 120.588 77.6066 115.571Z" fill="#919BAA"/>
        <path d="M63.4486 111.108L63.5503 109.978C63.6504 109.113 63.6314 108.239 63.4938 107.379C63.1844 105.716 61.7913 104.472 60.1039 104.351C56.9853 104.125 54.1265 103.82 51.7311 106.294C48.72 109.753 48.2174 114.734 50.4768 118.724C51.748 120.7 53.9239 121.909 56.2734 121.944C58.3073 122.035 60.5559 122.306 61.7763 120.272C62.1662 119.52 62.4224 118.705 62.5333 117.865C62.9175 115.65 63.2339 113.379 63.4486 111.108Z" fill="#302842"/>
        <path d="M62.7366 103.075C57.8326 105.99 55.3129 113.176 57.0869 119.041C58.8609 124.905 64.4315 127.301 69.3468 124.374C74.262 121.448 76.7931 114.205 74.9965 108.397C73.1999 102.589 67.6857 100.148 62.7366 103.075Z" fill="#3A304D"/>
        <path d="M64.7593 103.446C59.8666 106.373 57.3469 113.616 59.1661 119.424C60.9853 125.232 66.5107 127.684 71.4372 124.746C76.3638 121.808 78.8723 114.576 77.0305 108.78C75.1887 102.983 69.6632 100.531 64.7593 103.446Z" fill="#6C667F"/>
        <path d="M65.7763 105.492C61.8102 107.854 59.7763 113.661 61.2565 118.396C62.7367 123.13 67.2 125.074 71.1774 122.712C75.1548 120.351 77.1887 114.532 75.6972 109.797C74.2057 105.063 69.7311 103.13 65.7763 105.492Z" fill="#3A304D"/>
        <path d="M71.844 110.594C70.9815 110.981 70.5482 111.954 70.8383 112.854C70.952 113.276 71.241 113.628 71.632 113.823C72.0231 114.017 72.4787 114.035 72.8835 113.871C73.7427 113.481 74.1782 112.513 73.9005 111.611C73.781 111.191 73.4894 110.84 73.0977 110.647C72.7059 110.453 72.2506 110.434 71.844 110.594V110.594Z" fill="#F5D793"/>
        <path d="M78.7819 111.171L72.4203 110.459L72.3186 113.996L78.6802 114.685L78.7819 111.171V111.171Z" fill="#F5D793"/>
        <path d="M78.2057 111.283C77.3388 111.666 76.9001 112.641 77.1887 113.543C77.3051 113.966 77.5963 114.318 77.9891 114.513C78.3819 114.707 78.8389 114.724 79.2452 114.56C80.1 114.166 80.5302 113.199 80.2509 112.3C80.1372 111.879 79.8483 111.526 79.4572 111.331C79.0662 111.137 78.6105 111.119 78.2057 111.283V111.283Z" fill="#E5BC60"/>
        <path d="M64.4316 114.271C63.5725 114.661 63.1369 115.629 63.4147 116.531C63.5336 116.951 63.8258 117.301 64.2183 117.493C64.6108 117.685 65.0664 117.701 65.4712 117.536C66.3337 117.15 66.767 116.176 66.4768 115.276C66.3575 114.859 66.0671 114.511 65.6774 114.32C65.2877 114.128 64.8352 114.11 64.4316 114.271V114.271Z" fill="#F5D793"/>
        <path d="M71.3582 114.813L65.0079 114.102L64.9062 117.638L71.2678 118.328L71.3582 114.813V114.813Z" fill="#F5D793"/>
        <path d="M70.7819 114.926C69.9233 115.317 69.4915 116.287 69.7762 117.186C69.8899 117.608 70.1789 117.96 70.5699 118.155C70.961 118.349 71.4166 118.367 71.8214 118.203C72.6883 117.82 73.127 116.846 72.8384 115.943C72.722 115.521 72.4308 115.168 72.038 114.974C71.6453 114.779 71.1882 114.762 70.7819 114.926V114.926Z" fill="#E5BC60"/>
      </svg>
      <div className="info-message w-75">
        <p className="font-sm ml-2">خطایی رخ داده است!</p>

        <strong className="text-blue font-sm" style={{cursor: "pointer"}} onClick={reloadAppHandler}>
            بارگذاری مجدد صفحه
        </strong>
      </div>
      <pre className="warning-message my-2">{error.message}</pre>
    </div>
  );
};

export default ErrorFallback;
