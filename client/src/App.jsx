import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx'; 
import Sidebar from './components/Sidebar.jsx';
import { AppContextProvider } from './context/Appcontext.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from './pages/About.jsx';
import Settings from './pages/Settings.jsx';
import { useEffect } from 'react';
import AddDevice from './pages/AddDevices.jsx';
import WeeklyGraphPage from './pages/WeeklyGraphPage.jsx';


const AppLayout = () => {
  const location = useLocation();

  const protectedRoutes = [
    "/dashboard",
    "/about",
    "/settings",
    "/add-device",
    "/week-data",
  ];

  const showSidebar = protectedRoutes.includes(location.pathname);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen flex overflow-hidden">
      {showSidebar && <Sidebar />}

      <main
        className={`
          flex-1
          ${showSidebar ? "pt-14 md:pt-0" : "pt-0"}
          overflow-x-hidden
        `}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-device" element={<AddDevice />} />
          <Route path="/week-data" element={<WeeklyGraphPage />} />
        </Routes>
      </main>
    </div>
  );
};


const App = () => {
  return (
    <AppContextProvider>
      <AppLayout />
      <ToastContainer position="top-center" theme="dark" autoClose={2000}  style={{marginTop:"30px"}}/>
    </AppContextProvider>
  );
};

export default App;
