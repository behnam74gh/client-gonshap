import React, { useReducer, useEffect, useState } from "react";
import { validate } from "../../../util/validators";
import {BsShieldFillCheck} from 'react-icons/bs';
import {MdRemoveModerator} from 'react-icons/md';
import {TbEyeglassOff,TbEyeglass} from 'react-icons/tb';
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      const {validatedValue,isValid,errorMessages} = validate(action.val, action.validators)
      return {
        ...state,
        value: validatedValue,
        isValid: isValid,
        errMessages: errorMessages
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [showPassText,setShowPassText] = useState(false)
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: false,
    errMessages: []
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    if(props.defaultValue?.length > 0){
      dispatch({
        type: "CHANGE",
        val: props.defaultValue,
        validators: props.validators,
      });
    }
  }, [props.defaultValue])

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
        type={showPassText ? "text" : props.type}
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

  const toogleShowPassHandler = () => {
    setShowPassText(!showPassText)
  }

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
      {['password','repeatPassword'].includes(props.id) &&
      <span className="seeHiddenPass" onClick={toogleShowPassHandler}>
        {showPassText ? <TbEyeglass className="text-mute" /> : <TbEyeglassOff className="text-silver" />}
      </span>}
    </div>
  );
};

export default Input;
