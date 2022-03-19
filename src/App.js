import React from "react";
import Header from "./components/Header";
import Table from "./components/Table";
import UserDetails from "./components/userDetails";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <div className="app">
    <Router>
        <Header />
        <Routes >
          <Route path="/" element={<Navigate to="/users" replace />}/>
          <Route path="/users" element={<Table />}/>
          <Route path="/users/:username/:page" element={<UserDetails />} />
        </Routes >
    </Router>
    </div>
 
  );
}

export default App;
