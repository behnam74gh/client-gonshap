import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdEdit,MdOutlineToggleOn,MdToggleOff } from "react-icons/md";
import { RiSearchLine, RiDeleteBin2Fill } from "react-icons/ri";
import { HiBadgeCheck } from "react-icons/hi";
import { TiDelete } from "react-icons/ti";
import { Link } from "react-router-dom";
import { VscLoading } from "react-icons/vsc";
import { useSelector } from "react-redux";
import axios from "../../../util/axios";
import Pagination from "../../../components/UI/Pagination/Pagination";
import defPic from "../../../assets/images/def.jpg";
import "./Product.css";
import "./Products.css";

const Products = () => {
  const [otherFilterings, setOtherFilterings] = useState(false);
  const [productsLength, setProductsLength] = useState();
  const [page, setPage] = useState(1);
  const {userInfo : {role,supplierFor}} = useSelector((state) => state.userSignin)
  const [orderConfig, setOrderConfig] = useState(role === 1 ?"1": "none");
  const [activeCategory, setActiveCategory] = useState("none");
  const [activeSubcategory, setActiveSubcategory] = useState("none");
  const [activeBrand, setActiveBrand] = useState("none");
  const [activeSell, setActiveSell] = useState("none");
  const [activeCount, setActiveCount] = useState("none");
  const [reRender,setReRender] = useState(false)
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [perPage, setPerPage] = useState(50);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [oPage, setOPage] = useState(1);
  const [activeFilterConfig, setActiveFilterConfig] = useState("none");
  const [errorText, setErrorText] = useState("");
  
  const getProductsLength = () =>
    axios
      .get("/products/length")
      .then((response) => {
        if (response.data.success) {
          setProductsLength(response.data.productsCount);
        }
      })
      .catch((err) => err.response && toast.error(err.response.data.message));

  useEffect(() => {
    getProductsLength();
  }, []);

  useEffect(() => {
    if (orderConfig === "none") {
      return;
    }

    setLoading(true);
    setQueryText("");
    setActiveCategory("none");
    setActiveSell("none");
    setActiveCount("none");

    let sortCon;
    let orderCon;

    switch (orderConfig) {
      case "1":
        sortCon = "createdAt";
        orderCon = "desc";
        break;
      case "2":
        sortCon = "createdAt";
        orderCon = "asc";
        break;
      case "3":
        sortCon = "sold";
        orderCon = "desc";
        break;
      case "4":
        sortCon = "sold";
        orderCon = "asc";
        break;
      case "5":
        sortCon = "discount";
        orderCon = "desc";
        break;
      case "6":
        sortCon = "discount";
        orderCon = "asc";
        break;
      default:
        break;
    }

    axios
      .post("/products/list-by-order", {
        sort: sortCon,
        order: orderCon,
        page,
        perPage,
      })
      .then((response) => {
        if (response.data.success) {
          setLoading(false);
          setProducts(response.data.products);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  }, [page, perPage, orderConfig]);

  const loadAllCategories = () => {
    if(role === 2){
      return
    }
    axios
      .get("/get-all-categories")
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };
  const loadAllSubcategories = () => {
      axios
      .get("/get-all-subcategories")
      .then((response) => {
        if(role === 2 && supplierFor){
            const newSubs = response.data.subcategories.filter((s) => s.parent === supplierFor);
            setSubcategories(newSubs);
        }else{
          setSubcategories(response.data.subcategories);
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  const loadAllBrands = () => {
    axios
      .get("/get-all-brands")
      .then((response) => {
        if (response.data.success) {
          if(role === 2 && supplierFor){
            const particularBrands = response.data.brands.filter((c) => c.backupFor._id === supplierFor);
            setBrands(particularBrands)
          }else{
            setBrands(response.data.brands);
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    loadAllCategories();
    loadAllSubcategories();
    loadAllBrands();
  }, []);

  const searchProductsByQueryText = () => {
    setOPage(1);
    setOrderConfig("none");
    setActiveSell("none");
    setActiveCategory("none");
    setActiveCount("none");
    setActiveSubcategory("none");
    setActiveBrand("none");

    axios
      .post("/products/search/filters", { query: queryText })
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.products);
          setOtherFilterings(true);
        }
      })
      .catch((err) => {
        setProducts([]);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  const searchProductsByCreated = (e) => {
    setOtherFilterings(false);
    setActiveFilterConfig("none");
    setActiveSubcategory("none");
    setActiveBrand("none");

    setPage(1);

    setOrderConfig(e);
  };

  const searchProductsByCategory = (e) => {
    if (e === "none") {
      return;
    }

    if (!otherFilterings) {
      setOtherFilterings(true);
    }
    setOPage(1);
    setQueryText("");
    setOrderConfig("none");
    setActiveSell("none");
    setActiveCount("none");
    setActiveFilterConfig("none");
    setActiveSubcategory("none");
    setActiveBrand("none");

    setActiveCategory(e);

    axios
      .post("/products/search/filters", { category: e })
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.products);
        }
      })
      .catch((err) => {
        setProducts([]);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };
//for storeAdmin
 useEffect(() => {
  const isStoreAdmin = role === 2 && supplierFor !== null
    if(isStoreAdmin || (isStoreAdmin && reRender)){
      searchProductsByCategory(supplierFor)
    }
    setReRender(false)
  },[reRender])

  const searchProductsBySubcategory = (e) => {
    if (e === "none") {
      if(role === 2){
        setReRender(true)
      }
      return;
    }

    if (!otherFilterings) {
      setOtherFilterings(true);
    }
    setOPage(1);
    setQueryText("");
    setOrderConfig("none");
    setActiveSell("none");
    setActiveCount("none");
    setActiveCategory("none");
    setActiveFilterConfig("none");
    setActiveBrand("none");

    setActiveSubcategory(e);

    axios
      .post("/products/search/filters", { subcategory: e })
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.products);
        }
      })
      .catch((err) => {
        setProducts([]);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  const searchProductsByBrand = (e) => {
    if (e === "none") {
      return;
    }

    if (!otherFilterings) {
      setOtherFilterings(true);
    }
    setOPage(1);
    setQueryText("");
    setOrderConfig("none");
    setActiveSell("none");
    setActiveCount("none");
    setActiveCategory("none");
    setActiveFilterConfig("none");
    setActiveSubcategory("none");

    setActiveBrand(e);

    axios
      .post("/products/search/filters", { brand: e })
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.products);
        }
      })
      .catch((err) => {
        setProducts([]);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  const searchProductsBySell = (e) => {
    if (e === "none") {
      return;
    }

    if (!otherFilterings) {
      setOtherFilterings(true);
    }

    setOPage(1);
    setQueryText("");
    setOrderConfig("none");
    setActiveCategory("none");
    setActiveCount("none");
    setActiveSubcategory("none");
    setActiveFilterConfig("none");
    setActiveBrand("none");

    setActiveSell(e);

    const config = role === 2 ? {sell: e,supplierFor:  supplierFor} : {sell: e}

    axios
      .post("/products/search/filters", config)
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.products);
        }
      })
      .catch((err) => {
        setProducts([]);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  const searchProductsByCountInStock = (e) => {
    if (e === "none") {
      return;
    }

    if (!otherFilterings) {
      setOtherFilterings(true);
    }

    setOPage(1);
    setQueryText("");
    setOrderConfig("none");
    setActiveCategory("none");
    setActiveSell("none");
    setActiveFilterConfig("none");
    setActiveSubcategory("none");
    setActiveBrand("none");

    setActiveCount(e);

    let counts;

    switch (e) {
      case "1":
        counts = [0, 5];
        break;
      case "2":
        counts = [5, 20];
        break;
      case "3":
        counts = [20, 100];
        break;
      default:
        return;
    }
    const config = role === 2 ? {countInStock: counts,supplierFor:  supplierFor} : {countInStock: counts}

    axios
      .post("/products/search/filters", config)
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.products);
        }
      })
      .catch((err) => {
        setProducts([]);
        if (typeof err.response.data.message === "object") {
          toast.error(err.response.data.message[0]);
        } else {
          toast.error(err.response.data.message);
        }
      });
  };

  const indexOfLastProducts = oPage * perPage;
  const indexOfFirstProducts = indexOfLastProducts - perPage;
  const currentProducts = products.slice(
    indexOfFirstProducts,
    indexOfLastProducts
  );

  const toggleProductSellHandler = (_id, sell, title) => {
    if (
      window.confirm(
        `میخواهید محصول با عنوان "${title}" را ${sell ? "از فهرست کالاهای قابل فروش بردارید" : "به حالت امکان فروش برگردانید"}؟`
      )
    ) {
      axios
        .put('/product/sell/toggle', { _id,sell })
        .then((response) => {
          if (response.data.success) {
            toast.success(response.data.message);
            if (
              productsLength === products.length ||
              productsLength > products.length
            ) {
              perPage < 50 ? setPerPage(50) : setPerPage(49);
            }
          }
        })
        .catch((err) => {
          if (typeof err.response.data.message === "object") {
            toast.error(err.response.data.message[0]);
          } else {
            toast.error(err.response.data.message);
          }
        });
    }
  };

  const setActiveFilterConfigHandler = (e) => {
    let activeFiltering;
    const activeProducts = products;
    let filteredProducts;

    switch (e) {
      case "newest":
        filteredProducts = activeProducts.sort((a, b) =>
          a.createdAt > b.createdAt ? -1 : 1
        );
        activeFiltering = "newest";
        setProducts(filteredProducts);
        break;
      case "oldest":
        filteredProducts = activeProducts.sort((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1
        );
        activeFiltering = "oldest";
        setProducts(filteredProducts);
        break;
      case "moreSold":
        filteredProducts = activeProducts.sort((a, b) =>
          a.sold > b.sold ? -1 : 1
        );
        activeFiltering = "moreSold";
        setProducts(filteredProducts);
        break;
      case "lessSold":
        filteredProducts = activeProducts.sort((a, b) =>
          a.sold > b.sold ? 1 : -1
        );
        activeFiltering = "lessSold";
        setProducts(filteredProducts);
        break;
      case "moreDiscount":
        filteredProducts = activeProducts.sort((a, b) =>
          a.discount > b.discount ? -1 : 1
        );
        activeFiltering = "moreDiscount";
        setProducts(filteredProducts);
        break;
      case "lessDiscount":
        filteredProducts = activeProducts.sort((a, b) =>
          a.discount > b.discount ? 1 : -1
        );
        activeFiltering = "lessDiscount";
        setProducts(filteredProducts);
        break;
      case "moreCountInStock":
        filteredProducts = activeProducts.sort((a, b) =>
          a.countInStock > b.countInStock ? -1 : 1
        );
        activeFiltering = "moreCountInStock";
        setProducts(filteredProducts);
        break;
      case "lessCountInStock":
        filteredProducts = activeProducts.sort((a, b) =>
          a.countInStock > b.countInStock ? 1 : -1
        );
        activeFiltering = "lessCountInStock";
        setProducts(filteredProducts);
        break;
      case "haveSell":
        filteredProducts = activeProducts.filter((p) => p.sell);
        activeFiltering = "haveSell";
        setProducts(filteredProducts);
        break;
      case "haveNotSell":
        filteredProducts = activeProducts.filter((p) => !p.sell);
        activeFiltering = "haveNotSell";
        setProducts(filteredProducts);
        break;
      case "none":
        activeFiltering = "none";
        break;
      default:
        return;
    }
    setActiveFilterConfig(activeFiltering);
    setOPage(1);
  };

  const copyIdToClipBoard = (id,title) => {
    navigator.clipboard.writeText(id)
    toast.info(`کد محصول با نام "${title}" کپی شد`)
  }

  return (
    <div className="admin-panel-wrapper">
      {!otherFilterings ? (
        <h4>
          تعداد " <strong className="text-blue">{productsLength}</strong> "
          محصول در لیست محصولات وجود دارد!
        </h4>
      ) : (
        <h4>
          تعداد " <strong className="text-blue">{products.length}</strong> "
          محصول در مرتب سازی جدید وجود دارد!
        </h4>
      )}
      {errorText.length > 0 && (
        <p className="warning-message my-1">{errorText}</p>
      )}
      {loading ? (
        <VscLoading className="loader" />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead className="heading-table">
              {role === 1 && <tr>
                <th colSpan="5">
                  <select
                    value={orderConfig}
                    onChange={(e) => searchProductsByCreated(e.target.value)}
                  >
                    <option value="none" className="text-white bg-orange">
                      ⬆⬇ ترتیب مرتب سازی (کلی)
                    </option>
                    <option value="1">جدیدترین محصولات</option>
                    <option value="2">قدیمی ترین محصولات</option>
                    <option value="3">پرفروش ترین محصولات</option>
                    <option value="4">کم فروش ترین محصولات</option>
                    <option value="5">بالاترین تخفیفها</option>
                    <option value="6">پایین ترین تخفیفها</option>
                  </select>
                </th>
                <th colSpan="10">
                  <div className="dashboard-search">
                    <input
                      type="search"
                      value={queryText}
                      placeholder="جستوجو براساس نامِ محصول.."
                      onChange={(e) => setQueryText(e.target.value)}
                    />
                    <span onClick={searchProductsByQueryText}>
                      <RiSearchLine />
                    </span>
                  </div>
                </th>
              </tr>}
              <tr
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                
                {role === 1 && <th colSpan="2">
                  <select
                    value={activeCategory}
                    onChange={(e) => searchProductsByCategory(e.target.value)}
                  >
                    <option value="none">دسته بندی</option>
                    {categories.length > 0 &&
                      categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </th>}
                <th colSpan={role === 1 ? "2" : "4"}>
                  <select
                    value={activeSubcategory}
                    onChange={(e) =>
                      searchProductsBySubcategory(e.target.value)
                    }
                  >
                    <option value="none">برچسب (همه)</option>
                    {subcategories.length > 0 &&
                      subcategories.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </th>
                <th colSpan="2">
                  <select
                    value={activeBrand}
                    onChange={(e) => searchProductsByBrand(e.target.value)}
                  >
                    <option value="none">برند</option>
                    {brands.length > 0 &&
                      brands.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.brandName}
                        </option>
                      ))}
                  </select>
                </th>
                <th colSpan="3">
                  <select
                    value={activeSell}
                    onChange={(e) => searchProductsBySell(e.target.value)}
                  >
                    <option value="none">وضعیت فروش (کلی)</option>
                    <option value={true}>ارائه میشود</option>
                    <option value={false}>ارائه نمیشود</option>
                  </select>
                </th>
                <th colSpan="2">
                  <select
                    value={activeCount}
                    onChange={(e) =>
                      searchProductsByCountInStock(e.target.value)
                    }
                  >
                    <option value="none">تعداد کالا (کلی)</option>
                    <option value="1">0 تا 5</option>
                    <option value="2">5 تا 20</option>
                    <option value="3">20 به بالا</option>
                  </select>
                </th>
                <th colSpan={role === 1 ? "4" : "3"}>
                  <select
                    value={activeFilterConfig}
                    onChange={(e) =>
                      setActiveFilterConfigHandler(e.target.value)
                    }
                  >
                    <option value="none" disabled className="text-white bg-orange">
                      ⬆⬇ مرتب سازی محصولات به دست آمده براساس:
                    </option>
                    <option value="newest">جدیدترین ها</option>
                    <option value="oldest">قدیمی ترین ها</option>
                    <option value="moreSold">بیشترین فروش</option>
                    <option value="lessSold">کمترین فروش</option>
                    <option value="moreDiscount">بیشترین تخفیف</option>
                    <option value="lessDiscount">کمترین تخفیف</option>
                    <option value="moreCountInStock">بیشترین موجودی</option>
                    <option value="lessCountInStock">کمترین موجودی</option>
                    <option value="haveSell">ارائه میشود</option>
                    <option value="haveNotSell">ارائه نمیشود</option>
                  </select>
                </th>
              </tr>
              <tr
                style={{
                  backgroundColor: "var(--firstColorPalete)",
                  color: "white",
                }}
              >
                <th className="th-titles">تصویر</th>
                <th className="th-titles">عنوان محصول</th>
                {role === 1 && <th className="th-titles">دسته بندی</th>}
                <th className="th-titles">برچسب</th>
                <th className="th-titles">برند</th>
                <th className="th-titles">قیمت فاکتور</th>
                <th className="th-titles">فروش</th>
                <th className="th-titles">قیمت فروش</th>
                <th className="th-titles">تخفیف</th>
                <th className="th-titles">قیمت نهایی</th>
                <th className="th-titles">وضعیت ارائه</th>
                <th className="th-titles">تعداد</th>
                <th className="th-titles">رنگ ها</th>
                <th className="th-titles">ویرایش</th>
                <th className="th-titles">فعالیت</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                (!otherFilterings ? products : currentProducts).map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex-center-center">
                        <img
                          className="table-img"
                          src={
                            !p.photos.length
                              ? `${defPic}`
                              : `${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${p.photos[0]}`
                          }
                          alt={p.title}
                        />
                      </div>
                    </td>
                    <td onClick={() => copyIdToClipBoard(p._id,p.title)} className="font-sm tooltip" style={{display: "table-cell",cursor: "copy"}}>
                        <span className="tooltip_text">
                          کپی کد محصول
                        </span>
                        {p.title.length > 14 ? `${p.title.substring(0,14)}..` : p.title}
                    </td>
                    {role === 1 && <td className="font-sm">{p.category.name}</td>}
                    <td className="font-sm">{p.subcategory.name}</td>
                    <td className="font-sm">{p.brand.brandName}</td>
                    <td className="font-sm">{p.factorPrice.toLocaleString("fa")}&nbsp;تومان</td>
                    <td className="font-sm">{p.sold}</td>
                    <td className="font-sm">
                      {p.price.toLocaleString("fa")}&nbsp;تومان
                    </td>
                    <td
                      className="font-sm"
                      style={
                        p.discount > 20
                          ? {
                              background: "var(--firstColorPalete)",
                              color: "var(--secondColorPalete)",
                            }
                          : null
                      }
                    >
                      {p.discount ? p.discount : "0"}&nbsp;%
                    </td>
                    <td className="font-sm">
                      {p.finallyPrice
                        ? p.finallyPrice.toLocaleString("fa")
                        : "0"}
                      &nbsp;تومان
                    </td>
                    <td className="font-sm">
                      <span className="d-flex-center-center">
                        {p.sell ? "داریم" : "نداریم"}
                        {p.sell ? (
                          <HiBadgeCheck
                            style={{ marginRight: "5px", color: "#00a800" }}
                          />
                        ) : (
                          <TiDelete
                            style={{ marginRight: "5px", color: "red" }}
                          />
                        )}
                      </span>
                    </td>
                    <td className="font-sm">{p.countInStock}</td>
                    <td className="font-sm">
                      {p.colors.length > 0 && (
                        <div className="products_active_colors">
                          {p.colors.map((c) => (
                            <span
                              key={c._id}
                              style={{ background: `#${c.colorHex}` }}
                            ></span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/${role === 1 ? "admin" : "store-admin"}/dashboard/product/${p.slug}`}
                        className="d-flex-center-center"
                      >
                        <MdEdit className="text-blue" />
                      </Link>
                    </td>
                    <td>
                      <span
                        className="d-flex-center-center"
                        onClick={() => toggleProductSellHandler(p._id,p.sell, p.title)}
                      >
                        {p.sell ? <MdToggleOff className="text-blue" /> : <MdOutlineToggleOn className="text-red" /> }
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 2 ? "14" : "15"}>
                    <p
                      className="warning-message"
                      style={{ textAlign: "center" }}
                    >
                      محصولی یافت نشد!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {productsLength > perPage && (
            <div>
              {!otherFilterings && (
                <Pagination
                  perPage={perPage}
                  productsLength={productsLength}
                  setPage={setPage}
                  page={page}
                />
              )}
            </div>
          )}
          {products.length > perPage && (
            <div>
              {otherFilterings && (
                <Pagination
                  perPage={perPage}
                  productsLength={products.length}
                  setPage={setOPage}
                  page={oPage}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
