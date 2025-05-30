
import { ReactNode, useRef } from 'react';
import ErrorBoundary from './ErrorBoundary';
import NavBar from './NavBar';


export default ({ children }: { children: ReactNode }) => {
  const mainContentRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <NavBar mainRef={mainContentRef} />
      <main className="grid-container" ref={mainContentRef} tabIndex={-1}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </>
  )
}