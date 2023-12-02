import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../../util/indexedDB'

const SingleAd = ({ad}) => {
    const [isStoreSupplier,setIsStoreSupplier] = useState(false)
    const [supplierId,setSupplierId] = useState(null)

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