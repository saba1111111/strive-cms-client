import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchAdmin } from "../store/authSlice";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAdmin());
    }
  }, [status, dispatch]);

  if (status === "loading") return <div>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
