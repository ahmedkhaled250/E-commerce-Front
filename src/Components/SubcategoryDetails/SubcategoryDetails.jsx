import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../Context/UserContext/UserContext";
import Loding from "../Loding/Loding";
import Product from "../Product/Product";
import { CartContext } from "../../Context/CartContext/CartContext";
import Pagination from "../../utils/Pagination";

function SubcategoryDetails() {
  const { id, subCategoryId } = useParams();
  const [err, setErr] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log({ id, subCategoryId });
  const navigate = useNavigate();
  const { setToken, setUserRole } = useContext(UserContext);
  const { UserCartData } = useContext(CartContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsLimits, setProductsLimits] = useState(1);
  const [currentProducts, setcurrentProducts] = useState([]);

  const cartData = UserCartData();
  const productsOfSpecificCategory = async () => {
    return axios
      .get(
        `https://e-commerce-back-one.vercel.app/category/${id}/product/productsOfSpecificCategory`
      )
      .then((data) => data)
      .catch((err) => err);
  };
  const productsOfSpecificSubcategory = async () => {
    return axios
      .get(
        `https://e-commerce-back-one.vercel.app/subcategory/${subCategoryId}/product/productsOfSpecificSubcategory`
      )
      .then((data) => data)
      .catch((err) => err);
  };
  useEffect(() => {
    (async () => {
      let data;
      if (subCategoryId == "all") {
        setIsLoading(true);
        data = await productsOfSpecificCategory();
      } else {
        setIsLoading(true);
        data = await productsOfSpecificSubcategory();
      }

      if (data.data) {
        setProducts(data.data.products);

        const lastProductIndex = currentPage * productsLimits;
        const firstProductIndex = lastProductIndex - productsLimits;
        const currentProducts = data.data.products.slice(
          firstProductIndex,
          lastProductIndex
        );
        setcurrentProducts(currentProducts);

        setErr(null);
        setIsLoading(false);
      } else if (data?.response?.status == 404) {
        setErr("There are no products inside this subcategory");
        setProducts(null);
        setIsLoading(false);
      } else if (
        data?.response?.data?.errMass == "TokenExpiredError: jwt expired"
      ) {
        localStorage.clear();
        setToken(null);
        setUserRole(null);
        setIsLoading(false);
        navigate("/login");
      }
    })();
  }, [subCategoryId]);

  useEffect(() => {
      const lastProductIndex = currentPage * productsLimits;
      const firstProductIndex = lastProductIndex - productsLimits;
      const currentProducts = products.slice(
        firstProductIndex,
        lastProductIndex
      );
      setcurrentProducts(currentProducts);
  }, [currentPage]);

  if (isLoading) {
    return <Loding />;
  }
  if (err && !products) {
    return (
      <>
        <div className="bg-body-tertiary p-5 w-100 h-100 d-flex align-items-center">
          <p className="text-center w-100">{err}</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <div className="row bg-body-tertiary px-5 py-3 m-0">
            <h4>
              {subCategoryId != "all"
                ? products[0].subcategoryId.name
                : "Products"}{" "}
              :
            </h4>
            {currentProducts.map((item) => (
              <div
                key={item._id}
                className="col-md-3 product rounded-3 py-2 cursor-pointer"
              >
                <Product item={item} cart={cartData?.data?.data?.cart} />
              </div>
            ))}
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
}

export default SubcategoryDetails;
