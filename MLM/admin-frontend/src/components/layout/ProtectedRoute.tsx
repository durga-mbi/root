import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/api.config";
import { refreshTokeApi } from "../../api/auth.api";

import { Box, CircularProgress } from "@mui/material";

const checkAuth = async () => {
  let res = await fetch(`${BASE_URL}/v1/admin/get`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      await refreshTokeApi();

      res = await fetch(`${BASE_URL}/v1/admin/get`, {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json();
};

const ProtectedRoute = () => {
  const { isLoading, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: checkAuth,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f6f9", // optional
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;