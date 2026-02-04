import axios from "axios";
import { useEffect, useState } from "react";
import "../../assets/products.css";
import { useNavigate } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`,
        );
        setProducts(response.data.products);
      } catch (error) {
        window.alert(error.response.data.message);
      }
    };
    getProducts();
  }, []);

  const handleView = (id) => {
    navigate(`/product/${id}`);
    // try {
    //   const response = await axios.get(
    //     `${API_BASE}/api/${API_PATH}/product/${id}`,
    //   );
    //   console.log(response.data.product);
    //   navigate(`/product/${id}`, {
    //     state: {
    //       productData: response.data.product,
    //     },
    //   });
    // } catch (error) {
    //   console.log(error.response);
    // }
  };
  return (
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card mb-4">
              <div className="image-frame">
                <img
                  src={product.imageUrl}
                  className="card-img-top image-size"
                  alt={product.title}
                />
              </div>

              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">價格：{product.price}</p>
                <p className="card-text">
                  <small className="text-body-secondary">{product.unit}</small>
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleView(product.id)}
                >
                  查看更多
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Products;
