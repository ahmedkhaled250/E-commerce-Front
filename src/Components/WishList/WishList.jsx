import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import Loding from "../Loding/Loding";
import WishListDetails from "../WishListDetails/WishListDetails";
import { toast } from "react-toastify";
import { CartContext } from "../../Context/CartContext/CartContext";
import Pagination from "../../utils/Pagination";

function WishList() {
  const { profile, setWishListCount, setToken, setUserRole } =
    useContext(UserContext);
  const { UserCartData } = useContext(CartContext);
  const [wishList, setWishList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [productsLimits, setProductsLimits] = useState(1);
  const [currentWishList, setcurrentWishList] = useState([]);

  const userProfile = async () => {
    setIsLoading(true);
    const data = await profile();
    if (data.data?.user) {
      setWishListCount(data.data.user.wishList.length);
      setWishList(data.data.user.wishList);

      const lastProductIndex = currentPage * productsLimits;
      const firstProductIndex = lastProductIndex - productsLimits;
      const currentProducts = data.data.user.wishList.slice(
        firstProductIndex,
        lastProductIndex
      );
      setcurrentWishList(currentProducts);

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

  const cartData = UserCartData();
  if (cartData?.data?.status == 500) {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    navigate("/login");
  }
  useEffect(() => {
    userProfile();
  }, []);

  useEffect(() => {
    const lastProductIndex = currentPage * productsLimits;
    const firstProductIndex = lastProductIndex - productsLimits;
    const currentProducts = wishList.slice(firstProductIndex, lastProductIndex);
    setcurrentWishList(currentProducts);
  }, [currentPage]);

  if (isLoading) {
    return <Loding />;
  }
  return (
    <>
      <div className="container bg-main-light my-5 p-4 mb-10">
        <h2>Wish list :</h2>
        {wishList?.length ? (
          <>
            <div className="row">
              {currentWishList.map((item) => (
                <div
                  key={item._id}
                  className="col-md-2 product rounded-3 py-2 cursor-pointer"
                >
                  <WishListDetails
                    item={item}
                    cart={cartData?.data?.data?.cart}
                    wishList={wishList}
                    setWishList={setWishList}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>You have no product in your whish-list</p>
        )}
        <Pagination
          currentPage={currentPage}
          totalRecords={wishList.length}
          recordsLimits={productsLimits}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}

export default WishList;
