
import { ReactNode} from 'react';
import { Link } from 'react-router';
import imageUrl from "@newjersey/njwds/dist/img/sprite.svg";
import useProject from '../utils/useProject';


export default ({ children }: { children: ReactNode }) => {
  const { projectId } = useProject()

  return (
    <>
      <header className="usa-header usa-header--basic">
        <a className="usa-skipnav" href="#main-content">Skip to main content</a>
        <div className='usa-nav-container'>
          <div className="usa-navbar">
            <div className="usa-logo">
              <Link to="/" className="usa-logo__text">Project tracker dashboard</Link>
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
                <Link className="usa-nav-link" to={{ pathname: `/projects/update`, search: projectId ? `?projectId=${projectId}` : undefined }}>Add update</Link>
              </li>
              <li className='usa-nav__primary-item'>
                <Link className="usa-nav-link" to={`/projects/new`}>Add project</Link>
              </li>
              <li className='usa-nav__primary-item'>
                <Link className="usa-nav-link" to={{ pathname: `/projects/edit`, search: projectId ? `?projectId=${projectId}` : undefined }}>Edit project</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main-content" className="grid-container">
        {children}
      </main>
    </>
  )
}