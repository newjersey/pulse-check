import { Routes, Route } from 'react-router';
import Projects from './pages/Projects';
import './App.css'
import SubmitUpdate from './pages/AddUpdate/AddUpdate';
import Login from './pages/Login';
import Project from './pages/Project';
import EditProject from './pages/EditProject/EditProject';
import ErrorBoundary from './components/ErrorBoundary';
import { DataContextProvider } from './contexts/DataContext';

function App() {
  return (
    <ErrorBoundary>
      <DataContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<Project />} />
          <Route path="/projects/new" element={<EditProject addOrEdit="add" key="add" />} />
          <Route path="/projects/edit" element={<EditProject key="edit" />} />
          <Route path="/projects/update" element={<SubmitUpdate />} />
        </Routes>
      </DataContextProvider>
    </ErrorBoundary>
  )
}

export default App
