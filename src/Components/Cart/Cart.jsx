import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Context/CartContext/CartContext";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Loding from "../Loding/Loding";
import ProductCart from "../ProductCart/ProductCart";
import { PulseLoader } from "react-spinners";
function Cart() {
  const { setToken, setUserRole } = useContext(UserContext);
  const { resetCart, setCount, UserCartData } = useContext(CartContext);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading } = UserCartData();
  const removeProductsFromCart = async (id) => {
    setResetLoading(true);
    const data = await resetCart(id);
    if (data.status == 200) {
      setCount(0);
      toast.success("all products are deleted from your cart");
      setResetLoading(false);
    }
    if (data?.response?.status == 400) {
      toast.error(data.response.data.errMass);
      setResetLoading(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      setResetLoading(false);
      navigate("/login");
    }
  };
  if (isLoading) {
    return <Loding />;
  }
  return (
    <>
      <div className="container bg-main-light my-5 p-4 mb-10">
        <h2>Shop Cart :</h2>
        {data.data.cart?.products?.length ? (
          <>
            <p className="text-main">
              Total cart price : {data.data.cart.finalPrice}
            </p>
            <div className="row">
              {data.data.cart.products.map((product) => (
                <ProductCart
                  key={product.productId._id}
                  cartId={data.data.cart._id}
                  product={product}
                />
              ))}
            </div>
          </>
        ) : (
          <p>
            You have no product in your cart If you place an order go to add
            product to cart
          </p>
        )}
        <div className="d-flex gap-3">
          <Link
            disabled={!data.data.cart?.products?.length}
            className="btn w-50 bg-main text-white"
            to="/place-order"
          >
            Place order
          </Link>
          {resetLoading ? (
            <button disabled className="btn w-50 btn-danger">
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
              disabled={!data.data.cart?.products?.length}
              onClick={() => removeProductsFromCart(data.data.cart._id)}
              className="btn w-50 btn-danger"
            >
              Reset cart
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
