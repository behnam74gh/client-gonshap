import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import axios from "../../../util/axios";
import DatePicker,{DateObject} from "react-multi-date-picker";
import { useSelector,useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import { HiBadgeCheck } from "react-icons/hi";
import { STORE_ADMIN_PHONENUMBER } from "../../../redux/Types/authTypes";
import { AREA_CHART, CURRENT_SUPPLIER, ORDERS_COUNT, TASKS } from "../../../redux/Types/ttlDataTypes";
import "./Notices.css";

const Notices1 = ({date,setParticularDateHandler}) => {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [tasksError, setTasksError] = useState("");
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [supplier, setSupplier] = useState({});

  const {userInfo : {role,supplierFor}, phoneNumber} = useSelector(state => state.userSignin);
  const { tasks, ordersCount, currentSupplier } = useSelector(state => state.ttlDatas);
  const dispatch = useDispatch();

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;
    if(Date.now() > tasks.ttlTime){
      axios
      .get("/get/todays-tasks",{signal: ac.signal})
      .then((response) => {
        if (response.data.success && mounted) {
          setTodaysTasks(response.data.tasks);
          setTasksError("");
          dispatch({
            type: TASKS,
            payload: {
              ttlTime : Date.now()+(1000*60*60*24),
              data: response.data.tasks
            }
          });
        }
      })
      .catch((err) => {
        if (err.response && mounted) setTasksError(err.response.data.message);
      });
    }else{
      if(tasks.data !== null && mounted){
        setTodaysTasks(tasks.data);
      }
    }

    return () => {
      ac.abort()
      mounted = false;
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;
    if(Date.now() > ordersCount.ttlTime) {
      axios.post("/new-orders/count",{category: role === 2 ? supplierFor : null},{signal: ac.signal})
      .then((response) => {
        if (response.data.success && mounted) {
          setNewOrdersCount(response.data.count);
          setErrorText("");
          dispatch({
            type: ORDERS_COUNT,
            payload: {
              ttlTime : Date.now()+(1000*60*10),
              data: response.data.count
            }
          });
        }
      })
      .catch((err) => {
        if (err.response && mounted) setErrorText(err.response.data.message);
      });
    }else{
      if(ordersCount.data !== null && mounted){
        setNewOrdersCount(ordersCount.data);
      }
    }

    return () => {
      ac.abort()
      mounted = false;
    }
  }, [role,supplierFor])

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;
    if(role === 1){
      return;
    }
    if(Date.now() > currentSupplier.ttlTime) {
      axios
      .get("/get/current-supplier",{signal: ac.signal})
      .then((response) => {
        if (response.data.success && mounted) {
          setSupplier(response.data.supplier);
          dispatch({
            type: CURRENT_SUPPLIER,
            payload: {
              ttlTime : Date.now()+(1000*60*60*24),
              data: response.data.supplier
            }
          });
          if(phoneNumber?.length < 1){
            dispatch({
              type: STORE_ADMIN_PHONENUMBER,
              payload: response.data.supplier.phoneNumber
            })
            localStorage.setItem("storeOwnerPhoneNumber",response.data.supplier.phoneNumber)
          }
        }
      })
      .catch((err) => {
        if (err.response && mounted) toast.warning(err.response.data.message);
      });
    }else{
      if(currentSupplier.data !== null && mounted){
        setSupplier(currentSupplier.data);
        if(phoneNumber?.length < 1){
          dispatch({
            type: STORE_ADMIN_PHONENUMBER,
            payload: currentSupplier.data.phoneNumber
          })
          localStorage.setItem("storeOwnerPhoneNumber",currentSupplier.data.phoneNumber)
        }
      }
    } 

    return () => {
      ac.abort()
      mounted = false;
    }
  }, [role])
  
  const setDateHandler = (value) => {
    if (value instanceof DateObject) value = value.toDate();
    setParticularDateHandler(value);
    dispatch({
      type: AREA_CHART,
      payload: {
        ttlTime : 0,
        data: null
      }
    });
  };

  return (
    <div className="notice1_wrapper">
      {role === 2 && <div className="notice">
        <div className="notice_title">
        <strong>داشبورد فروشگاهِ {supplier.title}</strong>
        {supplier.authentic && <HiBadgeCheck className="text-blue font-md mr-1" />}
        </div>
        <div className="notice_point">
          <span>تعداد فروش : </span>
          <strong>{supplier.soldCount > 999 ? (supplier.soldCount/1000).toFixed(1) :
           supplier.soldCount > 0 ? supplier.soldCount : 0}
           </strong>
          {supplier.soldCount > 999 && <span className='ml-1'>K</span>}
        </div>
        <div className="notice_point">
          <span>امتیاز : </span>
          <strong>{supplier.point > 999999 ? (supplier.point/1000000).toFixed(1) : supplier.point > 999 ? (supplier.point/1000).toFixed(1) : supplier.point}</strong>
          {supplier.point > 999999 ? <span className='ml-1'>M</span> : supplier.point > 999 && <span className='ml-1'>K</span>}
        </div>
      </div>}
      <div className="notice_1" style={{flexBasis: role === 1 && "100%"}}>
        <span>وظایف امروز :</span>
        <strong>
          {tasksError.length > 0 ? (
            tasksError
          ) : todaysTasks.length > 0 ? (
            <Typewriter
              options={{
                strings: todaysTasks,
                autoStart: true,
                loop: true,
                pauseFor: 5000,
                delay: 100,
              }}
            />
          ) : (
            "یادداشتی ثبت نشده است"
          )}
        </strong>
      </div>

      {errorText.length > 0 ? <p className="warning-message">{errorText}</p> 
        : <div className="notice_1">
            <span>سفارش های جدید :</span>
            <strong>{newOrdersCount}</strong>
          </div>
      }

      <DatePicker
        value={date}
        onChange={setDateHandler}
        placeholder="آمار میزان فروش بر اساس تاریخ"
        calendar="persian"
        locale="fa"
        calendarPosition="bottom-right"
        style={{ height: "40px" }}         
      />
    </div>
  );
};

export default Notices1;
