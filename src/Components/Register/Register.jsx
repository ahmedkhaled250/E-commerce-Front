import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const initialValues = {
    userName: "",
    email: "",
    password: "",
    cPassword: "",
    phone: "",
    gender: "",
    address: "",
    DOB: "",
  };

  const validationSchema = Yup.object({
    userName: Yup.string()
      .required("User name is required")
      .min(2, "the minlengt of user name  is 2")
      .max(20, "the maxlength of user name is 20"),
    email: Yup.string()
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "In-valid email"
      )
      .required("email is required"),
    password: Yup.string()
      .min(8, "the minlengt of password is 8")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "password has to contain uppercase letter and lowercase letter and number and special character "
      )
      .required("Password is required"),
    cPassword: Yup.string()
      .oneOf(
        [Yup.ref("password")],
        "confirm password and password are not the same"
      )
      .required("confirm password is required"),
    phone: Yup.string().matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "In-valid phone"
    ),
    address: Yup.string(),
    DOB: Yup.date().max(
      new Date(new Date().getFullYear() - 10, 0, 1),
      "You have to be more than 10 Years"
    ),
  });

  async function register(values) {
    setIsLoading(true);
    if (values.DOB == "") {
      delete values.DOB;
    }
    if (values.address == "") {
      delete values.address;
    }
    if (values.phone == "") {
      delete values.phone;
    }
    const { data } = await axios
      .post("https://e-commerce-back-one.vercel.app/auth/signup", values)
      .catch((err) => {
        setIsLoading(false);
        setErr(err.response.data.errMass);
      });
    if (data.message == "Done") {
      setIsLoading(false);
      setErr(null);
      navigate("/login");
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: register,
  });

  
  return (
    <>
      <div className="container ">
        <h2 className="py-2">Register Now</h2>
        <form className="pb-4" onSubmit={formik.handleSubmit}>
          <label htmlFor="userName">user name</label>
          <input
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.userName && formik.touched.userName
                ? "is-invalid"
                : "is-valid"
            }`}
            id="userName"
            name="userName"
            type="text"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.userName}
          />
          {formik.errors.userName && formik.touched.userName ? (
            <div className="alert alert-danger">{formik.errors.userName}</div>
          ) : (
            ""
          )}
          <label htmlFor="email">E-mail</label>
          <input
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.email && formik.touched.email
                ? "is-invalid"
                : "is-valid"
            }`}
            id="email"
            name="email"
            type="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email ? (
            <div className="alert alert-danger">{formik.errors.email}</div>
          ) : (
            ""
          )}
          <label htmlFor="password">password</label>
          <input
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.password && formik.touched.password
                ? "is-invalid"
                : "is-valid"
            }`}
            id="password"
            name="password"
            type="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && formik.touched.password ? (
            <div className="alert alert-danger">{formik.errors.password}</div>
          ) : (
            ""
          )}
          <label htmlFor="cPassword">confirm password</label>
          <input
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.cPassword && formik.touched.cPassword
                ? "is-invalid"
                : "is-valid"
            }`}
            id="cPassword"
            name="cPassword"
            type="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.cPassword}
          />
          {formik.errors.cPassword && formik.touched.cPassword ? (
            <div className="alert alert-danger">{formik.errors.cPassword}</div>
          ) : (
            ""
          )}
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
          <label htmlFor="gender">Gender</label>
          <select
            className="form-select mb-2 mt-1 input-focus"
            aria-label="Default select example"
            name="gender"
            id="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {!formik.values.gender && formik.touched.gender ? (
            <div className="alert alert-danger">
              {
                (formik.errors.gender =
                  "You have to choose one of (Male , Femail)")
              }
            </div>
          ) : (
            <>{delete formik.errors.gender}</>
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
          <label htmlFor="DOB">date of birth</label>
          <input
            className={`form-control mt-1 mb-2 input-focus ${
              formik.errors.DOB && formik.touched.DOB
                ? "is-invalid"
                : "is-valid"
            }`}
            id="DOB"
            name="DOB"
            type="date"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.DOB}
          />

          {formik.errors.DOB && formik.touched.DOB ? (
            <div className="alert alert-danger">{formik.errors.DOB}</div>
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
                !(formik.isValid && formik.dirty) || formik.errors.gender
              }
              className="btn bg-main text-white"
              type="submit"
            >
              Sign up
            </button>
          )}
        </form>
      </div>
    </>
  );
}
export default Register;
