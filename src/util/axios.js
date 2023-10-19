import axios from "axios";
import { store } from "../redux/store";
import { kickOut } from "../redux/Actions/authActions";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_GONSHAP_BASE_URL}`,
  withCredentials:true,
});

instance.defaults.withCredentials = true;

instance.interceptors.request.use(config => {
  const {userInfo : { csrfToken }} = store.getState().userSignin;
  config.headers['csrf-token'] = csrfToken ;

  return config;
})
instance.interceptors.response.use((response) => response , (error) => {
  // if(axios.isCancel(error)){
  //   console.log('->',error);
  // }
  if (error?.response?.status === 401) {
    store.dispatch(kickOut());
    toast.warn(error.response.data.message)
    throw error;
  }
  throw error;
});

export default instance;