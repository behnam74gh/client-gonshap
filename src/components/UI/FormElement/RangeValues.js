import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import InputRange from 'react-input-range-rtl';
import { PUT_RANGE_VALUES } from '../../../redux/Types/rangeInputTypes';

const RangeValues = () => {
  const [rangeValues, setRangeValues] = useState({
    min: 10,
    max: 5000,
  });

  const {rangeValues: { min, max}} = useSelector(state => state);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    setRangeValues({
        min: min,
        max: max
    })
  }, [min,max])

  useEffect(() => {
    const delayed = setTimeout(() => {   
      dispatch({
        type: PUT_RANGE_VALUES,
        payload: {
            min: rangeValues.min,
            max: rangeValues.max
        }
      })
    },500)

    return () => clearTimeout(delayed)
  }, [rangeValues])

  return (
    <InputRange
        maxValue={99999}
        minValue={10}
        step={1}
        direction="rtl"
        draggableTrack={false}
        onChange={(value) => {
            setRangeValues(value);
        }}
        value={rangeValues}
        formatLabel={(value) => {
            const newValue = value + "000";
            return `${Number(newValue).toLocaleString("fa")} تومان`;
        }}
    />
  )
}

export default RangeValues