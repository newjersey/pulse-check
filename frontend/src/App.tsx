import { Routes, Route } from 'react-router';
import Projects from './pages/Projects';
import './App.css'
import SubmitUpdate from './pages/SubmitUpdate';
import { DataContextProvider } from './utils/DataContext';
import Login from './pages/Login';
import { useEffect } from 'react';

function App() {
  const apiURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_ENDPOINT : import.meta.env.VITE_ENDPOINT;
  async function testApiAccess() {
    const test = await fetch(
      `${apiURL}/`,
    );
    console.log(await test.json())
  }

  useEffect(() => {
    testApiAccess()
  }, [])
  return (
    <DataContextProvider>
      <header className="usa-header usa-header--basic">
        <a className="usa-skipnav" href="#main-content">Skip to main content</a>
        <div className='usa-nav-container'>
          <div className="usa-navbar">
            <div className="usa-logo"><span className="usa-logo__text">Resx dashboard</span></div>
          </div>
        </div>
      </header>
      <main id="main-content" className="grid-container">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Projects/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/projects/:projectId" element={<Projects/>} />
          <Route path="/projects/:projectId" element={<Projects/>} />
          <Route path="/projects/:projectId/update" element={<SubmitUpdate  />} />
      </Routes>
      </main>
    </DataContextProvider>
  )
}

export default App
