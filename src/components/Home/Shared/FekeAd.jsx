import React from 'react';
import LoadingAd from '../../UI/LoadingSkeleton/LoadingAd';
import DefaultAdGif from '../../../assets/images/Ad-GIF.gif';

const FekeAd = ({loading,adNumberClass}) => {
  return loading ? <LoadingAd /> : (
    <div className={adNumberClass}>
        <img src={DefaultAdGif} alt="تبلیغات" />
    </div>
  )
}

export default FekeAd