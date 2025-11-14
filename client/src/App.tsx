import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ResumeEditor from './pages/ResumeEditor';
import Templates from './pages/Templates';
import Login from './pages/Auth/Login';
import './App.css';
import Resumes from './pages/Resumes';
import NotFound from './pages/NotFound';
import CreateResume from './pages/CreateResume';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/resumes/create" element={<CreateResume />} />
          <Route path="/resumes/:id/edit" element={<ResumeEditor />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
