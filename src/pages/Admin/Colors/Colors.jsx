import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { HexColorPicker } from "react-colorful";
import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_PERSIAN_ALPHABET,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import ListOfColors from "../../../components/AdminDashboardComponents/ListOfColors";
import "./Colors.css";

const Colors = () => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [colors, setColors] = useState([]);
  const [reRenderForm, setReRenderForm] = useState(true);
  const [color, setColor] = useState("");

  const [formState, inputHandler] = useForm(
    {
      colorName: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const loadAllColors = () => {
    axios
      .get("/get-all-colors")
      .then((response) => {
        if (response.data.success) {
          setColors(response.data.colors);
          setErrorText("");
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    if (!reRenderForm) {
      setReRenderForm(true);
    }
  }, [reRenderForm]);

  useEffect(() => {
    loadAllColors();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    const newColor = color.split("#")[1];
    setLoading(true);
    axios
      .post("/create-color", {
        colorName: formState.inputs.colorName.value,
        colorHex: newColor,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          loadAllColors();
          setColor("");
          setReRenderForm(false);
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
      {errorText.length > 0 && <p className="warning-message">{errorText}</p>}
      <h4>برند موردنظر را ایجاد کنید!</h4>
      {reRenderForm && (
        <form
          className="auth-form"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <label className="auth-label">اسم رنگ :</label>
          <Input
            id="colorName"
            element="input"
            type="text"
            placeholder="مثال: قرمز"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(30),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_PERSIAN_ALPHABET(),
            ]}
          />
          <label className="auth-label">رنگ :</label>
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
            disabled={!formState.inputs.colorName.isValid || !color.length}
          >
            {!loading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
        </form>
      )}
      <hr />
      <ListOfColors colors={colors} />
    </div>
  );
};

export default Colors;
