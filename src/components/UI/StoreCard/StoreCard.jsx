import React, { useEffect, useState } from 'react';
import Button from '../FormElement/Button';
import { HiBadgeCheck, HiLocationMarker } from 'react-icons/hi';
import {BsFillCartCheckFill} from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import {PUSH_STORE_ITEM} from '../../../redux/Types/supplierItemTypes';
import { calculateResultHandler } from '../../../util/customFunctions';
import './StoreCard.css';

const StoreCard = ({item}) => {
  const [ratingResult, setRatingResult] = useState(0);
  const [soldResult, setSoldResult] = useState(0);
  
  const dispatch = useDispatch();



  useEffect(() => {
    calculateResultHandler(item.point,setRatingResult)
    calculateResultHandler(item.soldCount,setSoldResult)
  }, [item]);

  return (
    <div className='store_card_container'>
        <img
        src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${item.photos[0]}`}
        alt={item.title}
        className="store_card_img"
        />
        <div className='store_card_info'>
        <strong className='store_title'>{item.title} {item.authentic && <HiBadgeCheck className="text-blue font-md mr-1" />}</strong>
        <span className='store_title'>نوع محصولات : {item.backupFor.name}</span>
        <span className='store_title'>مالک : {item.owner}</span>
        <span className='store_title'><HiLocationMarker className='text-blue' /> {item.region.name}</span>
        <span className='store_title'>
          <BsFillCartCheckFill className={
              soldResult < 1 ? "text-silver" : "text-blue"
            } />
          <span className="font-sm pt-1 mr-1">
            {soldResult}
            {item.soldCount > 999999 ? <span className='ml-1'>M</span> : item.soldCount > 999 && <span className='ml-1'>K</span>}
            <span className="text-mute mr-1">فروش</span>
          </span>
        </span>
        <div className='rating_wrapper'>
          <FaStar
            className={
              ratingResult < 1 ? "text-silver font-md" : "text-orange font-md"
            }
          />
          <span className="font-sm pt-1 mr-1">
            {ratingResult}
            {item.point > 999999 ? <span className='ml-1'>M</span> : item.point > 999 && <span className='ml-1'>K</span>}
            <span className="text-mute mr-1">امتیاز</span>
          </span>

          <Button to={`/supplier/introduce/${item._id}`} click={() => dispatch({type: PUSH_STORE_ITEM,payload: item})} 
            style={{alignSelf: "flex-end",marginRight: "auto",minHeight: "unset",padding: "2px 8px 4px"}}
          >دیدن</Button>
        </div>
        
        </div>
    </div>
  )
}

export default StoreCard