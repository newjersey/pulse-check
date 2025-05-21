import { Routes, Route, Link } from 'react-router';
import Projects from './pages/Projects';
import './App.css'
import SubmitUpdate from './pages/SubmitUpdate';
import { DataContextProvider } from './contexts/DataContext';
import Login from './pages/Login';
import Project from './pages/Project';

function App() {
  return (
    <DataContextProvider>
      <header className="usa-header usa-header--basic">
        <a className="usa-skipnav" href="#main-content">Skip to main content</a>
        <div className='usa-nav-container'>
          <div className="usa-navbar">
            <div className="usa-logo">
              <Link to="/" className="usa-logo__text">Resx dashboard</Link>
            </div>
          </div>
        </div>
      </header>
      <main id="main-content" className="grid-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<Project />} />
          <Route path="/projects/:projectId/update" element={<SubmitUpdate />} />
        </Routes>
      </main>
    </DataContextProvider>
  )
}

export default App
