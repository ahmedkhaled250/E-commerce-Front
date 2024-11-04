import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext/UserContext";
import Loding from "../Loding/Loding";
function ProtectedRoute(props) {
  const { setToken, setUserRole, profile } = useContext(UserContext);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    userProfile();
  }, []);

  if (!localStorage.getItem("Token")) {
    return <Navigate to="/login" />;
  }
  const userProfile = async () => {
    const data = await profile();
    if (data.data?.user.role == "User") {
      setIsLoading(false);
      setIsValid(true);
    } else {
      setIsLoading(false);
      localStorage.clear();
      setToken(null);
      setUserRole(null);
      setIsValid(false);
    }
  };

  if (isLoading) {
    return <Loding />;
  }

  if (isValid) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}
export default ProtectedRoute;
