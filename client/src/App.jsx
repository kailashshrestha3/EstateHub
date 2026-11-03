import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import About from "./pages/About";
import SignOut from "./pages/SignOut";
import Header from "./components/Header";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/signout" element={<SignOut />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
