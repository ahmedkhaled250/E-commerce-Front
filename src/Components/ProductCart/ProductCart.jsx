import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext/CartContext";
import { PulseLoader } from "react-spinners";
import { UserContext } from "../../Context/UserContext/UserContext";

function ProductCart({ product, cartId }) {
  const { addToCart, setCount, deleteProductFromCart } =
    useContext(CartContext);
  const { setToken, setUserRole } = useContext(UserContext);
  const [addLoding, setAddLoding] = useState(false);
  const [reduceLoding, setReduceLoding] = useState(false);
  const [deleteLoding, setDeleteLoding] = useState(false);
  const navigate = useNavigate();
  const addProductToCart = async (productId, quantity, stock) => {
    setAddLoding(true);
    if (quantity > stock) {
      toast.error("this quantity is not avilable right now");
      setAddLoding(false);
    } else {
      const data = await addToCart(productId, quantity);
      if (data.status == 200) {
        setAddLoding(false);
      }
      if (data.status == 400 || data.status == 404) {
        toast.error(data.response.data.errMass);
        setAddLoding(false);
      }
      if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
        localStorage.clear();
        setToken(null);
        setUserRole(null);
        setAddLoding(false);
        navigate("/login");
      }
    }
  };
  const reduceProductFromCart = async (productId, quantity) => {
    setReduceLoding(true);
    console.log(reduceLoding);
    if (quantity == 0) {
      await deleteFromCart({ cartId, productId, reduce: true });
      console.log(cartId);
      setReduceLoding(false);
      return 0;
    }
    const data = await addToCart(productId, quantity);
    if (data.status == 200) {
      setReduceLoding(false);
    }
    if (data.status == 400 || data.status == 404) {
      toast.error(data.response.data.errMass);
      setReduceLoding(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      setReduceLoding(false);
      navigate("/login");
    }
  };
  const deleteFromCart = async ({ cartId, productId, reduce } = {}) => {
    reduce ? setDeleteLoding(false) : setDeleteLoding(true);

    const data = await deleteProductFromCart(cartId, productId);
    if (data.status == 200) {
      setCount(data.data.numberOfProducts);
      setDeleteLoding(false);
    }
    if (data.status == 400 || data.status == 404) {
      console.log(data);
      toast.error(data.response.data.errMass);
      setDeleteLoding(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      setDeleteLoding(false);
      navigate("/login");
    }
  };
  return (
    <>
      <div key={product.productId._id} className="col-lg-6 p-3">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div className="w-40">
            <img
              src={product.productId.mainImage.secure_url}
              className="w-100"
              alt={product.productId.name}
            />
          </div>
          <div className="w-60">
            <h3>{product.productId.name}</h3>
            <p>{product.productId.description}</p>
            <p className="my-2 ">
              was :
              <span className="text-decoration-line-through ms-1">
                {product.productId.price}
              </span>
            </p>
            <p className="my-2">now : {product.productId.finalPrice}</p>
            <p className="my-2">quantity : {product.quantity}</p>
            <p className="my-2">
              final Price : {product.productId.finalPrice * product.quantity}
            </p>
            <p className="my-2">
              saved :
              <span className="ms-1">
                {(
                  (product.productId.price - product.productId.finalPrice) *
                  product.quantity
                ).toFixed(2)}
              </span>
              <span className="text-main fw-bold ms-1">
                {product.productId.discound}% off
              </span>
            </p>
            <div className="d-flex ">
              {addLoding ? (
                <button disabled className="btn me-1 text-white bg-main w-50">
                  <PulseLoader
                    color="#fff"
                    cssOverride={{}}
                    loading
                    margin={2}
                    size={7}
                    speedMultiplier={1}
                  />
                </button>
              ) : (
                <button
                  disabled={product.quantity == product.productId.stock}
                  onClick={() => {
                    return addProductToCart(
                      product.productId._id,
                      product.quantity + 1,
                      product.productId.stock
                    );
                  }}
                  className="btn me-1 text-white bg-main w-50"
                >
                  +
                </button>
              )}

              {reduceLoding ? (
                <button disabled className="btn btn-danger ms-1 w-50">
                  <PulseLoader
                    color="#fff"
                    cssOverride={{}}
                    loading
                    margin={2}
                    size={7}
                    speedMultiplier={1}
                  />
                </button>
              ) : (
                <button
                  onClick={() => {
                    return reduceProductFromCart(
                      product.productId._id,
                      product.quantity - 1
                    );
                  }}
                  className="btn btn-danger ms-1 w-50"
                >
                  -
                </button>
              )}
            </div>
          </div>
        </div>
        <Link
          to={`/product-details/${product.productId._id}`}
          className="btn btn-info mt-2 w-100"
        >
          More details about product
        </Link>
        {deleteLoding ? (
          <button disabled className="btn btn-outline-danger mt-2 w-100">
            <PulseLoader
              color="#dc3545"
              cssOverride={{}}
              loading
              margin={2}
              size={7}
              speedMultiplier={1}
            />
          </button>
        ) : (
          <button
            onClick={() =>
              deleteFromCart({ cartId, productId: product.productId._id })
            }
            className="btn btn-outline-danger mt-2 w-100"
          >
            Delete
          </button>
        )}
      </div>
    </>
  );
}

export default ProductCart;
