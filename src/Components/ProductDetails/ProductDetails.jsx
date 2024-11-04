import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loding from "../Loding/Loding";
import { CartContext } from "../../Context/CartContext/CartContext";
import { UserContext } from "../../Context/UserContext/UserContext";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useQuery } from "react-query";

function ProductDetails() {
  const { id } = useParams();
  const [image, setImage] = useState("");

  const [wishList, setWishList] = useState([]);
  const [isLoadingHeart, setIsLoadingHeart] = useState(false);

  const [loading, setLoading] = useState(false);
  const { addToCart, setCount, UserCartData } = useContext(CartContext);
  const {
    setToken,
    setUserRole,
    removeFromWishList,
    profile,
    addToWishList,
    setWishListCount,
    wishListCount,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const cartData = UserCartData();

  if (cartData?.data?.status == 500) {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    navigate("/login");
  }
  const addProductToCart = async (productId) => {
    setLoading(true);
    let quantity = 1;
    if (cartData.data.data.cart?.products?.length) {
      for (const product of cartData.data.data.cart?.products) {
        if (product.productId._id == productId) {
          quantity = product.quantity + 1;
        }
      }
    }
    const data = await addToCart(productId, quantity);
    if (data?.data?.message == "Done") {
      setCount(data.data.numberOfProducts);
      toast.success("product added successfully to cart");
      setLoading(false);
    }
    if (data?.response?.status == 400) {
      toast.error(data.response.data.errMass);
      setLoading(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      setLoading(false);
      navigate("/login");
    }
  };
  const getProductDetails = async () => {
    return axios.get(`https://e-commerce-back-one.vercel.app/product/${id}`);
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

  const { data, isLoading } = useQuery("getProductDetails", getProductDetails);
  const mainImage = (secure_url) => {
    setImage(secure_url);
  };
  if (isLoading) {
    return <Loding />;
  }
  return (
    <>
      <div className="container-fluid mb-10">
        <div className="row my-2 p-3">
          <div className="col-md-2">
            {data?.data?.product.subImages.map((image, index) => {
              return (
                <img
                  key={`${index}`}
                  src={image.secure_url}
                  className="w-50 rounded-2 cursor-pointer p-1"
                  onClick={() => mainImage(image.secure_url)}
                  alt={data?.data?.product.name}
                />
              );
            })}
          </div>
          <div className="col-md-3">
            <img
              src={image || data?.data?.product?.subImages[0].secure_url}
              className="w-100"
              alt=""
            />
          </div>
          <div className="col-md-7">
            <h2>{data?.data?.product.name}</h2>
            <p>{data?.data?.product.description}</p>
            <p>
              category :{" "}
              <Link
                to={`/category/${data?.data?.product.categoryId._id}`}
                className="text-decoration-none text-main"
              >
                {data?.data?.product.categoryId.name}
              </Link>
            </p>
            <p>
              brand :
              <Link
                to={`/brand-details/${data?.data?.product.brandId._id}`}
                className="text-decoration-none ms-1 text-main"
              >
                {data?.data?.product.brandId.name}
              </Link>
            </p>
            <p className="my-2 ">
              was :
              <span className="text-decoration-line-through ms-1">
                {data?.data?.product.price}
              </span>
            </p>
            <p className="my-2">now : {data?.data?.product.finalPrice}</p>
            <p className="my-2">
              save :
              <span className="ms-1">
                {(
                  data?.data?.product.price - data?.data?.product.finalPrice
                ).toFixed(2)}
              </span>
              <span className="text-main fw-bold ms-1">
                {data?.data?.product.discound}% off
              </span>
            </p>
            <p className="my-2">
              rate : <i class="fa-solid fa-star rating-color"></i>
              <span className="ms-1">{data?.data?.product.rating || 0}</span>
            </p>
            {loading ? (
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
                onClick={() => addProductToCart(data?.data?.product._id)}
                className="btn bg-main text-white w-100"
              >
                Add to cart
              </button>
            )}

            {!isLoadingHeart ? (
              wishList.includes(data?.data?.product._id) ? (
                <button
                  onClick={() => {
                    removeProductFromWishList(data?.data?.product._id);
                  }}
                  class="btn btn-danger text-white mt-3 w-100"
                >
                  Remove from your wish list
                </button>
              ) : (
                <button
                  onClick={() => {
                    addProductToWishList(data?.data?.product._id);
                  }}
                  class=" btn btn-danger text-white mt-3 w-100"
                >
                  Add to your wish list
                </button>
              )
            ) : (
              <button className="btn bg-danger text-white w-100">
                <PulseLoader
                  color="#fff"
                  cssOverride={{}}
                  loading
                  margin={2}
                  size={7}
                  speedMultiplier={1}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
