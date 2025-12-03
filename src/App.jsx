import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Membership from "./pages/Membership";
import Scholarships from "./pages/Scholarships";
import Store from "./pages/Store";
import Checkout from "./pages/Checkout";
import Return from "./pages/Return";
import Whoarewe from "./pages/Whoarewe";
import { Suspense } from "react";

function App() {
  return (
    <Router>
      <MainLayout>
        <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/whoarewe" element={<Whoarewe />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/store" element={<Store />} />
            
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/return" element={<Return />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  );
}

export default App;

