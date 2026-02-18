import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Menu } from "./pages/Menu";
import { SignIn } from "./pages/SignIn";
import { Register } from "./pages/Register";
import { CreateMenu } from "./pages/CreateMenu";
import { UpdateMenu } from "./pages/UpdateMenu";
import { ApproveAdmin } from "./pages/ApproveAdmin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { ThemeProvider } from "./context/ThemeContext";

import "./App.css";
import { Stats } from "./pages/Stats";
import { InstallGuide } from "./pages/InstallGuide";
import { About } from "./pages/About";
import { Privacy } from "./pages/Privacy";
import { TermsComponent } from "./pages/Terms";
import { Suggestions } from "./pages/Suggestions";
import { AdminSuggestionDashboard } from "./pages/AdminSuggestionDashboard";

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
  const isPreview = process.env.VERCEL_ENV === "preview" || window.location.hostname.includes("-git-");

  return (
    <ThemeProvider>
      {isPreview && (
        <div
          style={{
            background: "#f59e0b",
            color: "#000",
            padding: "8px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ⚠️ You are viewing a Preview Build. Authentication is disabled.
        </div>
      )}
      <Layout>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-menu" element={<CreateMenu />} />
          <Route path="/admin/update-menu" element={<UpdateMenu />} />
          <Route path="/admin/approve" element={<ApproveAdmin />} />
          <Route path="/admin/suggestions" element={<AdminSuggestionDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/stats" element={<Stats />}></Route>
          <Route path="/install" element={<InstallGuide />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<TermsComponent />} />
          <Route path="/suggestions" element={<Suggestions />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
