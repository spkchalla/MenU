import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Menu } from "./pages/Menu";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreateMenu } from "./pages/CreateMenu";
import { UpdateMenu } from "./pages/UpdateMenu";
import { ApproveAdmin } from "./pages/ApproveAdmin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { ThemeProvider } from "./context/ThemeContext";

import "./App.css";
import { Stats } from "./pages/Stats";

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-menu" element={<CreateMenu />} />
          <Route path="/admin/update-menu" element={<UpdateMenu />} />
          <Route path="/admin/approve" element={<ApproveAdmin />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/stats" element={<Stats/>}></Route>
        </Routes>

      </Layout>
    </ThemeProvider>
  );
};

export default App;
