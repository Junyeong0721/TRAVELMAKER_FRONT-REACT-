import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import SignUp from './pages/signUp/SignUp';
import MyPage from './pages/MyPage/MyPage';
import AiPage from './pages/AI/AiPage';
import FriendPage from './pages/Friend/FriendPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/Sign" element ={<SignUp />} />
          <Route path="/MyPage" element ={<MyPage />} />
          <Route path="/AiPage" element ={<AiPage />} />
          <Route path="/FriendPage" element ={<FriendPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;