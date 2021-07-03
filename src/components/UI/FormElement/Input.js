import React, { useReducer, useEffect } from "react";

import "./Input.css";
import { validate } from "../../../util/validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "BLUR":
      return {
        ...state,
        isBlured: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: false,
    isBlured: false,
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

  const onBlurHandler = () => {
    dispatch({
      type: "BLUR",
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
        onBlur={onBlurHandler}
        className={
          !inputState.isValid && inputState.isBlured
            ? "wrong-data"
            : inputState.isValid && inputState.isBlured
            ? "correct-data"
            : null
        }
      />
    ) : (
      <textarea
        onChange={changeHandler}
        id={props.id}
        rows={props.rows || 5}
        placeholder={props.placeholder}
        value={inputState.value}
        onBlur={onBlurHandler}
        className={
          !inputState.isValid && inputState.isBlured
            ? "wrong-data"
            : inputState.isValid && inputState.isBlured
            ? "correct-data"
            : null
        }
      ></textarea>
    );

  return (
    <div>
      {element}
      {!inputState.isValid && inputState.isBlured && (
        <p className="err-text">{props.errorText}</p>
      )}
    </div>
  );
};

export default Input;
