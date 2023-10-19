import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import axios from "../../../util/axios";

const HelpsList = () => {
  const [loading, setLoading] = useState(false);
  const [helps, setHelps] = useState([]);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("/fetch/list-of-helps")
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setHelps(response.data.helps);
          setErrorText("");
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, []);

  const removeHelpHandler = (id) => {
    if (window.confirm("برای حذف این راهنمایی مطمئن هستید؟")) {
      axios
        .delete(`/remove/this-help/${id}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            let oldHelps = helps;
            const newHelps = oldHelps.filter((help) => help._id !== id);
            setHelps(newHelps);
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.warning(err.response.data.message);
          }
        });
    }
  };

  return (
    <div className="w-100 text-center">
      <h4 className="text-center">لیست راهنمایی ها </h4>
      {loading ? (
        <VscLoading className="loader" />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr
                className="heading-table"
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th className="th-titles">عنوان</th>
                <th className="th-titles">توضیحات</th>
                <th className="th-titles">تصاویر</th>
                <th className="th-titles">حذف</th>
              </tr>
            </thead>
            <tbody>
              {helps?.length > 0
                ? helps.map((help) => (
                    <tr key={help._id}>
                      <td className="font-sm text-purple">
                        <strong>{help.title}</strong>
                      </td>
                      <td className="help_desc">
                        <p>{help.description}</p>
                      </td>
                      <td>
                        {help.photos.length > 0 ? (
                          <div className="help_img_wrapper">
                            {help.photos.map((photo, i) => (
                              <img
                                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${photo}`}
                                alt={help.title}
                                className="help_img"
                              />
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <span
                          className="d-flex-center-center font-md"
                          onClick={() => removeHelpHandler(help._id)}
                        >
                          <MdDelete className="text-red" />
                        </span>
                      </td>
                    </tr>
                  ))
                : errorText.length > 0 && (
                    <tr>
                      <td colSpan="3">
                        <p className="warning-message">{errorText}</p>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HelpsList;
