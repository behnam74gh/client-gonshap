import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import { toast } from "react-toastify";
import Button from "../../../components/UI/FormElement/Button";
import axios from "../../../util/axios";
import "../Category/Category.css";

const RegionUpdate = ({ history, match }) => {
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("");

  const { id } = match.params;

  useEffect(() => {
    axios
      .get(`/region/${id}`)
      .then((response) => {
        if (response.data.success) {
          setRegion(response.data.region.name);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        }
      });
  }, [id]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let str = region.match(/^[\u0600-\u06FF\s]+$/);
    if (!str) {
      toast.warning("لطفا از حروف فارسی استفاده کنید!");
      setLoading(false);
      return;
    }
    axios
      .put(`/region/${id}`, { newRegionName: region })
      .then((response) => {
        if (response.data.success) {
          setLoading(false);
          toast.success(response.data.message);
          setRegion("");
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
      <h4>ویرایش نام منطقه</h4>
      <form className="auth-form" onSubmit={submitHandler}>
        <input
          type="text"
          onChange={(e) => setRegion(e.target.value)}
          value={region}
        />
        <Button type="submit" disabled={region.length === 0}>
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
    </div>
  );
};

export default RegionUpdate;
