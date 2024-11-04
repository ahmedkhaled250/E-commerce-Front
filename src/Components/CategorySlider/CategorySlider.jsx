import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import axios from "axios";
import Loding from "../Loding/Loding";
function CategorySlider( ) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    setIsLoading(true)
    const { data } = await axios.get(
      "https://e-commerce-back-one.vercel.app/category"
    );
    if (data) { 
      setIsLoading(false)
      setCategories(data.categories);
    }
  };
  
  useEffect(() => {
    getCategories();
  }, []);

  if (isLoading) {
    return <Loding/>
  }
  return (
    <div className="">
      <OwlCarousel
        className="owl-theme"
        autoplay
        autoplayTimeout={1000}
        items={4}
        loop
        dots={false}
      >
        {categories.map((category) => {
          return (
            <div key={category._id}>
              <img
                src={category.image.secure_url}
                className="smallImg"
                alt={category.name}
              />
            </div>
          );
        })}
      </OwlCarousel>
    </div>
  );
}

export default CategorySlider;
