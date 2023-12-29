import React, { useState } from 'react'
import Button from '../../../components/UI/FormElement/Button';
import { VscLoading } from 'react-icons/vsc';
import { toast } from "react-toastify";
import axios from "../../../util/axios";

const ModalStoreDetails = ({store,closeModal}) => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(store.phoneNumber || null);

  const submitHandler = (e) => {
    e.preventDefault();

    setLoading(true);
    axios
      .put(`/supplier/update/owner-phone-number/${store._id}`, {phoneNumber})
      .then(res => {
        setLoading(false);
        if(res.data.success){
            toast.success(res.data.message);
            closeModal();
        }
      })
      .catch(err => {
        setLoading(false);
        if(err && err.response){
            toast.success(err.response.data.message || "عملیات ناموفق بود");
        }
      })
  };

  return (
    <div className="admin-panel-wrapper">
        <p className='font-sm my-0'>تغییر شماره مالک غرفه</p>
        <form
          className="auth-form"
          encType="multipart/form-data"
          onSubmit={submitHandler}
        >
          <input
            name="phoneNumber"
            value={phoneNumber}
            type="text"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button type="submit" disabled={phoneNumber?.length < 10 || loading}>
            {!loading ? "ثبت" : <VscLoading className="loader" />}
          </Button>
        </form>
    </div>
  )
}

export default ModalStoreDetails