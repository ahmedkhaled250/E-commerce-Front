import axios from "axios";
import { createContext, useContext, useState } from "react";
export const UserContext = createContext()
function UserContextProvider(props) {
  const [token, setToken] = useState(localStorage.getItem("Token"))
  const [userRole, setUserRole] = useState(localStorage.getItem("Role"))
  const [wishListCount, setWishListCount] = useState(0)

  const profile = async () => {
    return axios.get(`https://e-commerce-back-one.vercel.app/user/profile`,{
      headers: { authorization: `Hamada__${token}` }
    }).then(data => data).catch(err => err)
  }

  const addToWishList = async (id) => {
    return axios.patch(`https://e-commerce-back-one.vercel.app/product/${id}/wishList/add`,{},{
      headers: { authorization: `Hamada__${token}` }
    }).then(data => data).catch(err => err)
  }

  const removeFromWishList = async (id) => {
    return axios.patch(`https://e-commerce-back-one.vercel.app/product/${id}/wishList/remove`,{},{
      headers: { authorization: `Hamada__${token}` }
    }).then(data => data).catch(err => err)
  }
  
  return (
    <UserContext.Provider value={{ token, setToken, userRole, addToWishList, wishListCount, setWishListCount, removeFromWishList, setUserRole, profile }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
