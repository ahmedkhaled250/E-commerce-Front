import { Navigate } from "react-router-dom";
function ProtectedRegisterRoute(props) {
  if (!localStorage.getItem("Token")) {
    return props.children;
  } else {
    return <Navigate to="/" />;
  }
}
export default ProtectedRegisterRoute;
