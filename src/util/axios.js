import axios from "axios";
import { store } from "../redux/store";
import { signout } from "../redux/Actions/authActions";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_GONSHAP_BASE_URL}`,
  withCredentials:true
});

instance.defaults.withCredentials = true;

instance.interceptors.response.use((response) => response, (error) => {
      console.log('1-> ',error);
      if (error.response.status === 401) {
        console.log("2=> ",error.response);
        store.dispatch(signout());
        toast.warn(error.response.data.message)
        throw error;
      }
      throw error;
});

export default instance;