import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { PulseLoader } from "react-spinners";
import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext/UserContext";
function Login() {
  const { setToken, setUserRole } = useContext(UserContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
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
  });

  const login = async (values) => {
    setIsLoading(true);
    const { data } = await axios
      .post("https://e-commerce-back-one.vercel.app/auth/signin", values)
      .catch((err) => {
        setIsLoading(false);
        setErr(err.response.data.errMass);
      });
    if (data.message == "Done") {
      setIsLoading(false);
      setErr(null);
      localStorage.setItem("Token", data.token);
      localStorage.setItem("Role", data.role);
      setToken(data.token);
      setUserRole(data.role);
      navigate("/");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: login,
  });
  return (
    <>
      <div className="container d-flex align-items-center ">
        <div className="w-100">
          <h2 className="py-2">Login Now</h2>
          <form className="pb-4" onSubmit={formik.handleSubmit}>
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
                disabled={!(formik.isValid && formik.dirty)}
                className="btn bg-main text-white"
                type="submit"
              >
                Login
              </button>
            )}
            <Link to="/forget-password" className={`mx-3`}>
              Forget Password
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
