import React, { useReducer, useEffect } from "react";
import { validate } from "../../../util/validators";
import {BsShieldFillCheck} from 'react-icons/bs';
import {MdRemoveModerator} from 'react-icons/md';
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      const {isValid,errorMessages} = validate(action.val, action.validators)
      return {
        ...state,
        value: action.val,
        isValid: isValid,
        errMessages: errorMessages
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: false,
    errMessages: []
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const element =
    props.element === "input" ? (
      <input
        onChange={changeHandler}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onFocus={props.focusHandler}
        value={inputState.value}
        className={!inputState.isValid && inputState.errMessages.length > 0 ? "wrong-data" : inputState.isValid ? "correct-data" : null}
      />
    ) : (
      <textarea
        onChange={changeHandler}
        id={props.id}
        rows={props.rows || 5}
        placeholder={props.placeholder}
        value={inputState.value}
        className={!inputState.isValid && inputState.errMessages.length > 0 ? "wrong-data" : inputState.isValid ? "correct-data" : null}
      ></textarea>
    );

  return (
    <div className="input_wrapper">
      {element}
      {!inputState.isValid && (
        <ul className="err_messages_wrapper">
          {inputState.errMessages.length > 0 && inputState.errMessages.map((item,i) => {
            return (
              <li key={i} className="err-text">{item.message}</li>
            )
          })}
        </ul>
      )}
      <span className="validity">
        {inputState.isValid ? <BsShieldFillCheck className="text-green" />
        : inputState.errMessages.length > 0 && <MdRemoveModerator className="text-red" />}
      </span>
    </div>
  );
};

export default Input;
