import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Loding from "../Loding/Loding";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";
import { UserContext } from "../../Context/UserContext/UserContext";
import { toast } from "react-toastify";
function AddRating() {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddLoading, setIsAddLoading] = useState(true);
  const navigate = useNavigate();
  const { setToken, setUserRole, token } = useContext(UserContext);

  const getProduct = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      `https://e-commerce-back-one.vercel.app/product/${id}`
    );
    setProduct(data.product);
    setIsLoading(false);
  };

  const initialValues = {
    rating,
    message: "",
  };
  const validationSchema = Yup.object({
    message: Yup.string()
      .required("review is required")
      .min(2, "the minlengt of review  is 2")
      .max(300, "the maxlength of review is 300"),
  });

  async function addReview(values) {
    values.rating = rating;
    console.log(values);
    setIsAddLoading(true);
    const { data } = await axios
      .post(
        `https://e-commerce-back-one.vercel.app/product/${product._id}/review`,
        values,
        {
          headers: { authorization: `Hamada__${token}` },
        }
      )
      .catch((err) => {
        setIsAddLoading(false);
        setErr(err.response.data.errMass);
      });
    console.log(data);
    if (data.message == "Done") {
      toast.success("review added successfully to cart");
      setIsAddLoading(false);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      navigate("/login");
      setIsAddLoading(false);
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: addReview,
  });

  useEffect(() => {
    getProduct();
  }, []);
  if (isLoading) {
    return <Loding />;
  }

  return (
    <>
      <div className="container my-5">
        <h2>Add review :</h2>
        <div className="d-flex gap-3 align-items-center my-3">
          <img
            className="w-10"
            src={product.mainImage?.secure_url}
            alt={product.name}
          />
          <h3 className="text-main">{product.name}</h3>
        </div>
        <hr />
        <h3>Overall rating :</h3>
        <div className="stars">
          {[...Array(5)].map((star, index) => {
            const currentRating = index + 1;
            return (
              <label>
                <input
                  onClick={() => setRating(currentRating)}
                  type="radio"
                  name="rating"
                  value={currentRating}
                />
                <FaStar
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                  color={
                    currentRating <= (hover || rating) ? "ffc107" : "e4e5e9"
                  }
                  className="star"
                  size={50}
                />
              </label>
            );
          })}
          <hr />
          <form className="pb-4" onSubmit={formik.handleSubmit}>
            <label className="fs-3" htmlFor="message">
              Enter your review :
            </label>
            <textarea
              className={`form-control mt-1 mb-2 input-focus ${
                formik.errors.email && formik.touched.email
                  ? "is-invalid"
                  : "is-valid"
              }`}
              name="message"
              id="message"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
            ></textarea>
            {err ? <div className="alert alert-danger">{err}</div> : ""}
            {formik.errors.message && formik.touched.message ? (
              <div className="alert alert-danger">{formik.errors.message}</div>
            ) : (
              ""
            )}
            <hr />
            {isLoading ? (
              <button disabled className="btn bg-main text-white">
                <PulseLoader
                  color="#fff"
                  cssOverride={{}}
                  loading
                  margin={2}
                  size={7}
                  speedMultiplier={1}
                />
              </button>
            ) : (
              <button
                disabled={!(formik.isValid && formik.dirty) || !rating}
                className="btn bg-main text-white"
                type="submit"
              >
                publish review
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default AddRating;
