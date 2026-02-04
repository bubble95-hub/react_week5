import { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "./assets/style.css";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
  // 表單資料狀態(儲存登入表單輸入)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // 登入狀態管理(控制顯示登入或產品頁）
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});
  const productModalRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, // 保留原有屬性
      [name]: value, // 更新特定屬性
    }));
    //console.log(e.target.name, e.target.value);
  };

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTempProduct((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModalImageChange = (index, value) => {
    setTempProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage[index] = value;

      if (
        value !== "" &&
        index === newImage.length - 1 &&
        newImage.length < 5
      ) {
        newImage.push("");
      }
      if (
        value === "" &&
        newImage.length > 1 &&
        newImage[newImage.length - 1] === ""
      ) {
        newImage.pop();
      }
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleAddImage = () => {
    setTempProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.push("");
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  const handleRemoveImage = () => {
    setTempProduct((pre) => {
      const newImage = [...pre.imagesUrl];
      newImage.pop("");
      return {
        ...pre,
        imagesUrl: newImage,
      };
    });
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bubbleToken="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    const checkLogin = async () => {
      try {
        const response = await axios.post(`${API_BASE}/api/user/check`);
        console.log(response.data);
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.log(error.response?.data.message);
      }
    };
    checkLogin();
  }, []);

  const openModal = (type, product) => {
    //console.log(product);
    setModalType(type);
    setTempProduct((pre) => ({
      ...pre,
      ...product,
    }));
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error.response);
    }
  };

  const updateProduct = async (id) => {
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";
    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    }
    const productData = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
        imagesUrl: [...tempProduct.imagesUrl.filter((url) => url !== "")],
      },
    };
    try {
      const response = await axios[method](url, productData);
      console.log(response.data);
      getProducts();
      closeModal();
    } catch (error) {
      console.log(error.response);
    }
  };

  const delProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`,
      );
      console.log(response.data);
      getProducts();
      closeModal();
    } catch (error) {
      console.log(error.response);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file-to-upload', file);
      const response = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      setTempProduct((pre) => ({
        ...pre,
        imageUrl: response.data.imageUrl,
      }));
    } catch (error) {
      console.log(error.response);
    }
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault(); //避免submit原生預設事件
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      //console.log(response.data);
      const { token, expired } = response.data;
      document.cookie = `bubbleToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common["Authorization"] = token;
      getProducts();
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.log(error.response);
    }
  };

  return (
    <>
      {!isAuth ? (
        <div className="container login">
          <h1>請先登入</h1>
          <form className="form-floating" onSubmit={(e) => onSubmit(e)}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                name="username"
                placeholder="name@product.com"
                value={formData.username}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-2">
              登入
            </button>
          </form>
        </div>
      ) : (
        <div className="container">
          <h2>產品列表</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th>{product.category}</th>
                  <td>{product.title}</td>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td className={`${product.is_enabled && "text-success"}`}>
                    {product.is_enabled ? "啟用" : "不啟用"}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic product"
                    >
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal("edit", product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", product)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      )}
      <ProductModal
        modalType={modalType}
        tempProduct={tempProduct}
        handleModalInputChange={handleModalInputChange}
        handleModalImageChange={handleModalImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        updateProduct={updateProduct}
        delProduct={delProduct}
        uploadImage={uploadImage}
        closeModal={closeModal}
      />
    </>
  );
}

export default App;
