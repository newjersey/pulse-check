import { useEffect, ReactNode } from "react";
import { useDataContext } from "../utils/DataContext";

export default function({ title, children }: { title: string, children: ReactNode }) {
  const { loading } = useDataContext();

  useEffect(() => {
    document.title = `${title} | Pulse Check Resx Dashboard`;
  }, [title]);

  return <>
    <h1>{ title }</h1>
    { loading ? 'Loading...' : children }
  </>
}