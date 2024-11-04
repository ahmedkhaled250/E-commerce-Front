import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../Assets/images/freshcart-logo.svg";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext/UserContext";
import { CartContext } from "../../Context/CartContext/CartContext";
import { toast } from "react-toastify";
function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, setUserRole,setWishListCount,wishListCount, profile } = useContext(UserContext);
  const { count, getUserCart, setCount } = useContext(CartContext);
  const getCart = async () => {
    const data = await getUserCart();
    if (data?.data?.message == "Done") {
      setCount(data.data.cart.numberOfProducts);
    }
    if (data?.response?.status == 400) {
      toast.error(data.response.data.errMass);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      navigate("/login");
    }
  };
  const getWishList = async () => {
    const data = await profile();
    if (data?.data?.message == "Done") {
      setWishListCount(data.data.user.wishList.length);
    }
    if (data?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      navigate("/login");
    }
  };
  useEffect(() => {
    (async () => {
      await getCart();
      await getWishList();
    })();
  }, []);
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="logo" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {token ? (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className={`nav-item`}>
                    <NavLink className="nav-link" to="/">
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/products">
                      Products
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/categories">
                      Categories
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/brands">
                      Brands
                    </NavLink>
                  </li>
                </ul>
              </>
            ) : (
              ""
            )}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link mx-2" to="/orders">
                  <span type="span" className="pt-2 px-3 position-relative">
                    <i class="fa-solid fa-bag-shopping"></i>
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link mx-2" to="/wish-list">
                  <span type="span" className="pt-2 px-3 position-relative">
                    <i class="fa-regular fa-heart"></i>
                    {!wishListCount ? (
                      ""
                    ) : (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {wishListCount}
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    )}
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link mx-2" to="/cart">
                  <span type="span" className="pt-2 px-3 position-relative">
                    <i class="fa-solid fa-cart-shopping"></i>
                    {!count ? (
                      ""
                    ) : (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {count}
                        <span className="visually-hidden">unread messages</span>
                      </span>
                    )}
                  </span>
                </NavLink>
              </li>
              {token ? (
                <li className="nav-item">
                  <span
                    onClick={() => logout()}
                    className="nav-link cursor-pointer"
                  >
                    Logout
                  </span>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
