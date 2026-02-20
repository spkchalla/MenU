import { Navigate } from "react-router-dom";
// TEMP: Client-side route guard using localStorage JWT
// TODO: Replace with secure httpOnly cookie/session authentication

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("menu_token");
  const payload = token ? parseJwt(token) : null;

  const role = payload?.role;
  // Check if user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is an admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
