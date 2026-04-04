import { Navigate } from "react-router-dom";
// TEMP: Client-side route guard using localStorage JWT
// TODO: Replace with secure httpOnly cookie/session authentication

import { jwtDecode } from "jwt-decode";

const parseJwt = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("menu_token");
  const payload = token ? parseJwt(token) : null;

  // Check if token is valid and not expired
  const isTokenValid = payload && payload.exp && payload.exp * 1000 > Date.now();

  if (!token || !isTokenValid) {
    // Clear stale auth
    localStorage.removeItem("menu_token");
    localStorage.removeItem("menu_user_role");
    localStorage.removeItem("menu_user_id");
    return <Navigate to="/login" replace />;
  }

  const role = payload?.role;

  // Check if user is an admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
