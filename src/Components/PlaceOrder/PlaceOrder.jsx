import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
// import { useNavigate} from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext/UserContext";

function PlaceOrder() {
  const navigate = useNavigate();
  const { token } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);

  const initialValues = {
    phone: "",
    paymentMethod: "",
    address: "",
    note: "",
    couponName: "",
  };

  const validationSchema = Yup.object({
    phone: Yup.string()
      .matches(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        "In-valid phone"
      )
      .required("Phone is required"),
    address: Yup.string().required("Address is required").min(2).max(50),
    note: Yup.string(),
    couponName: Yup.string(),
  });

  async function PlaceOrder(values) {
    setIsLoading(true);
    if (values.couponName == "") {
      delete values.couponName;
    }
    if (values.note == "") {
      delete values.note;
    }
    const { data } = await axios
      .post("https://e-commerce-back-one.vercel.app/order", values, {
        headers: { authorization: `Hamada__${token}` },
      })
      .catch((err) => {
        setIsLoading(false);
        setErr(err.response.data.errMass);
      });
    if (data.message == "Done") {
      setIsLoading(false);
      setErr(null);
      if (data.url) {
        window.location.href = data.url;
      } else {
        navigate("/order");
      }
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: PlaceOrder,
  });

  return (
    <>
      <div className="container ">
        <h2 className="py-2">Place order :</h2>
        <form className="pb-4" onSubmit={formik.handleSubmit}>
          <label htmlFor="phone">phone</label>
          <input
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.phone && formik.touched.phone
                ? "is-invalid"
                : "is-valid"
            }`}
            id="phone"
            name="phone"
            type="tel"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
          {formik.errors.phone && formik.touched.phone ? (
            <div className="alert alert-danger">{formik.errors.phone}</div>
          ) : (
            ""
          )}
          <label htmlFor="address">address</label>
          <input
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.address && formik.touched.address
                ? "is-invalid"
                : "is-valid"
            }`}
            id="address"
            name="address"
            type="text"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.address}
          />
          {formik.errors.address && formik.touched.address ? (
            <div className="alert alert-danger">{formik.errors.address}</div>
          ) : (
            ""
          )}
          <label htmlFor="paymentMethod">Payment method</label>
          <select
            className="form-select mb-2 mt-1 input-focus"
            aria-label="Default select example"
            name="paymentMethod"
            id="paymentMethod"
            value={formik.values.paymentMethod}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select your payment method</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
          {!formik.values.paymentMethod && formik.touched.paymentMethod ? (
            <div className="alert alert-danger">
              {
                (formik.errors.paymentMethod =
                  "You have to choose one of (Cash , Card)")
              }
            </div>
          ) : (
            <>{delete formik.errors.paymentMethod}</>
          )}
          <label htmlFor="note">Note</label>
          <textarea
            maxLength="150"
            rows="2"
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.note && formik.touched.note
                ? "is-invalid"
                : "is-valid"
            }`}
            id="note"
            name="note"
            type="text"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.note}
          ></textarea>
          {formik.errors.note && formik.touched.note ? (
            <div className="alert alert-danger">{formik.errors.note}</div>
          ) : (
            ""
          )}
          <label htmlFor="couponName">Coupon name</label>
          <input
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.couponName && formik.touched.couponName
                ? "is-invalid"
                : "is-valid"
            }`}
            id="couponName"
            name="couponName"
            type="text"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.couponName}
          />
          {formik.errors.couponName && formik.touched.couponName ? (
            <div className="alert alert-danger">{formik.errors.couponName}</div>
          ) : (
            ""
          )}
          {err ? <div className="alert alert-danger">{err}</div> : ""}
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
              disabled={
                !(formik.isValid && formik.dirty) || formik.errors.paymentMethod
              }
              className="btn bg-main text-white"
              type="submit"
            >
              Place order
            </button>
          )}
        </form>
      </div>
    </>
  );
}
export default PlaceOrder;
