import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

function CategoryDetails() {
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState({});
  const getCategory = async () => {
    const { data } = await axios.get(
      `https://e-commerce-back-one.vercel.app/category/${id}`
    );
    setSubcategories(data.category.subcategory);
    setCategory(data.category);
  };
  useEffect(() => {
    getCategory();
  }, []);
  return (
    <>
      <div className="row g-0 m-0 mb-10">
        <div className="col-md-2 ">
          <div className="text-center">
            <ul className="overflow-auto vh-75 navbar-nav me-auto mb-2 mb-lg-0 bg-body-tertiary p-3">
              <h3 className="p-0 m-0">{category.name}</h3>
              <hr />
              <li className="nav-item">
                <NavLink className="nav-link nav-subCategory" to="all">
                  All
                </NavLink>
              </li>
              {subcategories.map((item) => {
                return (
                  <li className="nav-item" key={item._id}>
                    <NavLink
                      className="nav-link nav-subCategory"
                      to={`${item._id}`}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="col-md-10 m-0 p-0">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
}

export default CategoryDetails;
