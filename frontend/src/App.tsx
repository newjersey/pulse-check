import { Routes, Route, NavLink } from 'react-router';
import Updates from './pages/Updates';
import './App.css'
import SubmitUpdate from './pages/SubmitUpdate';

function App() {
  return (
    <>
      <header className="usa-header usa-header--basic">
        <a className="usa-skipnav" href="#main-content">Skip to main content</a>
        <div className='usa-nav-container'>
          <div className="usa-navbar">
            <div className="usa-logo"><span className="usa-logo__text">Resx dashboard</span></div>
          </div>
          <nav className="usa-nav">
            <ul className="usa-nav__primary usa-accordion">
              <li className="usa-nav__primary-item">
                <NavLink to="/" className={({ isActive }) =>
                  isActive ? "active" : ""
              }>
                  Updates
                </NavLink>
              </li>
              <li className="usa-nav__primary-item">
                <NavLink to="/submit-update" className={({ isActive }) =>
                  isActive ? "active" : ""
              }>
                  Submit an update
                </NavLink>
              </li>          
            </ul>
          </nav>
          </div>
      </header>
      <main id="main-content" className="grid-container">
        <Routes>
          <Route path="/" element={<Updates/>} />
          <Route path="/submit-update" element={<SubmitUpdate/>} />
        </Routes>
      </main>
    </>
  )
}

export default App
