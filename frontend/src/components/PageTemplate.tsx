import { useEffect, ReactNode } from "react";

export default function({ title, children }: { title: string, children: ReactNode }) {
  useEffect(() => {
    document.title = `${title} | Pulse Check Resx Dashboard`;
  }, [title]);

  return <>
    <h1>{ title }</h1>
    { children }
  </>
}