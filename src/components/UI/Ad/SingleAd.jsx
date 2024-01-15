import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../../util/indexedDB'
import { useDispatch } from 'react-redux';
import { POP_STORE_ITEM } from '../../../redux/Types/supplierItemTypes';
import { CLEAR_SUPPLIER_PRODUCTS } from '../../../redux/Types/supplierProductsTypes';

const SingleAd = ({ad}) => {
    const [isStoreSupplier,setIsStoreSupplier] = useState(false);
    const [supplierId,setSupplierId] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        let mounted = true;
        const getSupplier = async () => {
            const supplier = await db.supplierList
            .bulkGet([ad.phoneNumber])
        
            if(supplier[0]?.phoneNumber === ad.phoneNumber && mounted){
                setIsStoreSupplier(true)
                setSupplierId(supplier[0]._id)
            }
        }
        getSupplier()

        return () => {
            mounted = false;
        }
    }, [isStoreSupplier,ad])

    return  isStoreSupplier ? (
            <Link to={`/supplier/introduce/${supplierId}`} className="tooltip">
                <span className="tooltip_text">{ad.title}</span>
                <img
                    src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ad.photos[0]}`}
                    alt={ad.title}
                    onClick={() => {
                        dispatch({type: POP_STORE_ITEM});
                        dispatch({type: CLEAR_SUPPLIER_PRODUCTS});
                        localStorage.removeItem("gonshapSupplierActiveSub");
                        localStorage.removeItem("bazarchakSupplierActiveorder");
                        localStorage.removeItem("gonshapSupplierPageNumber");
                    }}
                />
            </Link>
            ) : ad.linkAddress?.length > 0 ? (
            <a
                href={`https://www.${ad.linkAddress}`}
                target="_blank"
                rel="noreferrer"
                className="tooltip"
            >
                <span className="tooltip_text">{ad.title}</span>
                <img
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ad.photos[0]}`}
                alt={ad.title}
                />
            </a>
            ) : (
            <Link to={`/advertise-page/${ad.slug}`} className="tooltip">
                <span className="tooltip_text">{ad.title}</span>
                <img
                src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${ad.photos[0]}`}
                alt={ad.title}
                />
            </Link>
            )
}

export default SingleAd