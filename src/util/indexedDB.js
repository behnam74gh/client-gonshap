import Dexie from "dexie";

const dbVersion = 1

export const db = new Dexie('bazarchak_db');

db.version(dbVersion).stores({
    supplierList: 'phoneNumber',
    ads: '_id',
    cartItemsInfo: '_id, &id',
    favoriteItems: '_id',
    companyInformation: '_id',
    brands: '_id',
    activeCategories: '_id',
    subCategories: '_id',
    helps: '_id',
    productDetailes: '_id',
    regions: '_id'
})
