import { Routes, Route } from 'react-router-dom';
import AgendamentoPage from './pages/AgendamentoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<AgendamentoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rota Protegida para o Admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/controle" element={<AdminPage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;