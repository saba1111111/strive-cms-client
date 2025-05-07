// src/routes/PublicRoute.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchAdmin } from "../store/authSlice";
import { Navigate, Outlet } from "react-router-dom";

interface PublicRouteProps {
  /** Where to send an already-logged-in user */
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  redirectTo = "/dashboard",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status } = useSelector((s: RootState) => s.auth);

  // on mount or when status resets to "idle", re-check auth
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAdmin());
    }
  }, [status, dispatch]);

  // while we’re checking, show a loader
  if (status === "loading") return <div>Loading…</div>;

  // if there is a user, kick them out to the protected area
  if (user) return <Navigate to={redirectTo} replace />;

  // otherwise render whatever child route is defined
  return <Outlet />;
};

export default PublicRoute;
