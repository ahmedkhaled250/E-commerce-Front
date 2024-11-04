import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Product from "../Product/Product";
import Loding from "../Loding/Loding";
import { CartContext } from "../../Context/CartContext/CartContext";
import { UserContext } from "../../Context/UserContext/UserContext";
import Pagination from "../../utils/Pagination";

function BrandDetails() {
  const { id } = useParams();
  const [brand, setBrand] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [found, setFound] = useState(true);
  const [products, setProducts] = useState([]);
  const { UserCartData } = useContext(CartContext);
  const { setToken, setUserRole } = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsLimits, setProductsLimits] = useState(1);
  const [currentProducts, setcurrentProducts] = useState([]);

  const navigate = useNavigate();
  const getBrand = async () => {
    setLoading(true);
    const { data } = await axios.get(
      `https://e-commerce-back-one.vercel.app/brand/${id}`
    );
    setBrand(data.brand);
    setLoading(false);
  };
  const getProductsOfBrand = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `https://e-commerce-back-one.vercel.app/brand/${id}/product/productsOfSpecificBrand`
      );
      if (data.message == "Done") {
        setProducts(data.products);
        const lastProductIndex = currentPage * productsLimits;
        const firstProductIndex = lastProductIndex - productsLimits;
        const currentProducts = data.products.slice(
          firstProductIndex,
          lastProductIndex
        );
        setcurrentProducts(currentProducts);
      }
      setIsLoading(false);
    } catch (error) {
      if (error.response.status) {
        setFound(false);
      }
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
    (async () => {
      await getBrand();
      await getProductsOfBrand();
    })();
  }, []);

  useEffect(() => {
      const lastProductIndex = currentPage * productsLimits;
      const firstProductIndex = lastProductIndex - productsLimits;
      const currentProducts = products.slice(
        firstProductIndex,
        lastProductIndex
      );
      setcurrentProducts(currentProducts);
  }, [currentPage]);

  if (loading) {
    <Loding />;
    return;
  }
  return (
    <>
      <div className="container mb-10">
        <img className="w-25" src={brand.image?.secure_url} alt={brand.name} />
        <h2 className="text-main p-2">{brand.name}</h2>
        <hr />
        <div className="mb-3">
          {!found ? (
            <>
              <p>This brand has no products </p>
            </>
          ) : (
            <>
              {isLoading ? (
                <Loding />
              ) : (
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
              )}
            </>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalRecords={products.length}
          recordsLimits={productsLimits}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}

export default BrandDetails;
