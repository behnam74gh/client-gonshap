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
const VALIDATOR_TYPE_REPEAT_PASSWORD = "REPEAT_PASSWORD";
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
export const VALIDATOR_REPEAT_PASSWORD = (val) => ({
  type: VALIDATOR_TYPE_REPEAT_PASSWORD,
  val: val,
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
  let errorMessages = [];

  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      let validatorTypeIsValid = false;
      if(value.trim().length > 0){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "require")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "require", message: "نباید خالی بگذارید"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      let validatorTypeIsValid = false;
      if(value.trim().length >= validator.val){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "min-length")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "min-length" , message: `حداقل ${validator.val} حرف وارد کنید`})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      let validatorTypeIsValid = false;
      if(value.trim().length <= validator.val){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "max-length")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "max-length" , message: `بیشتر از ${validator.val} حرف وارد نکنید`})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_MIN) {
      let validatorTypeIsValid = false;
      if(+value >= validator.val){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "min")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "min" , message: `کمتر از ${validator.val} وارد نکنید`})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_MAX) {
      let validatorTypeIsValid = false;
      if(+value <= validator.val){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "max")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "max" , message: `بیشتر از ${validator.val} وارد نکنید`})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_SPECIAL_CHARACTERS) {
      let validatorTypeIsValid = false;
      if(!/[~`@#$%^&()_={}[\]:;÷|"';×*,<>+/?]/.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "special-ch")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "special-ch" , message: "استفاده از این عملگر(علامت) مجاز نیست"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_SPECIAL_CHARACTERS_2) {
      let validatorTypeIsValid = false;
      if(!/[~`$^={}[\];÷|"';×,<>+/?]/.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "special-ch-2")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "special-ch-2" , message: "استفاده از این عملگر(علامت) مجاز نیست"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_SPECIAL_CHARACTERS_3_LINK) {
      let validatorTypeIsValid = false;
      if(!/[~`$^_={}[\];÷|"';×,!:<>+?]/.test(value) && !/[\u0600-\u06FF\s]+$/.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "special-ch-3")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "special-ch-3" , message: "استفاده از این عملگر(علامت) مجاز نیست"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_NUMBER) {
      let validatorTypeIsValid = false;
      if(/[0-9]*$/.test(value) && value > 0){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "number")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "number" , message: "عدد وارد کنید"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_AUTHNUMBER) {
      let validatorTypeIsValid = false;
      if(/^(?=^.{6,7}$)[0-9]*$/.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "authNumber")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "authNumber" , message: "کد تایید باید 6 یا 7 رقم باشد"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_PASSWORD) {
      let validatorTypeIsValid = false;
      if(/^(?=^.{6,14}$)((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.*$/.test(value) && !/\s{1,}/.test(value) && /^[A-Za-z0-9]*$/.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "password")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "password" , message: "رمز باید شامل اعداد و حداقل یک حرف بزرگ ویک حرف کوچک انگلیسی باشد"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_REPEAT_PASSWORD) {
      let validatorTypeIsValid = false;
      if(value === validator.val){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "repeat_password")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "repeat_password" , message: "رمز بالا را دقیقا تکرار کنید"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_PERSIAN) {
      let validatorTypeIsValid = false;
      const duplicateSpaceRegex = new RegExp(/\s{2,}/);
      const persianAlphabetRegex = new RegExp(/^[\u0600-\u06FF\s]+$/);

      if(!duplicateSpaceRegex.test(value) && persianAlphabetRegex.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "persian")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "persian" , message: "از حروف فارسی استفاده کنید"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_PHONENUMBER) {
      let validatorTypeIsValid = false;
      if(/09(1[0-9]|3[0-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}/.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "phoneNumber")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "phoneNumber" , message: "شماره باید با 09 شروع شود و 11 رقم باشد"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_CONSTANTNUMBER) {
      let validatorTypeIsValid = false;
      if(/^0[1-9]{2}[0-9]{8}$/.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "constantNumber")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "constantNumber" , message: "شماره باید با 01 شروع شود و 11 رقم باشد"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
    if (validator.type === VALIDATOR_TYPE_ENGLISH) {
      let validatorTypeIsValid = false;
      if(/^[A-Za-z][A-Za-z0-9]*$/.test(value)){
        validatorTypeIsValid = true;
        errorMessages = errorMessages.filter(item => item.type !== "english")
      }else{
        validatorTypeIsValid = false;
        errorMessages.push({type: "english" , message: "از حروف انگلیسی استفاده کنید"})
      }
      isValid = isValid && validatorTypeIsValid;
    }
  }
  return {isValid,errorMessages};
};

// برای حروف فارسی /^[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF]+$/.test(value);

//برای رمز عبور /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/
