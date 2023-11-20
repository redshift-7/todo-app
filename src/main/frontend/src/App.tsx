import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Login } from "./components/account/Login";
import { Register } from "./components/account/Register";
import { Profile } from "./components/account/Profile";

import TasksList from "./components/task/TaskList";
import { NavigationBar } from './components/navbar/NavigationBar'
import { AuthProvider } from "./components/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/todo-app">
        <div className='App'>
          {<NavigationBar/>}
        </div>
          <Routes>
            <Route index path="/" element={<TasksList/>}/>
            <Route index path="/tasks" element={<TasksList/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
          </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
