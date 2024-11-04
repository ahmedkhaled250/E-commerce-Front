import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { PulseLoader } from "react-spinners";
import { UserContext } from "../../Context/UserContext/UserContext";

function ForgetPassword() {
  const navigate = useNavigate();
  const [sendCodeLoding, setSendCodeLoding] = useState(false);
  const [forgetPasswordLoding, setForgetPasswordLoding] = useState(false);
  const [sendCodeErr, setSendCodeErr] = useState(null);
  const [forgetPasswordErr, setForgetPasswordErr] = useState(null);
  const [sendCodeSuccess, setSendCodeSuccess] = useState(null);
  const [email, setEmail] = useState(null);
  const { setToken, setUserRole } = useContext(UserContext);
  const sendCodeInitialValues = {
    email: "",
  };
  const forgetPasswordValues = {
    code: "",
    password: "",
    cPassword: "",
  };

  const sendCodeValidationSchema = Yup.object({
    email: Yup.string()
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "In-valid email"
      )
      .required("email is required"),
    // code: Yup.number().required().min(4).max(4),
    // password: Yup.string()
    //   .min(8, "the minlengt of password is 8")
    //   .matches(
    //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    //     "password has to contain uppercase letter and lowercase letter and number and special character "
    //   )
    //   .required("Password is required"),
    // cPassword: Yup.string()
    //   .oneOf(
    //     [Yup.ref("password")],
    //     "confirm password and password are not the same"
    //   )
    //   .required("confirm password is required"),
  });
  const forgetPasswordValidationSchema = Yup.object({
    code: Yup.string()
      .matches(/^\d{4}$/, "Number must be 4 digits")
      .required(),
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
  });
  async function sendCode(values) {
    setSendCodeSuccess(null);
    setSendCodeLoding(true);
    const { data } = await axios
      .patch("https://e-commerce-back-one.vercel.app/auth/sendCode", values)
      .catch((err) => {
        setSendCodeLoding(false);
        setSendCodeErr(err.response.data.errMass);
        document
          .getElementById("forgetPsswordForm")
          .classList.remove("d-block");
        document.getElementById("forgetPsswordForm").classList.add("d-none");
        document.getElementById("forgetPsswordForm").classList.add("d-block");
        setSendCodeSuccess(null);
      });
    if (data.message == "Done") {
      setSendCodeLoding(false);
      setSendCodeErr(null);
      document.getElementById("forgetPsswordForm").classList.add("d-block");
      document.getElementById("forgetPsswordForm").classList.remove("d-none");
      setSendCodeSuccess("Please, check your email. we sent you a code");
      setEmail(values.email);
      console.log(email);
      setTimeout(() => {
        setSendCodeSuccess(null);
      }, 5000);
    }
  }
  async function forgetPassword(values) {
    values.email = email;
    console.log(values);
    setForgetPasswordLoding(true);
    const { data } = await axios
      .patch("https://e-commerce-back-one.vercel.app/auth/forgetPassword", values)
      .catch((err) => {
        setForgetPasswordLoding(false);
        setForgetPasswordErr(err.response.data.errMass);
      });
    if (data.message == "Done") {
      console.log(data);
      setForgetPasswordLoding(false);
      setForgetPasswordErr(null);
      localStorage.setItem("Token", data.token);
      console.log(data.role);
      localStorage.setItem("Role", data.role);
      setToken(data.token);
      setUserRole(data.role);
      navigate("/");
    }
  }

  const sendCodeForm = useFormik({
    initialValues: sendCodeInitialValues,
    validationSchema: sendCodeValidationSchema,
    onSubmit: sendCode,
  });

  const forgetPasswordForm = useFormik({
    initialValues: forgetPasswordValues,
    validationSchema: forgetPasswordValidationSchema,
    onSubmit: forgetPassword,
  });
  return (
    <>
      <div className="container pb-5">
        <h2 className="py-2">Forget password</h2>
        <form className="pb-4" onSubmit={sendCodeForm.handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            className="form-control mt-1 mb-2 input-focus"
            id="email"
            name="email"
            type="email"
            onBlur={sendCodeForm.handleBlur}
            onChange={sendCodeForm.handleChange}
            value={sendCodeForm.values.email}
          />
          {sendCodeForm.errors.email && sendCodeForm.touched.email ? (
            <div className="alert alert-danger">
              {sendCodeForm.errors.email}
            </div>
          ) : (
            ""
          )}
          {sendCodeErr ? (
            <div className="alert alert-danger">{sendCodeErr}</div>
          ) : (
            ""
          )}
          {sendCodeSuccess ? (
            <div className="alert alert-success py-2">{sendCodeSuccess}</div>
          ) : (
            ""
          )}
          {sendCodeLoding ? (
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
              disabled={!(sendCodeForm.isValid && sendCodeForm.dirty)}
              className="btn bg-main text-white"
              type="submit"
            >
              Send code
            </button>
          )}
        </form>
        <form
          id="forgetPsswordForm"
          onSubmit={forgetPasswordForm.handleSubmit}
          className="d-none"
        >
          <label htmlFor="code">code</label>
          <input
            className="form-control mt-1 mb-2 input-focus"
            id="code"
            name="code"
            type="number"
            onBlur={forgetPasswordForm.handleBlur}
            onChange={forgetPasswordForm.handleChange}
            value={forgetPasswordForm.values.code}
          />
          {forgetPasswordForm.errors.code && forgetPasswordForm.touched.code ? (
            <div className="alert alert-danger">
              {forgetPasswordForm.errors.code}
            </div>
          ) : (
            ""
          )}
          <label htmlFor="password">password</label>
          <input
            className="form-control mt-1 mb-2 input-focus"
            id="password"
            name="password"
            type="password"
            onBlur={forgetPasswordForm.handleBlur}
            onChange={forgetPasswordForm.handleChange}
            value={forgetPasswordForm.values.password}
          />
          {forgetPasswordForm.errors.password &&
          forgetPasswordForm.touched.password ? (
            <div className="alert alert-danger">
              {forgetPasswordForm.errors.password}
            </div>
          ) : (
            ""
          )}
          <label htmlFor="cPassword">confirm password</label>
          <input
            className="form-control mt-1 mb-2 input-focus"
            id="cPassword"
            name="cPassword"
            type="password"
            onBlur={forgetPasswordForm.handleBlur}
            onChange={forgetPasswordForm.handleChange}
            value={forgetPasswordForm.values.cPassword}
          />
          {forgetPasswordForm.errors.cPassword &&
          forgetPasswordForm.touched.cPassword ? (
            <div className="alert alert-danger">
              {forgetPasswordForm.errors.cPassword}
            </div>
          ) : (
            ""
          )}
          {forgetPasswordErr ? (
            <div className="alert alert-danger">{forgetPasswordErr}</div>
          ) : (
            ""
          )}
          {forgetPasswordLoding ? (
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
                !(forgetPasswordForm.isValid && forgetPasswordForm.dirty) ||
                forgetPasswordForm.errors.gender
              }
              className="btn bg-main text-white"
              type="submit"
            >
              Change password
            </button>
          )}
        </form>
      </div>
    </>
  );
}



export default ForgetPassword;
