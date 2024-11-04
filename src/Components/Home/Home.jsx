import { useState } from "react";
import CategorySlider from "../CategorySlider/CategorySlider";
import MailnSlide from "../MailnSlide/MailnSlide";
import Loding from "../Loding/Loding";
import Products from "../Products/Products";
function Home() {
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    return <Loding />;
  }
  return (
    <>
      <div className="container mb-10">
        <MailnSlide />
        <CategorySlider />
        <Products />
      </div>
    </>
  );
}

export default Home;
