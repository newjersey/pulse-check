import { Routes, Route, Link, useParams } from 'react-router';
import Projects from './pages/Projects';
import './App.css'
import SubmitUpdate from './pages/SubmitUpdate';
import { DataContextProvider } from './contexts/DataContext';
import Login from './pages/Login';
import Project from './pages/Project';
import imageUrl from "@newjersey/njwds/dist/img/sprite.svg";

function App() {
  const { projectId } = useParams()
  const editUpdateId = projectId ?? 'tbd';
  // TODO USE QUERY PARAM INSTEAD

  return (
    <DataContextProvider>
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
                <Link className="usa-nav-link" to={`/projects/new/edit`}>Add project</Link>
              </li>
              <li className='usa-nav__primary-item'>
                <Link className="usa-nav-link" to={`/projects/${editUpdateId}/edit`}>Edit project</Link>
              </li>
              <li className='usa-nav__primary-item'>
                <Link className="usa-nav-link" to={`/projects/${editUpdateId}/update`}>Add update</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main-content" className="grid-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<Project />} />
          <Route path="/projects/:projectId/edit" element={<SubmitUpdate />} />
          <Route path="/projects/:projectId/update" element={<SubmitUpdate />} />
        </Routes>
      </main>
    </DataContextProvider>
  )
}

export default App
