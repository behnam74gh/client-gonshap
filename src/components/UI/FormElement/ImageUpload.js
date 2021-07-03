import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsvalid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (e) => {
    // console.log(e.target);
    let pickedFile;
    let fileIsValid = isValid;

    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsvalid(true);
      fileIsValid = true;
    } else {
      setIsvalid(false);
      fileIsValid = false;
    }

    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="image-upload">
      <input
        id={props.id}
        ref={filePickerRef}
        type="file"
        accept=".jpg,.png,.jpeg"
        style={{ display: "none" }}
        onChange={pickedHandler}
      />
      <div className="container">
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="preview" />}
          {!previewUrl && <p>لطفا یک تصویر انتخاب کنید</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          انتخاب تصویر
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
