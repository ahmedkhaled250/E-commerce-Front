import React from "react";
import img1 from "../../Assets/images/slider-image-1.jpeg";
import img2 from "../../Assets/images/slider-image-2.jpeg";
import img3 from "../../Assets/images/slider-image-3.jpeg";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
function MailnSlide() {
  return (
    <div className="row g-0 my-5">
      <div className="col-md-8">
        <OwlCarousel
          className="owl-theme"
          autoplay
          autoplayTimeout={1000}
          items={1}
          loop
          dots={false}
        >
          <div class="item">
            <img src={img1} className="w-100 img1" alt="" />
          </div>
          <div class="item">
            <img src={img2} className="w-100 img1" alt="" />
          </div>
          <div class="item">
            <img src={img3} className="w-100 img1" alt="" />
          </div>
        </OwlCarousel>
      </div>
      <div className="col-md-4">
        <img src={img1} alt="" className="w-100 smallImg" />
        <img src={img2} alt="" className="w-100 smallImg" />
      </div>
    </div>
  );
}

export default MailnSlide;
