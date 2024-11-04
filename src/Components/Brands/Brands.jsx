import { useQuery } from "react-query";
import axios from "axios";
import Loding from "../Loding/Loding";
import { Link } from "react-router-dom";
import Pagination from "../../utils/Pagination";
import { useState } from "react";
function Brands() {
    const [currentPage, setCurrentPage] = useState(1);
    const [brandLimits, setBrandLimits] = useState(1);
  const getBrands = async () => {
    return axios.get("https://e-commerce-back-one.vercel.app/brand");
  };
  const { data, isLoading } = useQuery("getBrands", getBrands);

    const lastBrandIndex = currentPage * brandLimits;
    const firstBrandIndex = lastBrandIndex - brandLimits;

    const currentBrands = data?.data.brands.slice(
      firstBrandIndex,
      lastBrandIndex
    );


  if (isLoading) {
    return <Loding />;
  }
  return (
    <>
      <div className="container mb-10">
        <div className="row  my-4 bg-main-light g-4 p-4">
          <h2>All Brands :</h2>
          {currentBrands.map((brand) => (
            <div key={brand._id} className="col-md-2">
              <Link to={`/brand-details/${brand._id}`} className="text-center">
                <img
                  src={brand.image.secure_url}
                  className="w-100"
                  alt={brand.name}
                />
                <h3>{brand.name}</h3>
              </Link>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalRecords={data.data.brands.length}
          recordsLimits={brandLimits}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}

export default Brands;
