import { Routes, Route, Link } from 'react-router';
import Projects from './pages/Projects';
import './App.css'
import SubmitUpdate from './pages/AddUpdate/AddUpdate';
import { DataContextProvider } from './contexts/DataContext';
import Login from './pages/Login';
import Project from './pages/Project';
import imageUrl from "@newjersey/njwds/dist/img/sprite.svg";
import EditProject from './pages/EditProject/EditProject';

function App() {
  let projectId = 'tbd';
  const locationHash = window.location.hash.split('/')
  if (locationHash[1] === 'projects') {
    projectId = locationHash[2]
  }

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
                <Link className="usa-nav-link" to={`/projects/new`}>Add project</Link>
              </li>
              <li className='usa-nav__primary-item'>
                <Link className="usa-nav-link" to={{ pathname: `/projects/edit`, search: `?projectId=${projectId}` }}>Edit project</Link>
              </li>
              <li className='usa-nav__primary-item'>
                <Link className="usa-nav-link" to={{ pathname: `/projects/update`, search: `?projectId=${projectId}` }}>Add update</Link>
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
          <Route path="/projects/new" element={<EditProject />} />
          <Route path="/projects/edit" element={<EditProject />} />
          <Route path="/projects/update" element={<SubmitUpdate />} />
        </Routes>
      </main>
    </DataContextProvider>
  )
}

export default App
