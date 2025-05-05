import { useEffect, ReactNode } from "react";
import { useDataContext } from "../utils/DataContext";
import AuthWrapper from "./AuthWrapper";

export default function ({ title, children, useAuthWrapper = true }: { title: string, children: ReactNode, useAuthWrapper?: boolean }) {
  const { loading } = useDataContext();

  useEffect(() => {
    document.title = `${title} | Pulse Check Resx Dashboard`;
  }, [title]);

  if (useAuthWrapper) {
    return <AuthWrapper>
      <h1>{title}</h1>
      {loading ? 'Loading...' : children}
    </AuthWrapper>
  }

  return <>
    <h1>{title}</h1>
    {loading ? 'Loading...' : children}
  </>
}