import React, { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";
import Input from "../../components/UI/FormElement/Input";
import Button from "../../components/UI/FormElement/Button";
import { useForm } from "../../util/hooks/formHook";
import axios from "../../util/axios";
import { toast } from "react-toastify";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_SPECIAL_CHARACTERS,
} from "../../util/validators";

const CheckoutForms = ({
  cartItems,
  userInfo,
  setAddressSaved,
  addressSaved,
  categoriesLength,
  oldAddress
}) => {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [address, setAddress] = useState("");

  const [formState, inputHandler] = useForm(
    {
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    if(oldAddress.length > 0){
      setAddress(oldAddress)
    }
  }, [oldAddress])

  const setAddressToDBHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    axios
      .put("/save/user/address", { address: formState.inputs.address.value })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setSuccessMessage(response.data.message);
          setAddress(formState.inputs.address.value);
          setAddressSaved(true);
          address.length > 0 ?
          toast.success("آدرس شما تغییر کرد") :
          toast.success(response.data.message)
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          setErrorText(err.response.data.message[0]);
        } else {
          setErrorText(err.response.data.message);
        }
      });
  };
  
  const isSame = formState.inputs.address.value === address
  
  return (
    <React.Fragment>
      <div className="checkout_form_wrapper">
        <form onSubmit={setAddressToDBHandler}>
          <label className="auth-label">{successMessage.length > 0 ? "آدرس را میتوانید تغییر دهید" : "آدرس خود را وارد کنید"} :</label>
          <Input
            id="address"
            element="input"
            type="text"
            onInput={inputHandler}
            defaultValue={oldAddress}
            focusHandler={() => {
              setSuccessMessage("");
              setErrorText("");
            }}
            placeholder="جهت ارسال کالا"
            validators={[
              VALIDATOR_MAXLENGTH(300),
              VALIDATOR_MINLENGTH(10),
              VALIDATOR_SPECIAL_CHARACTERS(),
            ]}
          />
          <Button
            type="submit"
            disabled={
              !userInfo.userId.length > 0 ||
              !cartItems.length ||
              loading ||
              !formState.inputs.address.isValid || successMessage.length > 0 || isSame
            }
          >
            {!loading ? "ثبت آدرس" : <VscLoading className="loader" />}
          </Button>
        </form>
        {errorText.length > 0 ? (
          <p className="warning-message">{errorText}</p>
        ) : (
          addressSaved && address?.length > 0 && (
            <p className="attentionNote">آدرس شما : {address}</p>
          ) 
        )}
      </div>

     {categoriesLength > 1 && <div>
        <strong className="warningNote">لطفا توجه داشته باشید که :</strong>
        <p className="attentionNote">فاکتور خرید هر فروشگاه، به طور جداگانه به پنل کاربری شما ارسال خواهد شد</p>
      </div>}
    </React.Fragment>

  );
};

export default CheckoutForms;
