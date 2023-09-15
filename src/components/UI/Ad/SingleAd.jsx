import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../../util/indexedDB'

const SingleAd = ({ad}) => {
    const [isStoreSupplier,setIsStoreSupplier] = useState(false)
    const [supplierSlug,setSupplierSlug] = useState(null)

    useEffect(() => {
        const getSupplier = async () => {
            const supplier = await db.supplierList
            .bulkGet([ad.phoneNumber])
        
            if(supplier[0]?.phoneNumber === ad.phoneNumber){
                setIsStoreSupplier(true)
                setSupplierSlug(supplier[0].slug)
            }
        }
        getSupplier()
    }, [isStoreSupplier,ad])

    return  isStoreSupplier ? (
            <Link to={`/supplier/introduce/${supplierSlug}`} className="tooltip">
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