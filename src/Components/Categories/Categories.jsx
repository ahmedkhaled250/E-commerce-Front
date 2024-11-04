import { useQuery } from "react-query";
import axios from "axios";
import Loding from "../Loding/Loding";
import { Link } from "react-router-dom";
import { useState } from "react";
import Pagination from "../../utils/Pagination";
function Categories() {

    const [currentPage, setCurrentPage] = useState(1);
    const [categoryLimits, setCategoryLimits] = useState(1);

  const getCategories = async () => {
    return axios.get("https://e-commerce-back-one.vercel.app/category");
  };
  const { data, isLoading } = useQuery("getCategories", getCategories);


    const lastCategoryIndex = currentPage * categoryLimits;
    const firstCategoryIndex = lastCategoryIndex - categoryLimits;

    const currentCategories = data?.data.categories.slice(
      firstCategoryIndex,
      lastCategoryIndex
    );

  if (isLoading) {
    return <Loding />;
  }
  return (
    <>
      <div className="container mb-10">
        <div className="row  my-4 bg-main-light g-4 p-4">
          <h2>All Categories :</h2>
          {currentCategories.map((category) => (
            <div key={category._id} className="col-md-2 ">
              <div className="position-relative overflow-hidden  category rounded-3">
                <Link
                  to={`/category-details/${category._id}/all`}
                  className="text-center "
                >
                  <img
                    src={category.image.secure_url}
                    className="w-100"
                    alt={category.name}
                  />
                  <div className="position-absolute  start-0 w-100 h-100 layer">
                    <h3 className="position-absolute w-100 top-50 translate-middle-y text-white fs-5 p-2">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalRecords={data.data.categories.length}
          recordsLimits={categoryLimits}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}

export default Categories;
