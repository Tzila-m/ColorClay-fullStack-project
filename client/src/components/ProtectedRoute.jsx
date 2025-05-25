import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLoggedIn);

  // אם אין טוקן או לא מחובר
  if (!token || !isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp && decoded.exp < currentTime) {
      // הטוקן פג תוקף
      return <Navigate to="/login" replace />;
    }

    return children;

  } catch (err) {
    // טוקן שגוי או לא ניתן לפענוח
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
