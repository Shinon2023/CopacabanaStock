import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./page/Home/home";
import Profile from "./page/Profile/profile";
import Stock from "./page/Stock/stock";
import History from "./page/History/history";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import Document from "./page/Document/document";
import Login from "./page/Login/login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/document" element={<Document />} />
        <Route path="/stock" element={<ProtectedRoute component={Stock} />} />
        <Route
          path="/history"
          element={<ProtectedRoute component={History} />}
        />
        <Route path="/pleaselogin" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
