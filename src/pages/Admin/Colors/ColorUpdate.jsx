import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import axios from "../../../util/axios";
import Button from "../../../components/UI/FormElement/Button";
import { Link } from "react-router-dom";
import { IoArrowUndoCircle } from "react-icons/io5";
import { useSelector } from "react-redux";

const ColorUpdate = ({ match, history }) => {
  const [colorLoading, setColorLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [colorName, setColorName] = useState("");
  const [color, setColor] = useState("");

  const { id } = match.params;
  const { userInfo : { role } } = useSelector(state => state.userSignin);

  useEffect(() => {
    axios
      .get(`/read/current-color/${id}`)
      .then((response) => {
        setColorLoading(false);
        if (response.data.success) {
          const { thisColor } = response.data;
          setColorName(thisColor.colorName);
          setColor(`#${thisColor.colorHex}`);
          setErrorText("");
        }
      })
      .catch((err) => {
        setColorLoading(false);
        if (err.response && err.response.data.message)
          setErrorText(err.response.data.message);
      });
  }, [id]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (colorName.length < 3 || !color.length) {
      return toast.warning("اسم رنگ و کد آن باید وارد شود!");
    }
    const newColor = color.split("#")[1];
    setLoading(true);
    axios
      .put(`/current-color/update/${id}`, {
        newColorName: colorName,
        newcolorHex: newColor,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          history.goBack();
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  return (
    <div className="admin-panel-wrapper">
      {colorLoading ? (
        <div className="loader_wrapper">
          <VscLoading className="loader" />
        </div>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (
        <>
          <div className="d-flex-around mb-2">
          <h4 className="current_item_info_to_update">
            ویرایش رنگ با نام&nbsp;
            <strong className="text-blue mx-2">
              {colorName && colorName.length > 0 && colorName}
            </strong>
            &nbsp; را با دقت انجام دهید!
          </h4>
          <Link to={role === 1 ? "/admin/dashboard/colors" : "/store-admin/dashboard/colors"} className="create-new-slide-link">
            <span className="sidebar-text-link">بازگشت به فهرست رنگ ها</span>
            <IoArrowUndoCircle className="font-md" />
          </Link>
          </div>

          <form
            className="auth-form edit-profile"
            encType="multipart/form-data"
            onSubmit={submitHandler}
          >
            <label className="auth-label">نام رنگ :</label>
            <input
              value={colorName}
              type="text"
              onChange={(e) => setColorName(e.target.value)}
            />
            <div className="d-flex-between my-1">
              <HexColorPicker color={color} onChange={setColor} />
              <span
                className="picked_color"
                style={{
                  background: color,
                  color: color < "#1f101f" ? "white" : "black",
                }}
              >
                {color}
              </span>
            </div>
            <br />

            <Button
              type="submit"
              disabled={!color.length || colorName.length < 3 || loading}
            >
              {!loading ? "ثبت" : <VscLoading className="loader" />}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ColorUpdate;
