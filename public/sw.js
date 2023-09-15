const self = this
// console.log('hi this is my first serviceWorker')

const cacheName = `bazarak-static-v-${1.14}` 

const HomePageUrls = [
    '/',
    '/assets/style/style.css',
    'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
    '/static/js/bundle.js',
    '/manifest.json',
    '/main.61bcceb0e50a5927cc55.hot-update.json',
    '/static/js/vendors-node_modules_dexie_dist_modern_dexie_mjs.chunk.js',
    '/static/js/vendors-node_modules_axios_index_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_md_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_io5_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_ri_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_bs_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_fa_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_classnames_index_js-node_modules_react-icons_io_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_react-slick_lib_index_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_hi_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_ai_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_fi_index_esm_js.chunk.js',
    '/static/js/src_layout_Layout_jsx-node_modules_react-icons_lib_esm_index_js.chunk.js',
    '/static/js/vendors-node_modules_react-icons_vsc_index_esm_js.chunk.js',
    '/static/js/vendors-node_modules_react-loading-skeleton_lib_index_js.chunk.js',
    '/static/js/vendors-node_modules_react-star-ratings_build_index_js.chunk.js',
    '/static/js/vendors-node_modules_react-leaflet_esm_MapContainer_js-node_modules_react-leaflet_esm_Marker_-de0ae7.chunk.js',
    '/static/js/src_components_UI_FormElement_Button_js-src_util_axios_js.chunk.js',
    '/static/js/src_components_UI_FormElement_Input_js-src_util_hooks_formHook_js.chunk.js',
    '/static/js/src_components_Home_Shared_LoadingSkeletonCard_jsx-src_components_Home_Shared_ProductCard_jsx.chunk.js',
    '/static/js/src_pages_Supplier_SupplierIntroduce_css.chunk.js',
    '/static/js/src_components_Home_Section2_Section2_jsx-src_components_UI_LoadingSkeleton_LoadingSkeleton_j-9b1f61.chunk.js',
    '/static/js/src_redux_Actions_shopActions_js-src_components_Home_Section3_Section3_css.chunk.js',
    '/logo192.png',
    'http://localhost:8000/uploads/images/77e05f70-4101-11ee-9418-51da708c68fd.png',
    '/static/js/src_components_Home_Section5_Section5_jsx-src_components_Home_Section8_Section8_jsx.chunk.js',
    '/static/js/src_components_Home_Section13_Section13_jsx.chunk.js',
    '/static/js/src_components_Home_Section6_Section6_jsx.chunk.js',
    '/static/js/src_pages_Home_Home_jsx.chunk.js',
    '/static/media/instalogo.36b647f014e2b2952a7b.png',
    '/static/media/telegram_PNG11.fddf2a3ec74d13e1ef9f.png',
    '/static/media/whatsapp-logo.ad253bf275e796b797e0.png',
    '/static/media/nemad-logo-1.42df37e1cd4303ab272e.png',
    '/static/media/nemad-logo-2.20d2be1a97c7e17a17ff.png',
    '/static/media/nemad-logo-3.77c51e8f9285a99b447f.png',
    '/static/media/Vazir-FD.f7b59344dab12cdd0ff8.woff',
    '/static/media/slick.295183786cd8a1389865.woff',
    '/favicon.ico',
    'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon-2x.png',
    'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
]
const CartPageUrls = [
    '/cart',
    '/static/js/src_components_UI_Backdrop_Backdrop_jsx-src_pages_Admin_CommentsList_CommentsList_css.chunk.js',
    '/static/js/src_pages_CartPage_CartPage_jsx.chunk.js',
]
const FavoritesPageUrls = [
    '/favorites',
    '/static/js/src_pages_MyFavorites_MyFavoritePage_jsx.chunk.js',
]

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            cache.addAll([
                ...HomePageUrls,
                ...CartPageUrls,
                ...FavoritesPageUrls,
                '/static/js/src_pages_Product_Product_jsx.chunk.js',
                '/shop',
                '/static/js/src_pages_Shop_ShopPage_jsx.chunk.js',
                '/static/js/vendors-node_modules_react-icons_lib_esm_index_js-node_modules_react-input-range-rtl_lib_js_i-426034.chunk.js',
            ])
        })
    )
})

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(existedCacheNames => {
            return Promise.all(
                existedCacheNames.forEach(ExistedcacheName => {
                    if (ExistedcacheName !== cacheName){
                        return caches.delete(ExistedcacheName)
                    }
                })
            )
        })
    )
    
})

self.addEventListener('fetch', e => {
   const inValidMethods = ['POST','PUT','PATCH']
    if(!inValidMethods.includes(e.request.method)){
        e.respondWith(
            caches.match(e.request)
            .then(response => {
                if (response) {
                    return response;
                }else{
                    return fetch(e.request)
                } 
            })
        )
    }
    
})

//push Event will trigger when a notification arrives
self.addEventListener('push', e => {
    const DEFAULT_TAG = 'simple-notification';
    console.log('push event',e);
    const notifData = e.data.json()

    const title = notifData.notification.title;
    const options = notifData.notification;

    if(!options.tag){
        options.tag = DEFAULT_TAG;
    }

    e.waitUntil(
       self.registration.showNotification(title,options)
    )
})

// self.addEventListener('notificationclick', e => {
//     console.log(e.notification);
    
//     switch(e.action){
//         case 'download-action':
//             promiseCahin = clients.openWindow('/');
//             break;
//         case 'show-action':
//             promiseCahin = clients.openWindow('/');
//             break;
//         default :
//         promiseCahin = clients.openWindow('/');
//         break;
//     }

//     notification.close()

//     e.waitUntil(promiseCahin)
// })