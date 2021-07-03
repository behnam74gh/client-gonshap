const VALIDATOR_TYPE_REQUIRE = "REQUIRE";
const VALIDATOR_TYPE_MINLENGTH = "MINLENGTH";
const VALIDATOR_TYPE_MAXLENGTH = "MAXLENGTH";
const VALIDATOR_TYPE_MIN = "MIN";
const VALIDATOR_TYPE_MAX = "MAX";
const VALIDATOR_TYPE_FILE = "FILE";
const VALIDATOR_TYPE_PHONENUMBER = "PHONENUMBER";
const VALIDATOR_TYPE_CONSTANTNUMBER = "CONSTANTNUMBER";
const VALIDATOR_TYPE_PERSIAN = "PERSIAN";
const VALIDATOR_TYPE_AUTHNUMBER = "AUTHNUMBER";
const VALIDATOR_TYPE_NUMBER = "NUMBER";
const VALIDATOR_TYPE_PASSWORD = "PASSWORD";
const VALIDATOR_TYPE_SPECIAL_CHARACTERS = "SPECIAL_CHARACTERS";
const VALIDATOR_TYPE_SPECIAL_CHARACTERS_2 = "SPECIAL_CHARACTERS_2";
const VALIDATOR_TYPE_SPECIAL_CHARACTERS_3_LINK = "SPECIAL_CHARACTERS_3_LINK";
const VALIDATOR_TYPE_ENGLISH = "ENGLISH_NUMERIC_ONLY";

export const VALIDATOR_REQUIRE = () => ({ type: VALIDATOR_TYPE_REQUIRE });
export const VALIDATOR_FILE = () => ({ type: VALIDATOR_TYPE_FILE });
export const VALIDATOR_MINLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  val: val,
});
export const VALIDATOR_MAXLENGTH = (val) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  val: val,
});
export const VALIDATOR_MIN = (val) => ({ type: VALIDATOR_TYPE_MIN, val: val });
export const VALIDATOR_MAX = (val) => ({ type: VALIDATOR_TYPE_MAX, val: val });
export const VALIDATOR_PHONENUMBER = () => ({
  type: VALIDATOR_TYPE_PHONENUMBER,
});
export const VALIDATOR_CONSTANTNUMBER = () => ({
  type: VALIDATOR_TYPE_CONSTANTNUMBER,
});
export const VALIDATOR_PERSIAN_ALPHABET = () => ({
  type: VALIDATOR_TYPE_PERSIAN,
});
export const VALIDATOR_AUTHNUMBER = () => ({
  type: VALIDATOR_TYPE_AUTHNUMBER,
});
export const VALIDATOR_NUMBER = () => ({
  type: VALIDATOR_TYPE_NUMBER,
});
export const VALIDATOR_PASSWORD = () => ({
  type: VALIDATOR_TYPE_PASSWORD,
});
export const VALIDATOR_SPECIAL_CHARACTERS = () => ({
  type: VALIDATOR_TYPE_SPECIAL_CHARACTERS,
});
export const VALIDATOR_SPECIAL_CHARACTERS_2 = () => ({
  type: VALIDATOR_TYPE_SPECIAL_CHARACTERS_2,
});
export const VALIDATOR_SPECIAL_CHARACTERS_3_LINK = () => ({
  type: VALIDATOR_TYPE_SPECIAL_CHARACTERS_3_LINK,
});
export const VALIDATOR_ENGLISH_NUMERIC = () => ({
  type: VALIDATOR_TYPE_ENGLISH,
});

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= validator.val;
    }
    if (validator.type === VALIDATOR_TYPE_SPECIAL_CHARACTERS) {
      isValid = isValid && !/[~`@#$%^&()_={}[\]:;÷|"';×*,<>+/?]/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_SPECIAL_CHARACTERS_2) {
      isValid = isValid && !/[~`$^={}[\];÷|"';×,<>+/?]/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_SPECIAL_CHARACTERS_3_LINK) {
      isValid =
        isValid &&
        !/[~`$^_={}[\];÷|"';×,!:<>+?]/.test(value) &&
        !/[\u0600-\u06FF\s]+$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_NUMBER) {
      isValid = isValid && /[0-9]*$/.test(value) && value > 0;
    }
    if (validator.type === VALIDATOR_TYPE_AUTHNUMBER) {
      isValid = isValid && /^(?=^.{6,7}$)[0-9]*$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_PASSWORD) {
      isValid =
        isValid &&
        /^(?=^.{6,14}$)((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.*$/.test(
          value
        ) &&
        !/\s{1,}/.test(value) &&
        /^[A-Za-z0-9]*$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_PERSIAN) {
      const duplicateSpaceRegex = new RegExp(/\s{2,}/);
      const persianAlphabetRegex = new RegExp(/^[\u0600-\u06FF\s]+$/);
      isValid =
        isValid &&
        !duplicateSpaceRegex.test(value) &&
        persianAlphabetRegex.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_PHONENUMBER) {
      isValid =
        isValid && /09(1[0-9]|3[0-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_CONSTANTNUMBER) {
      isValid = isValid && /^0[1-9]{2}[0-9]{8}$/.test(value);
    }
    if (validator.type === VALIDATOR_TYPE_ENGLISH) {
      isValid = isValid && /^[A-Za-z][A-Za-z0-9]*$/.test(value);
    }
  }
  return isValid;
};

// برای حروف فارسی /^[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]+$/.test(value);

//برای رمز عبور /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/
