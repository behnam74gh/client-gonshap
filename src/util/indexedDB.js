import Dexie from "dexie";

const dbVersion = 1

export const db = new Dexie('bazarak_db');

db.version(dbVersion).stores({
    supplierList: 'phoneNumber, &phoneNumber',
    ads: '_id, &id',
    newestProducts: '_id, &id',
    discountProducts: '_id, &id',
    soldProducts: '_id, &id',
    reviewedProducts: '_id, &id',
    cartItemsInfo: '_id, &id',
    favoriteItems: '_id, &id',
    suggests: '_id, &id',
    faq: '_id, &id',
    companyInformation: '_id, &id',
    brands: '_id, &id',
    activeCategories: '_id, &id',
    subCategories: '_id, &id',
    helps: '_id, &id',
    productDetailes: '_id, &id',
    shopPage: '_id, &id'
})
