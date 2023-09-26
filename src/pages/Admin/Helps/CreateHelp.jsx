import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import { TiDelete } from "react-icons/ti";

const CreateHelp = () => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);

  const [formState, inputHandler] = useForm({
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: true,
    },
  });

  //image-picker-codes
  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const pickedHandler = (e) => {
    if (e.target.files) {
      setFiles([...files, ...e.target.files]);
    }
    setFileUrls([...e.target.files]);
  };
  const setFileUrls = (files) => {
    const turnedUrls = files.map((file) => URL.createObjectURL(file));
    setUrls([...urls, ...turnedUrls]);
    if (urls.length > 0) {
      urls.forEach((url) => URL.revokeObjectURL(url));
    }
  };
  const removeImage = (index) => {
    const allUrls = [...urls];
    allUrls.splice(index, 1);
    setUrls(allUrls);

    const allFiles = [...files];
    allFiles.splice(index, 1);
    setFiles(allFiles);
  };
  //image-picker-codes

  //create-product-submit
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", formState.inputs.title.value);
    formData.append("description", formState.inputs.description.value);

    let filesLength = files.length;
    for (let i = 0; i < filesLength; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true);
    axios
      .post("/help/create", formData)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          setShowForm(false);
          setFiles([]);
          setUrls([]);
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
    <React.Fragment>
      <Button onClick={() => setShowForm(!showForm)}>
        {!showForm ? "ایجاد راهنما" : "بستن فرم"}
      </Button>
      {showForm && (
        <form
          className="auth-form"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <div className="image-upload-wrapper">
            <input
              ref={filePickerRef}
              type="file"
              accept=".jpg,.png,.jpeg"
              hidden
              multiple
              onChange={pickedHandler}
            />
            <div className="image-upload">
              <Button type="button" onClick={pickImageHandler}>
                انتخاب تصویر
              </Button>
            </div>
          </div>
          <div className="image-upload__preview">
            {urls &&
              urls.map((url, i) => (
                <div className="preview_img_wrapper" key={i}>
                  <span className="delete_img" onClick={() => removeImage(i)}>
                    <TiDelete />
                  </span>
                  <img src={url} alt="preview" />
                </div>
              ))}
          </div>
          <label className="auth-label">
            عنوان راهنما :<span className="need_to_fill">*</span>
          </label>
          <Input
            id="title"
            element="input"
            type="text"
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(20),
              VALIDATOR_MINLENGTH(3),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            placeholder="توضیحات"
            rows={12}
            onInput={inputHandler}
            validators={[
              VALIDATOR_MAXLENGTH(2000),
              VALIDATOR_MINLENGTH(100),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Button type="submit" disabled={loading || !formState.isValid}>
            {!loading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default CreateHelp;
