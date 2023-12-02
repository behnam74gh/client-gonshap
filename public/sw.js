const self = this

const cacheName = `bazarchak-static-v-${0.03}`

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                cache.addAll([
                    '/static/js/bundle.js',
                    '/static/js/vendors-node_modules_react-icons_vsc_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_md_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_bs_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_io5_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_ri_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_fa_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_hi_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-slick_lib_index_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_io_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_si_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_ai_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_fi_index_esm_js.chunk.js',
                    '/static/media/logo-alternative.37a93587bb8a948b9d36.png',
                    '/static/js/src_layout_Layout_jsx.chunk.js',
                    '/static/js/vendors-node_modules_react-icons_tb_index_esm_js.chunk.js',
                    '/static/js/vendors-node_modules_react-loading-skeleton_lib_index_js.chunk.js',
                    '/static/js/vendors-node_modules_react-star-ratings_build_index_js.chunk.js',
                    '/static/js/vendors-node_modules_react-leaflet_esm_MapContainer_js-node_modules_react-leaflet_esm_Marker_-de0ae7.chunk.js',
                    '/static/js/src_components_UI_FormElement_Button_js-src_components_UI_FormElement_Input_js-src_util_hooks-fbb426.chunk.js',
                    '/static/js/src_components_Home_Shared_ProductCard_jsx.chunk.js',
                    '/static/js/src_components_Home_Shared_LoadingSkeletonCard_jsx-src_redux_Actions_cartActions_js-src_asset-a461ad.chunk.js',
                    '/static/js/src_components_Home_Shared_FekeAd_jsx-src_components_UI_Ad_SingleAd_jsx.chunk.js',
                    '/static/js/src_pages_Supplier_SupplierIntroduce_css.chunk.js',
                    '/static/js/src_redux_Actions_shopActions_js-src_components_Home_Section3_Section3_css-node_modules_react-b4bcc2.chunk.js',
                    '/static/js/src_components_Home_Section6_Section6_jsx-src_components_UI_FormElement_Input_css.chunk.js',
                    '/static/js/src_components_Home_Section11_Section11_jsx-src_components_Home_Section5_Section5_jsx.chunk.js',
                    '/static/js/src_components_Home_Section13_Section13_jsx.chunk.js',
                    '/static/js/src_components_Home_Section8_Section8_jsx.chunk.js',
                    '/static/js/src_pages_Home_Home_jsx.chunk.js',
                    'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css',
                    '/assets/style/style.css',
                    '/static/media/Vazir-FD.f7b59344dab12cdd0ff8.woff',
                    '/static/media/slick.295183786cd8a1389865.woff',
                    '/logo192.png',
                    '/favicon.ico',
                    '/manifest.json',
                    '/static/media/instalogo.36b647f014e2b2952a7b.png',
                    '/static/media/telegram_PNG11.fddf2a3ec74d13e1ef9f.png',
                    '/static/media/whatsapp-logo.ad253bf275e796b797e0.png',
                    '/static/js/vendors-node_modules_classnames_index_js-node_modules_react-icons_lib_esm_index_js-node_modul-63c45c.chunk.js',
                    '/static/js/src_pages_Shop_ShopPage_jsx.chunk.js',
                    '/static/js/src_components_UI_Backdrop_Backdrop_jsx-src_pages_Admin_CommentsList_CommentsList_css.chunk.js',
                    '/static/js/src_components_UI_Modal_Modal_jsx-src_pages_Product_ProductDetails_css-src_assets_images_pro-8_png.chunk.js',
                    '/static/js/src_pages_Product_Product_jsx.chunk.js',
                    '/static/js/src_pages_Stores_Stores_jsx-node_modules_react-icons_lib_esm_index_js.chunk.js',
                    '/static/js/src_pages_Supplier_SupplierIntroduce_jsx.chunk.js',
                    '/static/js/src_pages_CartPage_CartPage_jsx.chunk.js',
                    '/static/js/src_pages_MyFavorites_MyFavoritePage_jsx.chunk.js',
                ])
            })
    )
})

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(existedCacheNames => {
            return Promise.all(
                existedCacheNames.forEach(ExistedcacheName => {
                    if (ExistedcacheName !== cacheName) {
                        return caches.delete(ExistedcacheName)
                    }
                })
            )
        })
    )

})

self.addEventListener('fetch', e => {
    const validDestination = e.request.destination.length > 1;
    const invalidUrl = e.request.url.includes('/uploads/images/') || e.request.url.includes('/leaflet') || e.request.url.includes('openstreetmap')

    if (e.request.method === 'GET' && !invalidUrl && validDestination) {
        e.respondWith(
            caches.match(e.request)
                .then(response => {
                    if (response) {
                        return response;
                    } else {
                        return fetch(e.request)
                    }
                })
        )
    }

})