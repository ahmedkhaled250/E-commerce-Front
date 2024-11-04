import React, { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { CartContext } from "../../Context/CartContext/CartContext";

function WishListDetails({ item, wishList, setWishList,cart }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const { setToken, setUserRole, removeFromWishList, setWishListCount } =
    useContext(UserContext);
  const { setCount, addToCart } = useContext(CartContext);

  const navigate = useNavigate();

  const addProductToCart = async (productId) => {
    setIsAddLoading(true);
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
      setIsAddLoading(false);
    }
    if (data?.response?.status == 400) {
      toast.error(data.response.data.errMass);
      setIsAddLoading(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      navigate("/login");
      setIsAddLoading(false);
    }
  };

  const removeProductFromWishList = async (productId) => {
    setIsLoading(true);
    const data = await removeFromWishList(productId);
    if (data?.data?.message == "Done") {
      setWishListCount(data.data.numberOfWishList);
      const finalWishList = wishList.filter(
        (product) => product._id != productId
      );
      setWishList(finalWishList);
      toast.success("product removed successfully from your wish-list");
      setIsLoading(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      setIsLoading(false);
      navigate("/login");
    }
  };
  return (
    <>
      <div>
        <Link
          className="text-decoration-none text-dark"
          to={`/product-details/${item._id}`}
        >
          <img
            className="w-100 rounded-top-3"
            src={item.mainImage.secure_url}
            alt={item.name}
          />
          <div className="p-3 pb-0">
            <span className="text-main">{item.categoryId.name}</span>
            <h3 className="fs-5 mt-2">
              {item.name.split(" ").slice(0, 2).join(" ")}
            </h3>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="">
                <span className="text-decoration-line-through ">
                  {item.price}
                </span>
                <br />
                <span className="px-1">{item.finalPrice}</span>EGP
              </div>
              <div className="">
                <i class="fa-solid fa-star rating-color pe-1"></i>{" "}
                {item.rating || 0}
              </div>
            </div>
          </div>
        </Link>

        {isAddLoading ? (
          <button className="btn bg-main text-white w-100 mb-1">
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
            onClick={() => addProductToCart(item._id)}
            className="btn bg-main text-white w-100 mb-1"
          >
            Add to cart
          </button>
        )}
        {isLoading ? (
          <button className="btn btn-danger text-white w-100">
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
            onClick={() => removeProductFromWishList(item._id)}
            className="btn btn-danger text-white w-100"
          >
            remove
          </button>
        )}
      </div>
    </>
  );
}

export default WishListDetails;
