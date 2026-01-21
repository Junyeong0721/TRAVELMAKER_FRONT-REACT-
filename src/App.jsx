import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login/Login';
import Main from './pages/Main/Main';
import SignUp from './pages/signUp/SignUp';
import MyPage from './pages/MyPage/MyPage';
import AiPage from './pages/AI/AiPage';
import FriendPage from './pages/Friend/FriendPage';
import CommunityPage from './pages/Community/CommunityPage';
import WritePage from './pages/Write/WritePage';
import DetailPage from './pages/Detail/DetailPage';
import WriteInfo from './pages/WriteInfo/WriteInfo';
import './App.css';
import MyTravelPage from './pages/MyPage/MyTravelPage';
import PlanEditPage from './pages/PlanEditPage';


function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/Sign" element ={<SignUp />} />
          <Route path="/MyPage" element ={<MyPage />} />
          <Route path="/AiPage" element ={<AiPage />} />
          <Route path="/FriendPage" element ={<FriendPage />} />
          <Route path="/CommunityPage" element ={<CommunityPage />} />
          <Route path="/WritePage" element ={<WritePage />} />
          <Route path="/DetailPage" element ={<DetailPage />} />
          <Route path="/WRiteInfo" element ={<WriteInfo />} />
          <Route path="/my-travels" element={<MyTravelPage />} />
          <Route path="/DetailPage/:idx" element ={<DetailPage />} />
          <Route path="/WriteInfo" element ={<WriteInfo />} />
          <Route path="/plan/edit/:planIdx" element={<PlanEditPage />} />
          
        </Routes>
      </div>
    </Router>
  );
}
  
export default App;