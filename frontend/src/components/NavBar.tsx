import { RefObject } from "react";
import { Link, useLocation } from "react-router";
import useProject from "../utils/useProject";
import imageUrl from "@newjersey/njwds/dist/img/sprite.svg";


export default function ({ mainRef }: { mainRef: RefObject<HTMLElement | null> }) {
  const { projectId } = useProject()
  function skipNavClick(e: { preventDefault: () => void; }) {
    e.preventDefault()
    if (!mainRef.current) { return }
    mainRef.current.focus()
  }

  const { pathname } = useLocation()
  return (
    <header className="usa-header usa-header--basic">
      <a className="usa-skipnav" href="#" onClick={skipNavClick}>Skip to main content</a>
      <div className='usa-nav-container'>
        <div className="usa-navbar">
          <div className="usa-logo site-logo">
            <Link to="/" className="usa-logo__text site-logo__text display-flex flex-align-center">
              <img src="/logo.png" className='margin-right-1' style={{ height: '2em' }} />
              <span>
                Project tracker dashboard
              </span>
            </Link>
          </div>
          <button className='usa-menu-btn'>Menu</button>
        </div>
        <nav className='usa-nav'>
          <button type="button" className="usa-nav__close">
            <span className='usa-sr-only'>Close</span>
            <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
              <use href={`${imageUrl}#close`}></use>
            </svg>
          </button>
          <ul className='usa-nav__primary usa-accordion'>
            <li className='usa-nav__primary-item'>
              <Link className={`usa-nav-link${pathname === '/projects/update' ? ' usa-current' : ''}`} to={{ pathname: `/projects/update`, search: projectId ? `?projectId=${projectId}` : undefined }}>Add update</Link>
            </li>
            <li className='usa-nav__primary-item'>
              <Link className={`usa-nav-link${pathname === '/projects/new' ? ' usa-current' : ''}`} to={`/projects/new`}>Add project</Link>
            </li>
            <li className='usa-nav__primary-item'>
              <Link className={`usa-nav-link${pathname === '/projects/edit' ? ' usa-current' : ''}`} to={{ pathname: `/projects/edit`, search: projectId ? `?projectId=${projectId}` : undefined }}>Edit project</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}