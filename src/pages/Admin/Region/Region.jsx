import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import {
  VALIDATOR_PERSIAN_ALPHABET,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";
import ListOfRegions from "../../../components/AdminDashboardComponents/ListOfRegions";
import "../Category/Category.css";

const Region = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regions, setRegions] = useState([]);

  const [formState, inputHandler] = useForm(
    {
      region: {
        value: "",
        isValid: false,
      },
    },
    false
  );


  const loadAllRegions = () => {
    axios
      .get("/get-all-regions")
      .then((response) => {
        if (response.data.success) {
            setRegions(response.data.regions);
        }
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  };

  
  useEffect(() => {
    loadAllRegions();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/create-region", {
        regionName: formState.inputs.region.value,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          loadAllRegions();
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
      {error.length > 0 && <p className="warning-message">{error}</p>}
      <strong>اسم منطقه (شهر) را بنویسید</strong>
      <form className="auth-form" onSubmit={submitHandler}>
        <Input
          id="region"
          element="input"
          type="text"
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(30),
            VALIDATOR_MINLENGTH(3),
            VALIDATOR_PERSIAN_ALPHABET(),
          ]}
        />
        <Button type="submit" disabled={!formState.inputs.region.isValid}>
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
      <hr />
      <ListOfRegions regions={regions} />
    </div>
  );
};

export default Region;
