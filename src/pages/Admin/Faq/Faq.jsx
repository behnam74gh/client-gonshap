import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VscLoading } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";

import { useForm } from "../../../util/hooks/formHook";
import axios from "../../../util/axios";
import {
  VALIDATOR_PERSIAN_ALPHABET,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../../util/validators";
import Input from "../../../components/UI/FormElement/Input";
import Button from "../../../components/UI/FormElement/Button";

const Faq = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [faqs, setFaqs] = useState([]);

  const [formState, inputHandler] = useForm(
    {
      question: {
        value: "",
        isValid: false,
      },
      answer: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const loadAllFaqs = () => {
    axios
      .get("/get-all-faqs")
      .then((response) => {
        setFaqs(response.data.allFaqs);
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    loadAllFaqs();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    setLoading(true);
    axios
      .post("/faq/create", {
        question: formState.inputs.question.value,
        answer: formState.inputs.answer.value,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          toast.success(response.data.message);
          loadAllFaqs();
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

  const removeFaqHandler = (id) => {
    if (window.confirm("برای حذف این سوال مطئن هستید؟")) {
      axios
        .delete(`/faq-delete/${id}`)
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            loadAllFaqs();
          }
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          }
        });
    }
  };

  return (
    <div className="admin-panel-wrapper">
      {error.length > 0 && <p className="warning-message">{error}</p>}
      <h4>سوالات متداول</h4>
      <form className="auth-form" onSubmit={submitHandler}>
        <Input
          id="question"
          element="input"
          type="text"
          placeholder="سوال را بنویسید: "
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(400),
            VALIDATOR_MINLENGTH(8),
            VALIDATOR_PERSIAN_ALPHABET(),
          ]}
        />
        <Input
          id="answer"
          element="textarea"
          row="8"
          type="text"
          placeholder="پاسخ را بنویسید: "
          onInput={inputHandler}
          validators={[
            VALIDATOR_MAXLENGTH(400),
            VALIDATOR_MINLENGTH(40),
            VALIDATOR_PERSIAN_ALPHABET(),
          ]}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {!loading ? "ثبت" : <VscLoading className="loader" />}
        </Button>
      </form>
      <hr />
      <div className="table-wrapper">
        <table>
          <thead>
            <tr className="heading-table">
              <th className="th-titles">سوال</th>
              <th className="th-titles">پاسخ</th>
              <th className="th-titles">حذف</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length > 0 &&
              faqs.map((fa, i) => (
                <tr key={i}>
                  <td className="font-sm">{fa.question}</td>
                  <td className="font-sm">{fa.answer}</td>
                  <td>
                    <span
                      className="d-flex-center-center"
                      onClick={() => removeFaqHandler(fa._id)}
                    >
                      <MdDelete className="text-red" />
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Faq;
