import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { UserContext } from "../../Context/UserContext/UserContext";
import { CartContext } from "../../Context/CartContext/CartContext";
import { toast } from "react-toastify";

function ProductOrder({ product, cart, statusOrder }) {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUserRole } = useContext(UserContext);
  const navigate = useNavigate();
  const { setCount, addToCart } = useContext(CartContext);
  const addProductToCart = async (productId) => {
    setIsLoading(true);
    let quantity = 1;
    if (cart?.products.length) {
      for (const product of cart?.products) {
        if (product.productId._id == productId) {
          quantity = product.quantity + 1;
        }
      }
    }
    const data = await addToCart(productId, quantity);
    if (data?.data?.message == "Done") {
      setCount(data.data.numberOfProducts);
      toast.success("product added successfully to cart");
      setIsLoading(false);
    }
    if (data?.response?.status == 400) {
      toast.error(data.response.data.errMass);
      setIsLoading(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      navigate("/login");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="col-md-6 p-3">
        <div className="d-flex align-items-center gap-3">
          <img
            className="w-25"
            src={product.productId.mainImage.secure_url}
            alt={product.productId.name}
          />
          <div className="w-100">
            <p className="text-main mb-1">{product.productId.name}</p>
            <p className="m-0">price : {product.productId.finalPrice}</p>
            <p className="">quantity : {product.quantity}</p>
            <div className="d-flex gap-2">
              {isLoading ? (
                <button className="btn btn-success ">
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
                  onClick={() => addProductToCart(product.productId._id)}
                  className="btn btn-success "
                >
                  Add to cart
                </button>
              )}
              <Link
                to={`/product-details/${product.productId._id}`}
                className="btn btn-info "
              >
                More details
              </Link>
            </div>
            {statusOrder == "received" ? (
              <Link
                to={`/add-rating/${product.productId._id}`}
                className="btn btn-warning w-100 mt-2"
              >
                add rating <i class="fa-solid fa-star text-white"></i>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductOrder;
