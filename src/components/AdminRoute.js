import {  Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminRoute({ children }) {
    const { currentUser } = useAuth();
    let bool
    if (currentUser) {
        bool = currentUser.email === "b.kurul@outlook.com"
    } else {
        bool = false
    }
  return bool ? children : <Navigate to="/" />;
}