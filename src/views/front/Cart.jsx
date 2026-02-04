import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        setCart(response.data.data);
      } catch (error) {
        window.alert(error.response.data.message);
      }
    };
    getCart();
  }, []);
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response2.data.data);
    } catch (error) {
      window.alert(error.response.data.message);
    }
  };

  const delCart = async (cartId) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response2.data.data);
    } catch (error) {
      window.alert(error.response.data.message);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("確定清空購物車？")) return;

    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      setCart({
        carts: [],
        total: 0,
        final_total: 0,
      });
    } catch (error) {
      window.alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="container">
        <h2>購物車列表</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            清空購物車
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量/單位</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            {cart?.carts?.map((cartItem) => (
              <tr key={cartItem.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => delCart(cartItem.id)}
                  >
                    刪除
                  </button>
                </td>
                <th scope="row">{cartItem.product.title}</th>
                <td>
                  <div className="input-group input-group-sm mb-3">
                    <input
                      type="number"
                      className="form-control"
                      aria-label="qty"
                      aria-describedby="basic-addon1"
                      defaultValue={cartItem.qty}
                      onChange={(e) =>
                        updateCart(
                          cartItem.id,
                          cartItem.product_id,
                          Number(e.target.value),
                        )
                      }
                    />
                    <span className="input-group-text" id="basic-addon1">
                      {cartItem.product.unit}
                    </span>
                  </div>
                </td>
                <td className="text-end">{currency(cartItem.final_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計
              </td>
              <td className="text-end">{currency(cart.final_total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
export default Cart;
