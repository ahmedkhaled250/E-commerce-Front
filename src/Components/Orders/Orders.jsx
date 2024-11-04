import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext/UserContext";
import Loding from "../Loding/Loding";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext/CartContext";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import ProductOrder from "../ProductOrder/ProductOrder";
import { useQuery } from "react-query";

function Orders() {
  const { token, setToken, setUserRole } = useContext(UserContext);
  const navigate = useNavigate();
  const [isCencelLoading, setIsCencelLoading] = useState(false);
  const { UserCartData } = useContext(CartContext);

  const getOrders = async () => {
    return axios.get(
      "https://e-commerce-back-one.vercel.app/order?sort=-date",
      {
        headers: { authorization: `Hamada__${token}` },
      }
    );
  };
  const { data, isLoading } = useQuery("getOrders", getOrders, {
    refetchInterval: 5000,
  });
  if (data?.status == 500) {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    navigate("/login");
  }

  const cartData = UserCartData();
  if (cartData?.data?.status == 500) {
    localStorage.clear();
    setToken(null);
    setUserRole(null);  
    navigate("/login");
  }

  const cencelOrder = async (id) => {
    setIsCencelLoading(true);
    const data = await axios
      .patch(
        `https://e-commerce-back-one.vercel.app/order/${id}/cencelOrder`,
        {},
        {
          headers: { authorization: `Hamada__${token}` },
        }
      )
      .catch((err) => {
        if (err?.response?.data?.errMass == "TokenExpiredError: jwt expired") {
          setIsCencelLoading(false);
          localStorage.clear();
          setToken(null);
          setUserRole(null);
          navigate("/login");
        } else {
          toast.error(err.response.data.errMass);
          setIsCencelLoading(false);
        }
      });
    if (data?.data?.message == "Done") {
      setIsCencelLoading(false);
      for (const order of data?.data?.orders) {
        if (order._id == data.data.order._id) {
          order = data.data.order;
          break;
        }
      }
    }
  };

  if (isLoading) {
    return <Loding />;
  }
  return (
    <>
      <div className="container mt-5 p-4 mb-10">
        <h2>My orders :</h2>
        {data?.data?.orders.map((order) => (
          <div key={order._id} className="order my-2 rounded-3 overflow-hidden">
            <div className="bg-main-light d-flex justify-content-between align-items-center px-3 py-4">
              <p className="mb-0">
                data: {order.date.split("T")[0]} -{" "}
                {order.date.split("T")[1].slice(0, 5)}
              </p>
              <p className="mb-0">status: {order.status}</p>
              <p className="mb-0">Final price: {order.finalPrice}</p>
              <p className="mb-0">Shipping to: {order.address}</p>
            </div>
            <hr className="m-0" />
            <div className="row p-4">
              {order.products.map((product) => (
                <ProductOrder
                  key={product._id}
                  cart={cartData?.data?.data?.cart}
                  product={product}
                  statusOrder={order.status}
                />
              ))}
              {(order.status == "placed" && order.paymentMethod == "cash") ||
              (order.status == "waitPayment" &&
                order.paymentMethod == "card") ? (
                <>
                  {isCencelLoading ? (
                    <button className="btn btn-danger mt-0 w-100">
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
                      onClick={() => cencelOrder(order._id)}
                      className="btn btn-danger mt-0 w-100"
                    >
                      Cencel order
                    </button>
                  )}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Orders;
