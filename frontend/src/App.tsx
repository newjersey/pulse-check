import { Routes, Route } from 'react-router';
import Projects from './pages/Projects';
import './App.css'
import SubmitUpdate from './pages/AddUpdate/AddUpdate';
import { DataContextProvider } from './contexts/DataContext';
import Login from './pages/Login';
import Project from './pages/Project';
import EditProject from './pages/EditProject/EditProject';

function App() {
  return (
    <DataContextProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Projects />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<Project />} />
        <Route path="/projects/new" element={<EditProject addOrEdit="add" />} />
        <Route path="/projects/edit" element={<EditProject />} />
        <Route path="/projects/update" element={<SubmitUpdate />} />
      </Routes>
    </DataContextProvider>
  )
}

export default App
