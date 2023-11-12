import React, { useEffect, useState } from 'react';
import Button from '../FormElement/Button';
import './StoreCard.css';
import { HiBadgeCheck, HiLocationMarker } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';

const StoreCard = ({item}) => {
  const [ratingResult, setRatingResult] = useState(0);

  useEffect(() => {
    if(item.point > 999999){
      setRatingResult((item.point/1000000).toFixed(1))
    }else if(item.point > 999){
      setRatingResult((item.point/1000).toFixed(1))
    }else if (item.point > 0){
     setRatingResult(item.point)
    }
  }, []);

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

          <Button to={`/supplier/introduce/${item.slug}`} 
            style={{alignSelf: "flex-end",marginRight: "auto",minHeight: "unset",padding: "2px 8px 4px"}}
          >دیدن</Button>
        </div>
        
        </div>
    </div>
  )
}

export default StoreCard