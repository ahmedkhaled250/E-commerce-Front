import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Product from "../Product/Product";
import Loding from "../Loding/Loding";
import { useQuery } from "react-query";
import { UserContext } from "../../Context/UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext/CartContext";
import Pagination from "../../utils/Pagination";
function Products() {
  const navigate = useNavigate();
  const { setToken, setUserRole } = useContext(UserContext);
  const { UserCartData } = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsLimits, setProductsLimits] = useState(1);



  const getProducts = async () => {
    return axios.get("https://e-commerce-back-one.vercel.app/product");
  };
  const cartData = UserCartData();
  if (cartData?.data?.status == 500) {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    navigate("/login");
  }
  const { data, isLoading } = useQuery("getProducts", getProducts);


    const lastProductIndex = currentPage * productsLimits;
    const firstProductIndex = lastProductIndex - productsLimits;

  const currentProducts = data?.data.products.slice(firstProductIndex,lastProductIndex);
  
  if (isLoading) {
    return <Loding />;
  }
  return (
    <>
      <div className="container mb-10">
        <div className="row my-5">
          {currentProducts.map((item) => (
            <div
              key={item._id}
              className="col-md-2 product rounded-3 py-2 cursor-pointer"
            >
              <Product item={item} cart={cartData?.data?.data?.cart} />
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalRecords={data.data.products.length}
          recordsLimits={productsLimits}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}

export default Products;
