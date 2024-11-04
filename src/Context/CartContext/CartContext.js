import axios from "axios";
import { createContext, useContext, useState } from "react";
import { UserContext } from "../UserContext/UserContext";
import { useQuery } from "react-query";
export const CartContext = createContext()
function CartContextProvider(props) {
    const { token } = useContext(UserContext)

    const addToCart = async (productId, quantity) => {
        return axios.post("https://e-commerce-back-one.vercel.app/cart", { productId, quantity }, {
            headers: { authorization: `Hamada__${token}` }
        }).then(data => data).catch(err => err)
    }
    const getUserCart = async () => {
        return axios.get("https://e-commerce-back-one.vercel.app/cart", {
            headers: { authorization: `Hamada__${token}` }
        }).then(data => data).catch(err => err)
    }
    const resetCart = async (cartId) => {
        return axios.put(`https://e-commerce-back-one.vercel.app/cart/${cartId}`, {}, {
            headers: { authorization: `Hamada__${token}` }
        }).then(data => data).catch(err => err)
    }
    const deleteProductFromCart = async (cartId, productId) => {
        return axios.patch(`https://e-commerce-back-one.vercel.app/product/${productId}/cart/${cartId}`, {}, {
            headers: { authorization: `Hamada__${token}` }
        }).then(data => data).catch(err => err)
    }
    const UserCartData = () => {
        const getCart = async () => {
            return axios.get("https://e-commerce-back-one.vercel.app/cart", {
                headers: { authorization: `Hamada__${token}` },
            });
        };
        const cartData = useQuery("getCart", getCart, {
            refetchInterval: 1000,
        });
        return cartData
    }
    const [count, setCount] = useState(0)
    return (
        <CartContext.Provider value={{ UserCartData, count, deleteProductFromCart, setCount, addToCart, getUserCart, resetCart }}>
            {props.children}
        </CartContext.Provider>
    );
}

export default CartContextProvider;
