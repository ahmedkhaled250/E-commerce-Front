import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext/CartContext";
import { UserContext } from "../../Context/UserContext/UserContext";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
function Product({ item, cart }) {
  const { addToCart, setCount } = useContext(CartContext);
  const [wishList, setWishList] = useState([]);
  const [isLoadingHeart, setIsLoadingHeart] = useState(false);
  const {
    setToken,
    setUserRole,
    removeFromWishList,
    profile,
    addToWishList,
    setWishListCount,
    wishListCount,
  } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
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

  
  const userProfile = async () => {
    const data = await profile();
    if (data.data?.user) {
      setWishListCount(data.data.user.wishList.length);
      setWishList(data.data.user.wishList.map((product) => product._id));
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      navigate("/login");
    }
  };

  const addProductToWishList = async (productId) => {
    setIsLoadingHeart(true);
    const data = await addToWishList(productId);
    if (data?.data?.message == "Done") {
      setWishListCount(data.data.numberOfWishList);
      toast.success("product added successfully to your wish-list");
      setIsLoadingHeart(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      setIsLoadingHeart(false);
      navigate("/login");
    }
  };

  const removeProductFromWishList = async (productId) => {
    setIsLoadingHeart(true);
    const data = await removeFromWishList(productId);
    if (data?.data?.message == "Done") {
      setWishListCount(data.data.numberOfWishList);
      toast.success("product removed successfully from your wish-list");
      setIsLoadingHeart(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      setIsLoadingHeart(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    userProfile();
  }, [wishList, wishListCount]);

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
        {wishList.includes(item._id) ? (
          <i
            onClick={() => {
              if (!isLoadingHeart) {
                removeProductFromWishList(item._id);
              }
            }}
            class="fa-solid fs-5 fa-heart"
          ></i>
        ) : (
          <i
            onClick={() => {
              if (!isLoadingHeart) {
                addProductToWishList(item._id);
              }
            }}
            class="fa-regular fs-5 fa-heart"
          ></i>
        )}

        {isLoading ? (
          <button className="btn bg-main text-white w-100">
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
            className="btn bg-main text-white w-100"
          >
            Add to cart
          </button>
        )}
      </div>
    </>
  );
}

export default Product;
