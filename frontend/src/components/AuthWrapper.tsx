import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useDataContext } from "../contexts/DataContext";

export default function({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  const { authToken } = useDataContext();
  
  return authToken ? <>{ children }</> : <Navigate to="/login" state={{ pathname }}/>
}